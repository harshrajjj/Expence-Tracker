import { useState, useEffect } from 'react'

const COLORS = {
  'Housing': '#8884d8',
  'Transportation': '#83a6ed',
  'Food': '#8dd1e1',
  'Utilities': '#82ca9d',
  'Insurance': '#a4de6c',
  'Healthcare': '#d0ed57',
  'Savings': '#ffc658',
  'Personal': '#ff8042',
  'Entertainment': '#ff6361',
  'Education': '#bc5090',
  'Clothing': '#58508d',
  'Gifts': '#003f5c',
  'Income': '#10B981',
  'Other': '#6c757d'
}

const CategoryBreakdown = ({ transactions }) => {
  const [categoryData, setCategoryData] = useState([])
  const [totalExpenses, setTotalExpenses] = useState(0)
  
  useEffect(() => {
    // Process transactions to get category data
    const processTransactions = () => {
      // Skip if no transactions
      if (!transactions.length) return []
      
      // Group expenses by category
      const categoryMap = {}
      let total = 0
      
      transactions
        .filter(t => t.amount < 0) // Only include expenses
        .forEach(transaction => {
          const category = transaction.category || 'Other'
          const amount = Math.abs(transaction.amount)
          
          if (!categoryMap[category]) {
            categoryMap[category] = 0
          }
          
          categoryMap[category] += amount
          total += amount
        })
      
      setTotalExpenses(total)
      
      // Convert to array and sort by amount
      return Object.entries(categoryMap)
        .map(([name, value]) => ({
          name,
          value: parseFloat(value.toFixed(2)),
          percentage: parseFloat(((value / total) * 100).toFixed(1)),
          color: COLORS[name] || '#6c757d' // Default color if category not in COLORS
        }))
        .sort((a, b) => b.value - a.value)
    }
    
    setCategoryData(processTransactions())
  }, [transactions])
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }
  
  return (
    <div className="bg-white shadow sm:rounded-lg border border-gray-200">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
          <span className="mr-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100">
            <span className="text-sm font-medium text-indigo-800">
              📊
            </span>
          </span>
          Category Breakdown
        </h3>
        
        <div className="mt-5">
          {categoryData.length === 0 ? (
            <div className="text-center py-10">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No expense data available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add some expenses to see your category breakdown
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Total Expenses: <span className="font-medium text-gray-900">{formatCurrency(totalExpenses)}</span>
              </p>
              
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(category.value)} ({category.percentage}%)
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${category.percentage}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryBreakdown
