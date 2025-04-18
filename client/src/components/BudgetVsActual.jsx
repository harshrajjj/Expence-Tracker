import { useState, useEffect } from 'react'
import { fetchBudgetVsActual } from '../api'
import LoadingSpinner from './LoadingSpinner'

export const BudgetVsActual = ({ selectedMonth, selectedYear }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        // Fetch budget vs actual data from the API
        const comparisonData = await fetchBudgetVsActual(selectedMonth, selectedYear)
        // Make sure we have valid data
        if (Array.isArray(comparisonData)) {
          setData(comparisonData)
        } else {
          console.warn('Received non-array data from API:', comparisonData)
          setData([])
        }
      } catch (err) {
        console.error('Error loading expense data:', err)
        setError(`Failed to load expense data: ${err.message || 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedMonth, selectedYear])

  if (loading) {
    return (
      <div className="bg-white shadow sm:rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Budget vs. Actual</h3>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="medium" />
          <span className="ml-2 text-gray-500">Loading comparison data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white shadow sm:rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Budget vs. Actual</h3>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow sm:rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Budget vs. Actual</h3>

      {Array.isArray(data) && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budgeted</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difference</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => {
                const isOver = item.difference < 0;
                return (
                  <tr key={item.category}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.budgetAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.actualAmount.toFixed(2)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isOver ? 'text-red-500' : 'text-green-500'}`}>
                      ${Math.abs(item.difference).toFixed(2)} {isOver ? 'over' : 'under'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No comparison data available for this period.</p>
      )}
    </div>
  )
}
