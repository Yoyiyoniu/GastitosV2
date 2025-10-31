import { useNavigate } from "react-router-dom"
import { List, Sparkles, ChevronDown, Target } from "lucide-react"
import type { Transaction } from "../types/transaction"

interface TransactionsListProps {
  transactions: Transaction[]
  showAll: boolean
  onToggleShowAll: () => void
}

export function TransactionsList({ transactions, showAll, onToggleShowAll }: TransactionsListProps) {
  const navigate = useNavigate()
  const displayedTransactions = showAll ? transactions : transactions.slice(0, 4)

  return (
    <div
      className="border-4 border-blue-300 shadow-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 hover:shadow-2xl transition-all duration-300"
      style={{ borderRadius: "25px 18px 30px 20px" }}
    >
      <div className="p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="w-full text-blue-800 text-base sm:text-lg md:text-xl flex items-center justify-between px-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              onClick={() => navigate("/transactions")}
              className="bg-gradient-to-br from-blue-200 to-indigo-200 hover:from-blue-300 hover:to-indigo-300 p-2 sm:p-2.5 rounded-full flex-shrink-0 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
              type="button"
              aria-label="Ver todos los movimientos del mes"
            >
              <List className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <span className="truncate text-left font-bold">
              Movimientos del Mes
            </span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
          </div>
          {transactions.length > 0 && (
            <span className="text-xs sm:text-sm bg-blue-200 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full font-bold flex-shrink-0">
              {transactions.length}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
        {transactions.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <div className="bg-blue-100 p-3 sm:p-4 rounded-full w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <List className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" />
            </div>
            <p
              className="text-blue-700 text-base sm:text-lg font-medium px-4"
            >
              No hay movimientos aún
            </p>
            <p className="text-blue-600 text-sm sm:text-base mt-2 px-4">¡Agrega tu primer ingreso o gasto!</p>
          </div>
        ) : (
          <>
            {displayedTransactions.map((transaction) => {
              const IconComponent = transaction.icon
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-2xl border-3 sm:border-4 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 active:scale-98 gap-2 sm:gap-3"
                  style={{ borderRadius: "20px 15px 22px 18px" }}
                >
                  <div className="flex items-center space-x-2.5 sm:space-x-4 min-w-0 flex-1">
                    <div
                      className={`p-2 sm:p-3 rounded-full bg-opacity-20 shadow-md flex-shrink-0 ${
                        transaction.color.includes("green")
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
                      <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${transaction.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className="font-bold text-gray-800 text-sm sm:text-base md:text-lg truncate"
                      >
                        {transaction.description}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                        <Target className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {transaction.category} • {transaction.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-bold text-base sm:text-lg md:text-xl flex-shrink-0 ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount)}
                  </div>
                </div>
              )
            })}
            {transactions.length > 4 && !showAll && (
              <div className="text-center py-2 sm:py-3">
                <button
                  onClick={onToggleShowAll}
                  className="text-blue-600 hover:text-blue-800 text-sm sm:text-base font-medium flex items-center gap-1.5 sm:gap-2 mx-auto transition-colors bg-blue-50 hover:bg-blue-100 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full active:scale-95"
                >
                  Ver {transactions.length - 4} movimientos más
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}


