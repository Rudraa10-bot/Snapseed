import { useState, useEffect } from "react";
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
import "./App.css";
import {
  getExpenses,
  addExpense,
  deleteExpense,
  getBudgets,
  updateBudget
} from "./api";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [expensesData, budgetsData] = await Promise.all([
        getExpenses(),
        getBudgets()
      ]);
      setExpenses(expensesData);
      const budgetsObj = budgetsData.reduce((acc, b) => {
        acc[b.category] = b.limit;
        return acc;
      }, {});
      setBudgets(budgetsObj);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExpense = async (newExpense) => {
    try {
      const saved = await addExpense(newExpense);
      setExpenses((prev) => [...prev, saved]);
      setError(null);
      return true;
    } catch (err) {
      if (err.fieldErrors) {
        setError(Object.values(err.fieldErrors).join(", "));
      } else {
        setError(err.message || "Failed to add expense");
      }
      return false;
    }
  };

  const handleUpdateBudget = async (category, newLimit) => {
    try {
      const updated = await updateBudget(category, newLimit);
      setBudgets((prev) => ({ ...prev, [category]: updated.limit }));
      setError(null);
    } catch (err) {
      if (err.fieldErrors) {
        setError(Object.values(err.fieldErrors).join(", "));
      } else {
        setError(err.message || "Failed to update budget");
      }
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to delete expense");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main>
          <div className="loading-container">
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main>
          <div className="error-container">
            <div className="error-banner">
              <p>{error}</p>
              <button className="btn btn-primary" onClick={loadData}>
                Retry
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
        <ExpenseTable expenses={expenses} onDeleteExpense={handleDeleteExpense} />
        <AddExpenseForm onAddExpense={handleAddExpense} />
        <BudgetAlert expenses={expenses} budgets={budgets} />
        <About />
      </main>
      <Footer />
    </>
  );
}

export default App;