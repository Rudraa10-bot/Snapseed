import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SummaryCards from "./components/SummaryCards";
import UploadReceipt from "./components/UploadReceipt";
import BudgetOverview from "./components/BudgetOverview";
import ExpenseTable from "./components/ExpenseTable";
import AddExpenseForm from "./components/AddExpenseForm";
import BudgetAlert from "./components/BudgetAlert";
import About from "./components/About";
import Footer from "./components/Footer";
import { initialExpenses, initialBudgets } from "./data";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [budgets, setBudgets] = useState(initialBudgets);

  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [...prev, newExpense]);
  };

  const handleUpdateBudget = (category, newLimit) => {
    setBudgets((prev) => ({ ...prev, [category]: newLimit }));
  };

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SummaryCards expenses={expenses} budgets={budgets} />
        <UploadReceipt />
        <BudgetOverview
          expenses={expenses}
          budgets={budgets}
          onUpdateBudget={handleUpdateBudget}
        />
        <ExpenseTable expenses={expenses} />
        <AddExpenseForm onAddExpense={handleAddExpense} />
        <BudgetAlert expenses={expenses} budgets={budgets} />
        <About />
      </main>
      <Footer />
    </>
  );
}

export default App;
