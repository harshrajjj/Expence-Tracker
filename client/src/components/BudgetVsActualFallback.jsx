import React from 'react'

export const BudgetVsActualFallback = () => {
  return (
    <div className="bg-white shadow sm:rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Budget vs. Actual</h3>
      
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
            {/* Sample data */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Housing</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1000.00</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$950.00</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">$50.00 under</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Food</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$500.00</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$520.00</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">$20.00 over</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Transportation</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$200.00</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$180.00</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">$20.00 under</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
        <p className="text-sm">
          <strong>Note:</strong> This is sample data. The actual budget comparison data could not be loaded.
        </p>
      </div>
    </div>
  )
}

export default BudgetVsActualFallback
