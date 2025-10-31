import {
  Car,
  ShoppingBag,
  Utensils,
  DollarSign,
  Briefcase,
  Home,
  Gamepad2,
  TrendingUp,
  Wallet,
  Gift,
  Book,
  Heart,
} from "lucide-react"

export const expenseCategories = ["Comida", "Transporte", "Entretenimiento", "Hogar", "Salud", "Educación", "Otros"]
export const incomeCategories = ["Trabajo", "Freelance", "Inversiones", "Regalos", "Otros"]

export const getIconForCategory = (category: string, type: "income" | "expense") => {
  if (type === "income") {
    switch (category) {
      case "Trabajo":
        return Briefcase
      case "Freelance":
        return DollarSign
      case "Inversiones":
        return TrendingUp
      case "Regalos":
        return Gift
      default:
        return Wallet
    }
  } else {
    switch (category) {
      case "Comida":
        return Utensils
      case "Transporte":
        return Car
      case "Entretenimiento":
        return Gamepad2
      case "Hogar":
        return Home
      case "Salud":
        return Heart
      case "Educación":
        return Book
      default:
        return ShoppingBag
    }
  }
}

export const getColorForCategory = (category: string, type: "income" | "expense") => {
  if (type === "income") return "text-green-600"

  switch (category) {
    case "Comida":
      return "text-orange-500"
    case "Transporte":
      return "text-blue-500"
    case "Entretenimiento":
      return "text-purple-500"
    case "Hogar":
      return "text-pink-500"
    case "Salud":
      return "text-red-500"
    case "Educación":
      return "text-indigo-500"
    default:
      return "text-gray-500"
  }
}


