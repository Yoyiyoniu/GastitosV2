import { Sparkles, Star, Heart, Zap } from "lucide-react"

export function BackgroundDecorations() {
  return (
    <>
      <div className="absolute top-10 left-4 opacity-20">
        <Sparkles className="w-8 h-8 text-yellow-400" />
      </div>
      <div className="absolute top-32 right-6 opacity-20">
        <Star className="w-6 h-6 text-pink-400" />
      </div>
      <div className="absolute bottom-40 left-8 opacity-20">
        <Heart className="w-7 h-7 text-red-300" />
      </div>
      <div className="absolute bottom-20 right-4 opacity-20">
        <Zap className="w-5 h-5 text-purple-400" />
      </div>
    </>
  )
}


