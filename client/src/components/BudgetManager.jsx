import { useState, useEffect } from 'react'
import BudgetForm from './BudgetForm'
import BudgetList from './BudgetList'
import { BudgetVsActual } from './BudgetVsActual';
import BudgetVsActualFallback from './BudgetVsActualFallback';
import { fetchBudgets } from '../api'
import LoadingSpinner from './LoadingSpinner'

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [apiAvailable, setApiAvailable] = useState(true)

  // Get current month and year
  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1) // 1-12
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

  // Check if API is available
  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        const response = await fetch('/api/test')
        setApiAvailable(response.ok)
      } catch (err) {
        console.error('API availability check failed:', err)
        setApiAvailable(false)
      }
    }

    checkApiAvailability()
  }, [])

  // Load budgets when component mounts or month/year changes
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        setLoading(true)
        const data = await fetchBudgets(selectedMonth, selectedYear)
        setBudgets(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error loading budgets:', err)
        setError('Failed to load budgets')
        setBudgets([])
      } finally {
        setLoading(false)
      }
    }

    if (apiAvailable) {
      loadBudgets()
    } else {
      setLoading(false)
    }
  }, [selectedMonth, selectedYear, apiAvailable])

  // Handle budget saved
  const handleBudgetSaved = (newBudget) => {
    // Check if budget already exists
    const existingIndex = budgets.findIndex(b => b.id === newBudget.id)

    if (existingIndex >= 0) {
      // Update existing budget
      setBudgets(prev => [
        ...prev.slice(0, existingIndex),
        newBudget,
        ...prev.slice(existingIndex + 1)
      ])
    } else {
      // Add new budget
      setBudgets(prev => [...prev, newBudget])
    }
  }

  // Handle budget deleted
  const handleBudgetDeleted = (id) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id))
  }

  // Generate month options
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ]

  // Generate year options (current year and 2 years before/after)
  const currentYear = currentDate.getFullYear()
  const years = [
    currentYear - 2,
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2
  ]

  return (
    <div>
      <div className="mb-6 bg-white shadow sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
            <span className="mr-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100">
              <span className="text-sm font-medium text-indigo-800">
                📅
              </span>
            </span>
            Budget Period
          </h3>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
          <span className="ml-2 text-gray-500">Loading budget data...</span>
        </div>
      ) : error ? (
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
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <BudgetForm
              onBudgetSaved={handleBudgetSaved}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
            <BudgetList
              budgets={budgets}
              onBudgetDeleted={handleBudgetDeleted}
            />
          </div>

          {apiAvailable ? (
            <BudgetVsActual
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          ) : (
            <BudgetVsActualFallback />
          )}
        </>
      )}
    </div>
  )
}

export default BudgetManager
