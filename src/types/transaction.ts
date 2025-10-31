export interface Transaction {
  id: number
  type: "income" | "expense"
  amount: number
  description: string
  icon: any
  color: string
  category: string
  date: string
}

export interface NewTransaction {
  amount: string
  description: string
  category: string
}


