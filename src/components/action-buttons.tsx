import { PlusCircle, MinusCircle, TrendingUp, TrendingDown } from "lucide-react"

interface ActionButtonsProps {
  onIncomeClick: () => void
  onExpenseClick: () => void
}

export function ActionButtons({ onIncomeClick, onExpenseClick }: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4">
      <button
        onClick={onIncomeClick}
        className="h-16 sm:h-18 md:h-20 bg-gradient-to-r from-green-300 to-emerald-300 hover:from-green-400 hover:to-emerald-400 text-green-800 border-3 sm:border-4 border-green-400 shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95 px-3 sm:px-4 cursor-pointer"
        style={{ borderRadius: "25px 20px 28px 15px" }}
      >
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 md:gap-4 w-full min-w-0">
          <div className="bg-white bg-opacity-30 p-2 sm:p-2.5 md:p-3 rounded-full flex-shrink-0">
            <PlusCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
          </div>
          <div className="text-left min-w-0 flex-1">
            <div className="text-base sm:text-lg md:text-xl font-bold truncate">Agregar Ingreso</div>
            <div className="text-xs sm:text-sm opacity-80 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">Suma a tu balance</span>
            </div>
          </div>
        </div>
      </button>

      <button
        onClick={onExpenseClick}
        className="h-16 sm:h-18 md:h-20 bg-gradient-to-r from-red-300 to-pink-300 hover:from-red-400 hover:to-pink-400 text-red-800 border-3 sm:border-4 border-red-400 shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95 px-3 sm:px-4 cursor-pointer"
        style={{ borderRadius: "20px 28px 15px 25px" }}
      >
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 md:gap-4 w-full min-w-0">
          <div className="bg-white bg-opacity-30 p-2 sm:p-2.5 md:p-3 rounded-full flex-shrink-0">
            <MinusCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
          </div>
          <div className="text-left min-w-0 flex-1">
            <div className="text-base sm:text-lg md:text-xl font-bold truncate">Agregar Gasto</div>
            <div className="text-xs sm:text-sm opacity-80 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">Registra tus gastos</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}


