import { useState, useEffect } from 'react'
import { fetchCategories, saveBudget } from '../api'
import LoadingSpinner from './LoadingSpinner'

const BudgetForm = ({ onBudgetSaved, selectedMonth, selectedYear }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: selectedMonth,
    year: selectedYear
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  // Load categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        const data = await fetchCategories()
        // Filter out 'Income' category for budgets
        setCategories(data.filter(category => category !== 'Income'))
      } catch (err) {
        console.error('Error loading categories:', err)
      } finally {
        setLoadingCategories(false)
      }
    }
    
    loadCategories()
  }, [])
  
  // Update month and year when props change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      month: selectedMonth,
      year: selectedYear
    }))
  }, [selectedMonth, selectedYear])
  
  // Reset success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success])
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.category || !formData.amount) {
      setError('Please fill in all fields')
      return
    }
    
    if (isNaN(formData.amount) || parseFloat(formData.amount) < 0) {
      setError('Please enter a valid amount')
      return
    }
    
    setError('')
    setLoading(true)
    
    try {
      const budgetData = {
        category: formData.category,
        amount: parseFloat(formData.amount),
        month: parseInt(formData.month),
        year: parseInt(formData.year)
      }
      
      const result = await saveBudget(budgetData)
      
      if (result) {
        setSuccess(true)
        setFormData(prev => ({
          ...prev,
          category: '',
          amount: ''
        }))
        
        if (onBudgetSaved) {
          onBudgetSaved(result)
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="bg-white shadow sm:rounded-lg border border-gray-200">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
          <span className="mr-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100">
            <span className="text-sm font-medium text-indigo-800">
              💰
            </span>
          </span>
          Set Budget
        </h3>
        
        <form onSubmit={handleSubmit} className="mt-5">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
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
          
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">Budget saved successfully!</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="mt-1">
                {loadingCategories ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="small" />
                    <span className="text-sm text-gray-500">Loading categories...</span>
                  </div>
                ) : (
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            
            {/* Amount */}
            <div>
              <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  id="budgetAmount"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">USD</span>
                </div>
              </div>
            </div>
            
            {/* Month and Year (hidden, set by parent component) */}
            <input type="hidden" name="month" value={formData.month} />
            <input type="hidden" name="year" value={formData.year} />
          </div>
          
          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                'Save Budget'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BudgetForm
