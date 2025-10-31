import { Wallet, Sparkles, Star, PiggyBank, Heart } from "lucide-react"

interface BalanceCardProps {
  balance: number
  hasTransactions: boolean
}

export function BalanceCard({ balance, hasTransactions }: BalanceCardProps) {
  return (
    <div
      className="border-3 sm:border-4 border-amber-300 shadow-2xl bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 hover:shadow-3xl transition-all duration-500 relative overflow-hidden"
      style={{ borderRadius: "25px 20px 28px 18px" }}
    >
      <div className="absolute top-2 right-2 opacity-20">
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
      </div>
      <div className="absolute bottom-2 left-2 opacity-20">
        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
      </div>
      <div className="text-center pb-2 sm:pb-3 pt-4 sm:pt-6">
        <div
          className="text-amber-800 text-base sm:text-lg md:text-xl flex items-center justify-center gap-2 sm:gap-3 px-2 font-bold mb-3 sm:mb-4"
        >
          <div className="bg-gradient-to-br from-yellow-200 to-orange-200 p-1.5 sm:p-2 rounded-full flex-shrink-0">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
          </div>
          <span className="truncate">Mi Saldo Total</span>
        </div>
      </div>
      <div className="text-center pb-4 sm:pb-6 px-4">
        <div
          className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 truncate ${
            balance < 0 ? "text-red-700" : "text-green-700"
          }`}
        >
          ${balance.toLocaleString()}
        </div>
        <div className="text-xs sm:text-sm md:text-base text-amber-600 flex items-center justify-center gap-1.5 sm:gap-2 px-2">
          <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="truncate">{!hasTransactions ? "¡Comienza a registrar!" : "¡Excelente trabajo!"}</span>
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}


