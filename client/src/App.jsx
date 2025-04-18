import { useState, useEffect } from 'react'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import MonthlyExpensesChart from './components/MonthlyExpensesChart'
import FinancialSummary from './components/FinancialSummary'
import CategoryPieChart from './components/CategoryPieChart'
import CategoryBreakdown from './components/CategoryBreakdown'
import BudgetManager from './components/BudgetManager'
import SpendingInsights from './components/SpendingInsights'
import LoadingSpinner from './components/LoadingSpinner'
import { fetchTransactions, addTransaction, updateTransaction, deleteTransaction } from './api'

function App() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editTransaction, setEditTransaction] = useState(null)

  // Load transactions when component mounts
  useEffect(() => {
    loadTransactions()
  }, [])

  // Function to load transactions from the API
  const loadTransactions = async () => {
    try {
      setLoading(true)
      const data = await fetchTransactions()
      setTransactions(data)
      setError('')
    } catch (err) {
      console.error('Error loading transactions:', err)
      setError('Failed to load transactions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Function to handle adding a new transaction
  const handleAddTransaction = async (transactionData) => {
    try {
      await addTransaction(transactionData)
      loadTransactions()
      return true
    } catch (err) {
      console.error('Error adding transaction:', err)
      setError('Failed to add transaction. Please try again.')
      return false
    }
  }

  // Function to handle updating a transaction
  const handleUpdateTransaction = async (id, transactionData) => {
    try {
      await updateTransaction(id, transactionData)
      loadTransactions()
      setEditTransaction(null)
      return true
    } catch (err) {
      console.error('Error updating transaction:', err)
      setError('Failed to update transaction. Please try again.')
      return false
    }
  }

  // Function to handle deleting a transaction
  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id)
      loadTransactions()
      return true
    } catch (err) {
      console.error('Error deleting transaction:', err)
      setError('Failed to delete transaction. Please try again.')
      return false
    }
  }

  // Function to set a transaction for editing
  const handleEditTransaction = (transaction) => {
    setEditTransaction(transaction)
  }

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditTransaction(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="ml-2 text-2xl font-bold text-white">Personal Finance Visualizer</h1>
          </div>
          <div className="text-sm text-indigo-200">
            {transactions.length > 0 && (
              <span>Tracking {transactions.length} transactions</span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-gray-500">Loading your financial data...</p>
          </div>
        ) : (
          <>
            {/* Financial Summary */}
            <FinancialSummary transactions={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
              {/* Transaction Form */}
              <TransactionForm
                onAddTransaction={handleAddTransaction}
                onUpdateTransaction={handleUpdateTransaction}
                editTransaction={editTransaction}
                onCancelEdit={handleCancelEdit}
              />

              {/* Monthly Expenses Chart */}
              <MonthlyExpensesChart transactions={transactions} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
              {/* Category Pie Chart */}
              <CategoryPieChart transactions={transactions} />

              {/* Category Breakdown */}
              <CategoryBreakdown transactions={transactions} />
            </div>

            {/* Spending Insights */}
            <SpendingInsights transactions={transactions} />

            {/* Budget Management */}
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Budget Management</h2>
              <BudgetManager />
            </div>

            {/* Transaction List */}
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              onEditTransaction={handleEditTransaction}
            />

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>Personal Finance Visualizer &copy; {new Date().getFullYear()}</p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
