import { useNavigate } from "react-router-dom"
import { TrendingUp, TrendingDown, Target, Receipt } from "lucide-react"

interface StatsCardsProps {
  totalIncome: number
  totalExpenses: number
}

export function StatsCards({ totalIncome, totalExpenses }: StatsCardsProps) {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
      <div
        className="border-3 sm:border-4 border-green-200 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300"
        style={{ borderRadius: "20px 15px 18px 22px" }}
      >
        <div className="p-2.5 sm:p-3 md:p-4 text-center">
          <div className="flex items-center justify-center mb-1.5 sm:mb-2">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-600" />
          </div>
          <div
            className="text-base sm:text-lg md:text-xl font-bold text-green-700 truncate"
          >
            ${totalIncome.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-green-600 flex items-center justify-center gap-1 mt-1">
            <Target className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">Ingresos</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/transactions")}
        className="border-3 sm:border-4 border-red-200 shadow-lg bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-95"
        style={{ borderRadius: "15px 22px 20px 16px" }}
        aria-label="Ver todos los movimientos del mes"
        type="button"
      >
        <div className="p-2.5 sm:p-3 md:p-4 text-center">
          <div className="flex items-center justify-center mb-1.5 sm:mb-2">
            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-600" />
          </div>
          <div className="text-xs sm:text-sm text-red-600 flex items-center justify-center gap-1 mt-1">
            <Receipt className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">Gastos</span>
          </div>
        </div>
      </button>
    </div>
  )
}


