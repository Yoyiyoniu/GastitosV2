import { BrowserRouter, Routes, Route } from "react-router-dom"
import PersonalFinanceApp from "./pages/PersonalFinanceApp"
import { AllTransactionsPage } from "./pages/all-transactions-page"

function App() {
  return (
    <BrowserRouter>
      <main className="w-screen min-h-screen">
        <Routes>
          <Route path="/" element={<PersonalFinanceApp />} />
          <Route path="/transactions" element={<AllTransactionsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
