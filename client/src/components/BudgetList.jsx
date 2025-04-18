import { useState } from 'react'
import { deleteBudget } from '../api'
import LoadingSpinner from './LoadingSpinner'

const BudgetList = ({ budgets, onBudgetDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }
  
  // Handle budget deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      setIsDeleting(true)
      setDeletingId(id)
      try {
        await deleteBudget(id)
        if (onBudgetDeleted) {
          onBudgetDeleted(id)
        }
      } catch (error) {
        console.error('Error deleting budget:', error)
      } finally {
        setIsDeleting(false)
        setDeletingId(null)
      }
    }
  }
  
  return (
    <div className="bg-white shadow sm:rounded-lg border border-gray-200">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
          <span className="mr-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100">
            <span className="text-sm font-medium text-indigo-800">
              📋
            </span>
          </span>
          Budget List
        </h3>
        
        <div className="mt-5">
          {budgets.length === 0 ? (
            <div className="text-center py-10">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No budgets set</h3>
              <p className="mt-1 text-sm text-gray-500">
                Set a budget for a category to get started
              </p>
            </div>
          ) : (
            <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {budgets.map((budget) => (
                    <tr key={budget.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {budget.category}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(budget.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(budget.id)}
                          disabled={isDeleting && deletingId === budget.id}
                          className="text-red-600 hover:text-red-900 focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting && deletingId === budget.id ? (
                            <div className="flex items-center">
                              <LoadingSpinner size="small" />
                              <span className="ml-1">Deleting...</span>
                            </div>
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BudgetList
