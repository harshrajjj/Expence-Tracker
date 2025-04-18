import { useState, useEffect } from 'react'

const FinancialSummary = ({ transactions }) => {
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    recentTransactions: []
  })

  useEffect(() => {
    // Calculate summary data
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    const totalBalance = totalIncome - totalExpenses
    
    // Get 3 most recent transactions
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
    
    setSummary({
      totalBalance,
      totalIncome,
      totalExpenses,
      recentTransactions
    })
  }, [transactions])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Balance */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Balance</dt>
          <dd className={`mt-1 text-3xl font-semibold ${summary.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(summary.totalBalance)}
          </dd>
        </div>
      </div>

      {/* Total Income */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Income</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">
            {formatCurrency(summary.totalIncome)}
          </dd>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
          <dd className="mt-1 text-3xl font-semibold text-red-600">
            {formatCurrency(summary.totalExpenses)}
          </dd>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-3">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
          <div className="mt-5 divide-y divide-gray-200">
            {summary.recentTransactions.length === 0 ? (
              <p className="text-gray-500 py-4">No recent transactions</p>
            ) : (
              summary.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      transaction.amount < 0 ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      <span className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                        {transaction.amount < 0 ? '−' : '+'}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialSummary
