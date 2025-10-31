import { Cat, Sparkles, PiggyBank, Wallet, CreditCard } from "lucide-react"

export function Header() {
  return (
    <div className="text-center py-4 sm:py-5 md:py-6 relative">
      <div className="absolute -top-1 sm:-top-2 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-1.5 sm:space-x-2 opacity-30">
          <PiggyBank className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
          <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
          <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
        </div>
      </div>
      <h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-800 mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3"
      >
        <div className="bg-gradient-to-br from-orange-200 to-pink-200 p-2 sm:p-2.5 md:p-3 rounded-full border-3 sm:border-4 border-orange-300 shadow-lg">
          <Cat className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-700" />
        </div>
        <span className="truncate">Gastito</span>
      </h1>
      <p className="text-amber-700 text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 sm:gap-2 px-4">
        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        <span className="truncate">Tu compañero financiero</span>
        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
      </p>
    </div>
  )
}


