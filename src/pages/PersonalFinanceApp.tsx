import { useState, useCallback, useEffect } from "react"
import type { Transaction, NewTransaction } from "../types/transaction"
import { getIconForCategory, getColorForCategory } from "../utils/categories"
import { sqliteManager, type TransactionDB } from "../utils/sqlite-manager"
import { Header } from "../components/header"
import { BalanceCard } from "../components/balance-card"
import { ActionButtons } from "../components/action-buttons"
import { TransactionsList } from "../components/transactions-list"
import { StatsCards } from "../components/stats-cards"
import { ExpensesChart } from "../components/expenses-chart"
import { Footer } from "../components/footer"
import { BackgroundDecorations } from "../components/background-decorations"
import { TransactionDialog } from "../components/transaction-dialog"

const initialTransactionState: NewTransaction = {
  amount: "",
  description: "",
  category: "Comida",
}

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

export default function PersonalFinanceApp() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [newTransaction, setNewTransaction] = useState<NewTransaction>(initialTransactionState)
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false)
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)

  // Cargar transacciones desde SQLite al montar el componente
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        await sqliteManager.init()
        const dbTransactions = await sqliteManager.obtenerTodasLasTransacciones()
        const convertedTransactions = dbTransactions.map(convertDBTransactionToTransaction)
        setTransactions(convertedTransactions)
      } catch (error) {
        console.error("Error al cargar transacciones desde SQLite:", error)
      }
    }

    loadTransactions()
  }, [])

  const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0)
  const totalExpenses = Math.abs(transactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.amount, 0))

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, transaction) => {
        const category = transaction.category
        acc[category] = (acc[category] || 0) + Math.abs(transaction.amount)
        return acc
      },
      {} as Record<string, number>,
    )

  const maxExpense = Math.max(...Object.values(expensesByCategory), 1)

  const resetForm = useCallback(() => {
    setNewTransaction(initialTransactionState)
  }, [])

  const handleOpenIncomeDialog = useCallback(() => {
    setNewTransaction({ ...initialTransactionState, category: "Trabajo" })
    setIsIncomeDialogOpen(true)
  }, [])

  const handleOpenExpenseDialog = useCallback(() => {
    setNewTransaction({ ...initialTransactionState, category: "Comida" })
    setIsExpenseDialogOpen(true)
  }, [])

  const handleCloseIncomeDialog = useCallback(() => {
    setIsIncomeDialogOpen(false)
    resetForm()
  }, [resetForm])

  const handleCloseExpenseDialog = useCallback(() => {
    setIsExpenseDialogOpen(false)
    resetForm()
  }, [resetForm])

  const addTransaction = useCallback(
    async (type: "income" | "expense") => {
      // Validar que los campos estén completos
      if (!newTransaction.amount || !newTransaction.description.trim()) {
        console.warn("Faltan campos requeridos")
        return
      }

      try {
        // Convertir y validar el monto
        const amountValue = Number.parseFloat(newTransaction.amount)
        if (isNaN(amountValue) || amountValue <= 0) {
          console.warn("El monto debe ser un número válido mayor a 0")
          return
        }

        // Calcular el monto según el tipo (ingreso positivo, gasto negativo)
        const amount = type === "income" ? amountValue : -amountValue

        // Asegurar que la base de datos esté inicializada
        await sqliteManager.init()

        // Preparar los datos para guardar
        const transactionDate = new Date().toLocaleDateString()
        const datosTransaccion = {
          type,
          amount,
          description: newTransaction.description.trim(),
          category: newTransaction.category,
          date: transactionDate,
        }

        // Guardar en SQLite
        const nuevoId = await sqliteManager.guardarTransaccion(datosTransaccion)

        // Verificar que se obtuvo un ID válido
        if (!nuevoId || nuevoId <= 0) {
          throw new Error("No se pudo obtener un ID válido después de guardar")
        }

        // Crear el objeto de transacción completo para la UI
        const nuevaTransaccion: Transaction = {
          id: nuevoId,
          type,
          amount,
          description: datosTransaccion.description,
          category: datosTransaccion.category,
          date: transactionDate,
          icon: getIconForCategory(datosTransaccion.category, type),
          color: getColorForCategory(datosTransaccion.category, type),
        }

        // Actualizar el estado local
        setTransactions((prev) => [nuevaTransaccion, ...prev])

        // Cerrar el diálogo correspondiente
        if (type === "income") {
          handleCloseIncomeDialog()
        } else {
          handleCloseExpenseDialog()
        }

        console.log("Transacción guardada exitosamente con ID:", nuevoId)
      } catch (error) {
        console.error("Error al agregar transacción:", error)
        // Aquí podrías mostrar un mensaje de error al usuario
        alert("Error al guardar la transacción. Por favor, intenta de nuevo.")
      }
    },
    [newTransaction, handleCloseIncomeDialog, handleCloseExpenseDialog],
  )

  const toggleShowAllTransactions = useCallback(() => {
    setShowAllTransactions((prev) => !prev)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundDecorations />

      <div className="relative z-10 p-3 sm:p-4 pb-8">
        <div className="max-w-sm mx-auto space-y-4 sm:space-y-6">
          <Header />

          <BalanceCard balance={balance} hasTransactions={transactions.length > 0} />

          <ActionButtons onIncomeClick={handleOpenIncomeDialog} onExpenseClick={handleOpenExpenseDialog} />

          <TransactionsList
            transactions={transactions}
            showAll={showAllTransactions}
            onToggleShowAll={toggleShowAllTransactions}
          />

          <StatsCards totalIncome={totalIncome} totalExpenses={totalExpenses} />

          <ExpensesChart expensesByCategory={expensesByCategory} maxExpense={maxExpense} />

          <Footer hasTransactions={transactions.length > 0} />
        </div>
      </div>

      <TransactionDialog
        type="income"
        isOpen={isIncomeDialogOpen}
        onOpenChange={handleCloseIncomeDialog}
        newTransaction={newTransaction}
        onTransactionChange={setNewTransaction}
        onAddTransaction={() => addTransaction("income")}
        categories={["Trabajo", "Freelance", "Inversiones", "Regalos", "Otros"]}
      />

      <TransactionDialog
        type="expense"
        isOpen={isExpenseDialogOpen}
        onOpenChange={handleCloseExpenseDialog}
        newTransaction={newTransaction}
        onTransactionChange={setNewTransaction}
        onAddTransaction={() => addTransaction("expense")}
        categories={["Comida", "Transporte", "Entretenimiento", "Hogar", "Salud", "Educación", "Otros"]}
      />
    </div>
  )
}


