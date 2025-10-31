import React from "react"
import { BarChart3, Star } from "lucide-react"
import { getIconForCategory, getColorForCategory } from "../utils/categories"

interface ExpensesChartProps {
  expensesByCategory: Record<string, number>
  maxExpense: number
}

export function ExpensesChart({ expensesByCategory, maxExpense }: ExpensesChartProps) {
  if (Object.keys(expensesByCategory).length === 0) {
    return null
  }

  return (
    <div
      className="border-3 sm:border-4 border-purple-300 shadow-xl bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 hover:shadow-2xl transition-all duration-300"
      style={{ borderRadius: "28px 20px 25px 22px" }}
    >
      <div className="p-4 sm:p-5 md:p-6 pb-3 sm:pb-4">
        <div
          className="text-purple-800 text-base sm:text-lg md:text-xl flex items-center gap-2 sm:gap-3 px-2 font-bold"
        >
          <div className="bg-gradient-to-br from-purple-200 to-pink-200 p-1.5 sm:p-2 rounded-full flex-shrink-0">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="truncate">Mis Gastos del Mes</span>
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
        </div>
      </div>

      <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
        <div className="space-y-3.5 sm:space-y-4 md:space-y-5">
          {Object.entries(expensesByCategory).map(([category, amount], index) => (
            <div key={category} className="space-y-2 sm:space-y-2.5 md:space-y-3">
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <div
                    className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                      index % 6 === 0
                        ? "bg-orange-200"
                        : index % 6 === 1
                          ? "bg-blue-200"
                          : index % 6 === 2
                            ? "bg-purple-200"
                            : index % 6 === 3
                              ? "bg-pink-200"
                              : index % 6 === 4
                                ? "bg-green-200"
                                : "bg-yellow-200"
                    }`}
                  >
                    {React.createElement(getIconForCategory(category, "expense"), {
                      className: `w-4 h-4 sm:w-5 sm:h-5 ${getColorForCategory(category, "expense")}`,
                    })}
                  </div>
                  <span
                    className="text-sm sm:text-base md:text-lg font-bold text-gray-700 truncate"
                  >
                    {category}
                  </span>
                </div>
                <span
                  className="text-base sm:text-lg md:text-xl font-bold text-gray-800 flex-shrink-0"
                >
                  ${amount}
                </span>
              </div>
              <div
                className="w-full bg-gray-200 rounded-full h-3 sm:h-4 shadow-inner"
                style={{ borderRadius: "12px 15px 10px 18px" }}
              >
                <div
                  className={`h-3 sm:h-4 rounded-full transition-all duration-1000 shadow-sm ${
                    index % 6 === 0
                      ? "bg-gradient-to-r from-orange-300 to-orange-400"
                      : index % 6 === 1
                        ? "bg-gradient-to-r from-blue-300 to-blue-400"
                        : index % 6 === 2
                          ? "bg-gradient-to-r from-purple-300 to-purple-400"
                          : index % 6 === 3
                            ? "bg-gradient-to-r from-pink-300 to-pink-400"
                            : index % 6 === 4
                              ? "bg-gradient-to-r from-green-300 to-green-400"
                              : "bg-gradient-to-r from-yellow-300 to-yellow-400"
                  }`}
                  style={{
                    width: `${(amount / maxExpense) * 100}%`,
                    borderRadius: "10px 12px 8px 15px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


