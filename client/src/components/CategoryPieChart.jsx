import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

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

const CategoryPieChart = ({ transactions }) => {
  const [categoryData, setCategoryData] = useState([])
  
  useEffect(() => {
    // Process transactions to get category data
    const processTransactions = () => {
      // Skip if no transactions
      if (!transactions.length) return []
      
      // Group expenses by category
      const categoryMap = {}
      
      transactions
        .filter(t => t.amount < 0) // Only include expenses
        .forEach(transaction => {
          const category = transaction.category || 'Other'
          const amount = Math.abs(transaction.amount)
          
          if (!categoryMap[category]) {
            categoryMap[category] = 0
          }
          
          categoryMap[category] += amount
        })
      
      // Convert to array and sort by amount
      return Object.entries(categoryMap)
        .map(([name, value]) => ({
          name,
          value: parseFloat(value.toFixed(2)),
          color: COLORS[name] || '#6c757d' // Default color if category not in COLORS
        }))
        .sort((a, b) => b.value - a.value)
    }
    
    setCategoryData(processTransactions())
  }, [transactions])
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm" style={{ color: data.payload.color }}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(data.value)}
          </p>
        </div>
      )
    }
    return null
  }
  
  // Custom legend
  const renderCustomizedLegend = (props) => {
    const { payload } = props
    
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="bg-white shadow sm:rounded-lg border border-gray-200">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
          <span className="mr-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100">
            <span className="text-sm font-medium text-indigo-800">
              🥧
            </span>
          </span>
          Expense Categories
        </h3>
        
        <div className="mt-5">
          {categoryData.length === 0 ? (
            <div className="text-center py-10">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No expense data available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add some expenses to see your category breakdown
              </p>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={renderCustomizedLegend} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryPieChart
