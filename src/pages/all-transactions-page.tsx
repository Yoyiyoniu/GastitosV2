import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, List, Target, Edit2, Trash2 } from "lucide-react"
import type { Transaction, NewTransaction } from "../types/transaction"
import type { TransactionDB } from "../utils/sqlite-manager"
import { sqliteManager } from "../utils/sqlite-manager"
import { getIconForCategory, getColorForCategory } from "../utils/categories"
import { BackgroundDecorations } from "../components/background-decorations"
import { TransactionDialog } from "../components/transaction-dialog"
import { ConfirmDialog } from "../components/confirm-dialog"
import { expenseCategories, incomeCategories } from "../utils/categories"

// Función auxiliar para convertir TransactionDB a Transaction
const convertDBTransactionToTransaction = (dbTransaction: TransactionDB): Transaction => {
    return {
        id: dbTransaction.id,
        type: dbTransaction.type,
        amount: dbTransaction.amount,
        description: dbTransaction.description,
        category: dbTransaction.category,
        date: dbTransaction.date,
        icon: getIconForCategory(dbTransaction.category, dbTransaction.type),
        color: getColorForCategory(dbTransaction.category, dbTransaction.type),
    }
}

const initialTransactionState: NewTransaction = {
    amount: "",
    description: "",
    category: "Comida",
}

export function AllTransactionsPage() {
    const navigate = useNavigate()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentTransaction, setCurrentTransaction] = useState<NewTransaction>(initialTransactionState)
    const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

    // Función para cargar transacciones
    const loadTransactions = useCallback(async () => {
        try {
            setIsLoading(true)
            await sqliteManager.init()
            const dbTransactions = await sqliteManager.obtenerTodasLasTransacciones()
            const convertedTransactions = dbTransactions.map(convertDBTransactionToTransaction)
            setTransactions(convertedTransactions)
        } catch (error) {
            console.error("Error al cargar transacciones:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Cargar transacciones desde SQLite
    useEffect(() => {
        loadTransactions()
    }, [loadTransactions])

    // Función para manejar edición
    const handleEdit = useCallback((transaction: Transaction) => {
        setEditingTransaction(transaction)
        setCurrentTransaction({
            amount: Math.abs(transaction.amount).toString(),
            description: transaction.description,
            category: transaction.category,
        })
        setIsDialogOpen(true)
    }, [])

    // Función para abrir el modal de confirmación de eliminación
    const handleDeleteClick = useCallback((transaction: Transaction) => {
        setDeletingTransaction(transaction)
        setIsConfirmDialogOpen(true)
    }, [])

    // Función para confirmar eliminación
    const handleConfirmDelete = useCallback(async () => {
        if (!deletingTransaction) return

        try {
            await sqliteManager.eliminarTransaccion(deletingTransaction.id)
            setDeletingTransaction(null)
            await loadTransactions()
        } catch (error) {
            console.error("Error al eliminar transacción:", error)
            alert("Error al eliminar la transacción. Por favor, intenta de nuevo.")
        }
    }, [deletingTransaction, loadTransactions])

    // Función para guardar la edición
    const handleSaveEdit = useCallback(async () => {
        if (!editingTransaction || !currentTransaction.amount || !currentTransaction.description.trim()) {
            return
        }

        try {
            const amountValue = Number.parseFloat(currentTransaction.amount)
            if (isNaN(amountValue) || amountValue <= 0) {
                return
            }

            const amount = editingTransaction.type === "income" ? amountValue : -amountValue

            await sqliteManager.actualizarTransaccion(editingTransaction.id, {
                type: editingTransaction.type,
                amount,
                description: currentTransaction.description.trim(),
                category: currentTransaction.category,
                date: editingTransaction.date,
            })

            setIsDialogOpen(false)
            setEditingTransaction(null)
            setCurrentTransaction(initialTransactionState)
            await loadTransactions()
        } catch (error) {
            console.error("Error al actualizar transacción:", error)
            alert("Error al actualizar la transacción. Por favor, intenta de nuevo.")
        }
    }, [editingTransaction, currentTransaction, loadTransactions])

    // Filtrar transacciones del mes actual
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const monthTransactions = transactions.filter((transaction) => {
        // Parsear la fecha que viene en formato local (ej: "12/25/2024")
        const [month, day, year] = transaction.date.split("/").map(Number)
        // Crear fecha correctamente (mes - 1 porque Date usa 0-indexado)
        const transactionDate = new Date(year, month - 1, day)
        return (
            transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
        )
    }).sort((a, b) => {
        // Ordenar por fecha, más recientes primero
        const [monthA, dayA, yearA] = a.date.split("/").map(Number)
        const [monthB, dayB, yearB] = b.date.split("/").map(Number)
        const dateA = new Date(yearA, monthA - 1, dayA)
        const dateB = new Date(yearB, monthB - 1, dayB)
        return dateB.getTime() - dateA.getTime()
    })

    if (isLoading) {
        return (
            <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
                <BackgroundDecorations />
                <div className="relative z-10 text-blue-600 text-xl">
                    Cargando...
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            <BackgroundDecorations />
            <div className="relative z-10 p-4 sm:p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate("/")}
                            className="p-2 rounded-full bg-white hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg"
                            aria-label="Volver al inicio"
                        >
                            <ArrowLeft className="w-6 h-6 text-blue-600" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-200 to-indigo-200 p-3 rounded-full">
                                <List className="w-6 h-6 text-blue-700" />
                            </div>
                            <h1
                                className="text-2xl sm:text-3xl font-bold text-blue-800"
                            >
                                Movimientos del Mes
                            </h1>
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div
                        className="border-4 border-blue-300 shadow-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
                        style={{ borderRadius: "25px 18px 30px 20px" }}
                    >
                        <div className="p-6 pb-4">
                            <div className="text-blue-800 text-lg sm:text-xl flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold">
                                        Total: {monthTransactions.length} movimientos
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 px-6 pb-6">
                            {monthTransactions.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <List className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <p
                                        className="text-blue-700 text-lg font-medium px-4"
                                    >
                                        No hay movimientos este mes
                                    </p>
                                </div>
                            ) : (
                                monthTransactions.map((transaction) => {
                                    const IconComponent = transaction.icon
                                    return (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between p-4 bg-white rounded-2xl border-4 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 gap-3"
                                            style={{ borderRadius: "20px 15px 22px 18px" }}
                                        >
                                            <div className="flex items-center space-x-4 min-w-0 flex-1">
                                                <div
                                                    className={`p-3 rounded-full bg-opacity-20 shadow-md flex-shrink-0 ${transaction.color.includes("green")
                                                        ? "bg-green-200"
                                                        : transaction.color.includes("orange")
                                                            ? "bg-orange-200"
                                                            : transaction.color.includes("blue")
                                                                ? "bg-blue-200"
                                                                : transaction.color.includes("purple")
                                                                    ? "bg-purple-200"
                                                                    : "bg-red-200"
                                                        }`}
                                                >
                                                    <IconComponent className={`w-6 h-6 ${transaction.color}`} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div
                                                        className="font-bold text-gray-800 text-base md:text-lg truncate"
                                                    >
                                                        {transaction.description}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                        <Target className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">
                                                            {transaction.category} • {transaction.date}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`font-bold text-lg md:text-xl flex-shrink-0 ${transaction.amount > 0 ? "text-green-600" : "text-red-600"
                                                        }`}
                                                >
                                                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(transaction)}
                                                        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                                                        aria-label="Editar transacción"
                                                        type="button"
                                                    >
                                                        <Edit2 className="w-4 h-4 text-blue-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(transaction)}
                                                        className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                                                        aria-label="Eliminar transacción"
                                                        type="button"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialog de edición */}
            {editingTransaction && (
                <TransactionDialog
                    type={editingTransaction.type}
                    isOpen={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) {
                            setEditingTransaction(null)
                            setCurrentTransaction(initialTransactionState)
                        }
                    }}
                    newTransaction={currentTransaction}
                    onTransactionChange={setCurrentTransaction}
                    onAddTransaction={handleSaveEdit}
                    categories={
                        editingTransaction.type === "income" ? incomeCategories : expenseCategories
                    }
                    transactionId={editingTransaction.id}
                    isEditing={true}
                />
            )}

            {/* Dialog de confirmación de eliminación */}
            <ConfirmDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => {
                    setIsConfirmDialogOpen(false)
                    setDeletingTransaction(null)
                }}
                onConfirm={handleConfirmDelete}
                title="Eliminar Transacción"
                message={
                    deletingTransaction
                        ? `¿Estás seguro de que quieres eliminar "${deletingTransaction.description}"? Esta acción no se puede deshacer.`
                        : "¿Estás seguro de que quieres eliminar esta transacción?"
                }
                confirmText="Eliminar"
                cancelText="Cancelar"
                type="danger"
            />
        </div>
    )
}

