import { Cat, Heart, Star, Sparkles, PiggyBank, Target, Zap, Gift } from "lucide-react"

interface FooterProps {
  hasTransactions: boolean
}

export function Footer({ hasTransactions }: FooterProps) {
  return (
    <div className="text-center py-6 relative">
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-3 opacity-40">
          <Heart className="w-4 h-4 text-pink-400" />
          <Star className="w-4 h-4 text-yellow-400" />
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
      </div>
      <div className="flex justify-center mb-3">
        <div className="bg-gradient-to-br from-amber-200 to-orange-200 p-3 sm:p-4 rounded-full border-4 border-amber-300 shadow-lg">
          <Cat className="w-6 h-6 sm:w-8 sm:h-8 text-amber-700" />
        </div>
      </div>
      <p
        className="text-amber-700 text-base sm:text-lg flex items-center justify-center gap-2 font-bold px-4"
      >
        <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        <span className="truncate">
          {!hasTransactions ? "¡Comienza tu aventura financiera!" : "¡Sigue así! Cada peso cuenta"}
        </span>
        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 flex-shrink-0" />
      </p>
      <div className="mt-3 flex justify-center space-x-2 opacity-60">
        <Target className="w-4 h-4 text-blue-400" />
        <Zap className="w-4 h-4 text-yellow-400" />
        <Gift className="w-4 h-4 text-green-400" />
      </div>
    </div>
  )
}


