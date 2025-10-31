import React from "react"

import { PlusCircle, MinusCircle, DollarSign, Receipt, Target, X } from "lucide-react"
import type { NewTransaction } from "../types/transaction"

interface TransactionDialogProps {
  type: "income" | "expense"
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  newTransaction: NewTransaction
  onTransactionChange: (transaction: NewTransaction) => void
  onAddTransaction: () => void | Promise<void>
  categories: string[]
  transactionId?: number
  isEditing?: boolean
}

export function TransactionDialog({
  type,
  isOpen,
  onOpenChange,
  newTransaction,
  onTransactionChange,
  onAddTransaction,
  categories,
  transactionId,
  isEditing = false,
}: TransactionDialogProps) {
  const isIncome = type === "income"
  const Icon = isIncome ? PlusCircle : MinusCircle

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTransaction.amount && newTransaction.description.trim()) {
      await onAddTransaction()
    }
  }

  // Efecto para manejar el foco y la accesibilidad cuando se abre el modal
  React.useEffect(() => {
    if (isOpen) {
      // Enfocar el primer input cuando se abre el modal
      const firstInput = document.getElementById(`${type}-amount`)
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100)
      }

      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden"

      // Manejar tecla Escape para cerrar
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onOpenChange(false)
        }
      }

      document.addEventListener("keydown", handleEscape)

      return () => {
        document.body.style.overflow = ""
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [isOpen, type, onOpenChange])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${type}-dialog-title`}
      aria-describedby={`${type}-dialog-description`}
    >
      {/* Backdrop with blur only */}
      <div className="absolute inset-0 backdrop-blur-lg" aria-hidden="true" />

      {/* Dialog */}
      <div
        className={`relative bg-gradient-to-br ${
          isIncome ? "from-green-50 to-emerald-50 border-green-300" : "from-red-50 to-pink-50 border-red-300"
        } border-4 rounded-3xl max-w-sm w-full shadow-2xl transform transition-all duration-300 scale-100`}
        style={{ borderRadius: "25px" }}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 hover:bg-opacity-50 transition-colors z-10"
          type="button"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4">
          <div
            id={`${type}-dialog-title`}
            className={`flex items-center gap-3 ${
              isIncome ? "text-green-800" : "text-red-800"
            } text-lg sm:text-xl font-bold`}
          >
            <div className={`${isIncome ? "bg-green-200" : "bg-red-200"} p-2 rounded-full flex-shrink-0`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </div>
            <span className="truncate">
              {isEditing ? "Editar" : "Nuevo"} {isIncome ? "Ingreso" : "Gasto"}
            </span>
          </div>
          <p id={`${type}-dialog-description`} className="sr-only">
            Formulario para {isEditing ? "editar un" : "agregar un nuevo"} {isIncome ? "ingreso" : "gasto"} a tus finanzas personales
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
          {/* Amount Field */}
          <div>
            <label
              htmlFor={`${type}-amount`}
              className={`${
                isIncome ? "text-green-800" : "text-red-800"
              } font-medium flex items-center gap-2 mb-2 text-sm`}
            >
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Cantidad</span>
            </label>
            <input
              id={`${type}-amount`}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={newTransaction.amount}
              onChange={(e) =>
                onTransactionChange({
                  ...newTransaction,
                  amount: e.target.value,
                })
              }
              className={`w-full px-4 py-3 border-2 ${
                isIncome
                  ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                  : "border-red-300 focus:border-red-500 focus:ring-red-200"
              } rounded-xl text-lg focus:outline-none focus:ring-2 transition-colors bg-white`}
              required
              autoFocus
            />
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor={`${type}-description`}
              className={`${
                isIncome ? "text-green-800" : "text-red-800"
              } font-medium flex items-center gap-2 mb-2 text-sm`}
            >
              <Receipt className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Descripción</span>
            </label>
            <input
              id={`${type}-description`}
              type="text"
              placeholder={isIncome ? "Ej: Salario, Freelance..." : "Ej: Café, Gasolina..."}
              value={newTransaction.description}
              onChange={(e) =>
                onTransactionChange({
                  ...newTransaction,
                  description: e.target.value,
                })
              }
              className={`w-full px-4 py-3 border-2 ${
                isIncome
                  ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                  : "border-red-300 focus:border-red-500 focus:ring-red-200"
              } rounded-xl text-lg focus:outline-none focus:ring-2 transition-colors bg-white`}
              required
              maxLength={50}
            />
          </div>

          {/* Category Field */}
          <div>
            <label
              htmlFor={`${type}-category`}
              className={`${
                isIncome ? "text-green-800" : "text-red-800"
              } font-medium flex items-center gap-2 mb-2 text-sm`}
            >
              <Target className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Categoría</span>
            </label>
            <select
              id={`${type}-category`}
              value={newTransaction.category}
              onChange={(e) =>
                onTransactionChange({
                  ...newTransaction,
                  category: e.target.value,
                })
              }
              className={`w-full px-4 py-3 border-2 ${
                isIncome
                  ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                  : "border-red-300 focus:border-red-500 focus:ring-red-200"
              } rounded-xl text-lg focus:outline-none focus:ring-2 transition-colors bg-white cursor-pointer`}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!newTransaction.amount || !newTransaction.description}
              className={`flex-1 bg-gradient-to-r ${
                isIncome
                  ? "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-green-300 disabled:to-emerald-300"
                  : "from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-red-300 disabled:to-pink-300"
              } text-white font-bold py-3 px-4 rounded-xl text-lg transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{isEditing ? "Guardar" : "Agregar"} {isIncome ? "Ingreso" : "Gasto"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


