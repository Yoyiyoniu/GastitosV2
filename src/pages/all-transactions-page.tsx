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
    const [loadError, setLoadError] = useState<string | null>(null)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentTransaction, setCurrentTransaction] = useState<NewTransaction>(initialTransactionState)
    const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

    // Función para cargar transacciones
    const loadTransactions = useCallback(async () => {
        try {
            setIsLoading(true)
            setLoadError(null)
            await sqliteManager.init()
            const dbTransactions = await sqliteManager.obtenerTodasLasTransacciones()

            if (!dbTransactions || !Array.isArray(dbTransactions)) {
                console.warn("Las transacciones no son un array válido")
                setTransactions([])
                return
            }

            const convertedTransactions = dbTransactions
                .map((dbTransaction) => {
                    try {
                        return convertDBTransactionToTransaction(dbTransaction)
                    } catch (error) {
                        console.error("Error al convertir transacción:", dbTransaction, error)
                        return null
                    }
                })
                .filter((transaction): transaction is Transaction => transaction !== null)

            setTransactions(convertedTransactions)
        } catch (error: any) {
            console.error("Error al cargar transacciones:", error)
            setTransactions([])
            setLoadError(error?.message || "No se pudieron cargar las transacciones.")
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

    // Función auxiliar para parsear fechas de diferentes formatos
    const parseTransactionDate = (dateString: string): Date | null => {
        if (!dateString) return null

        try {
            // Intentar parsear como fecha ISO
            if (dateString.includes("T") || dateString.includes("-")) {
                const date = new Date(dateString)
                if (!isNaN(date.getTime())) return date
            }

            // Intentar parsear formato MM/DD/YYYY o DD/MM/YYYY
            const parts = dateString.split("/")
            if (parts.length === 3) {
                const [part1, part2, part3] = parts.map(Number)
                // Asumir formato MM/DD/YYYY (si part1 > 12, entonces es DD/MM/YYYY)
                if (part1 > 12) {
                    // Formato DD/MM/YYYY
                    const date = new Date(part3, part2 - 1, part1)
                    if (!isNaN(date.getTime())) return date
                } else {
                    // Formato MM/DD/YYYY
                    const date = new Date(part3, part1 - 1, part2)
                    if (!isNaN(date.getTime())) return date
                }
            }

            // Intentar parseo directo
            const date = new Date(dateString)
            if (!isNaN(date.getTime())) return date

            return null
        } catch (error) {
            console.error("Error al parsear fecha:", dateString, error)
            return null
        }
    }

    // Ordenar todas las transacciones por fecha (más recientes primero)
    const allTransactionsSorted = transactions
        .map((transaction) => {
            const transactionDate = parseTransactionDate(transaction.date)
            return { transaction, transactionDate }
        })
        .map(({ transaction }) => transaction)
        .sort((a, b) => {
            // Ordenar por fecha, más recientes primero
            const dateA = parseTransactionDate(a.date)
            const dateB = parseTransactionDate(b.date)

            if (!dateA || !dateB) return 0

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
                                Todos los Movimientos
                            </h1>
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div
                        className="border-4 border-blue-300 shadow-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
                        style={{ borderRadius: "25px 18px 30px 20px" }}
                    >
                        {loadError && (
                            <div className="px-6 pt-6">
                                <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3">
                                    {loadError}
                                </div>
                            </div>
                        )}
                        <div className="p-6 pb-4">
                            <div className="text-blue-800 text-lg sm:text-xl flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold">
                                        Total: {allTransactionsSorted.length} movimientos
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 px-6 pb-6">
                            {allTransactionsSorted.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <List className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <p
                                        className="text-blue-700 text-lg font-medium px-4"
                                    >
                                        No hay movimientos para mostrar
                                    </p>
                                </div>
                            ) : (
                                allTransactionsSorted.map((transaction) => {
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
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <div
                                                    className={`font-bold text-base sm:text-lg md:text-xl ${transaction.amount > 0 ? "text-green-600" : "text-red-600"
                                                        }`}
                                                >
                                                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount)}
                                                </div>
                                                <button
                                                    onClick={() => handleEdit(transaction)}
                                                    className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors flex-shrink-0"
                                                    aria-label="Editar transacción"
                                                    type="button"
                                                >
                                                    <Edit2 className="w-4 h-4 text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(transaction)}
                                                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors flex-shrink-0"
                                                    aria-label="Eliminar transacción"
                                                    type="button"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
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

