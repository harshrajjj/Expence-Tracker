import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import LoadingSpinner from './LoadingSpinner'

const MonthlyExpensesChart = ({ transactions }) => {
  const [chartType, setChartType] = useState('bar')

  // Process transactions to get monthly data
  const getMonthlyData = () => {
    const monthlyData = {}

    transactions.forEach(transaction => {
      const date = new Date(transaction.date)
      const month = date.toLocaleString('default', { month: 'short' })
      const year = date.getFullYear()
      const key = `${month} ${year}`

      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: key,
          income: 0,
          expenses: 0,
          balance: 0
        }
      }

      if (transaction.amount > 0) {
        monthlyData[key].income += transaction.amount
        monthlyData[key].balance += transaction.amount
      } else {
        monthlyData[key].expenses += Math.abs(transaction.amount)
        monthlyData[key].balance -= Math.abs(transaction.amount)
      }
    })

    // Convert to array and sort by date
    return Object.values(monthlyData)
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split(' ')
        const [bMonth, bYear] = b.month.split(' ')

        if (aYear !== bYear) {
          return aYear - bYear
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return months.indexOf(aMonth) - months.indexOf(bMonth)
      })
      .slice(-6) // Get last 6 months
      .map(month => ({
        ...month,
        income: parseFloat(month.income.toFixed(2)),
        expenses: parseFloat(month.expenses.toFixed(2)),
        balance: parseFloat(month.balance.toFixed(2))
      }))
  }

  // Get summary data for pie chart
  const getSummaryData = () => {
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return [
      { name: 'Income', value: parseFloat(totalIncome.toFixed(2)), color: '#10B981' },
      { name: 'Expenses', value: parseFloat(totalExpenses.toFixed(2)), color: '#EF4444' }
    ]
  }

  const monthlyData = getMonthlyData()
  const summaryData = getSummaryData()

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white shadow sm:rounded-lg border border-gray-200">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
            <span className="mr-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100">
              <span className="text-sm font-medium text-indigo-800">
                📊
              </span>
            </span>
            Financial Overview
          </h3>

          <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${chartType === 'bar' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${chartType === 'pie' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Pie Chart
            </button>
          </div>
        </div>

        <div className="mt-5">
          {transactions.length === 0 ? (
            <div className="text-center py-10">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transaction data available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add some transactions to see your financial overview
              </p>
            </div>
          ) : (
            <div className="h-80">
              {chartType === 'bar' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <Pie
                      data={summaryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {summaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MonthlyExpensesChart
