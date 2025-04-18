import { useState, useEffect } from 'react'

const SpendingInsights = ({ transactions }) => {
  const [insights, setInsights] = useState([])
  
  useEffect(() => {
    // Generate insights based on transaction data
    const generateInsights = () => {
      if (!transactions.length) return []
      
      const newInsights = []
      
      // Get current month and year
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()
      
      // Filter transactions for current month
      const currentMonthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear
      })
      
      // Filter transactions for previous month
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear
      
      const previousMonthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === previousMonth && 
               transactionDate.getFullYear() === previousYear
      })
      
      // Calculate total expenses for current and previous month
      const currentMonthExpenses = currentMonthTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      
      const previousMonthExpenses = previousMonthTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      
      // Compare current month expenses with previous month
      if (previousMonthExpenses > 0) {
        const percentChange = ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
        
        if (percentChange <= -10) {
          newInsights.push({
            type: 'success',
            title: 'Reduced Spending',
            message: `Your spending this month is down by ${Math.abs(percentChange).toFixed(1)}% compared to last month. Great job!`
          })
        } else if (percentChange >= 10) {
          newInsights.push({
            type: 'warning',
            title: 'Increased Spending',
            message: `Your spending this month is up by ${percentChange.toFixed(1)}% compared to last month. You might want to review your expenses.`
          })
        }
      }
      
      // Group expenses by category for current month
      const categoryExpenses = {}
      
      currentMonthTransactions
        .filter(t => t.amount < 0)
        .forEach(t => {
          const category = t.category || 'Other'
          if (!categoryExpenses[category]) {
            categoryExpenses[category] = 0
          }
          categoryExpenses[category] += Math.abs(t.amount)
        })
      
      // Find top spending category
      if (Object.keys(categoryExpenses).length > 0) {
        const topCategory = Object.entries(categoryExpenses)
          .sort((a, b) => b[1] - a[1])[0]
        
        const percentOfTotal = (topCategory[1] / currentMonthExpenses) * 100
        
        if (percentOfTotal >= 30) {
          newInsights.push({
            type: 'info',
            title: 'Top Spending Category',
            message: `${percentOfTotal.toFixed(1)}% of your spending this month is in the ${topCategory[0]} category.`
          })
        }
      }
      
      // Check for large transactions
      const largeTransactions = currentMonthTransactions
        .filter(t => t.amount < 0 && Math.abs(t.amount) > 100)
        .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
        .slice(0, 3)
      
      if (largeTransactions.length > 0) {
        newInsights.push({
          type: 'info',
          title: 'Large Transactions',
          message: `You had ${largeTransactions.length} large ${largeTransactions.length === 1 ? 'transaction' : 'transactions'} this month.`,
          details: largeTransactions.map(t => `${t.description}: $${Math.abs(t.amount).toFixed(2)}`)
        })
      }
      
      // Check income vs expenses for current month
      const currentMonthIncome = currentMonthTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0)
      
      if (currentMonthIncome > 0 && currentMonthExpenses > 0) {
        const savingsRate = ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100
        
        if (savingsRate >= 20) {
          newInsights.push({
            type: 'success',
            title: 'Great Savings Rate',
            message: `You're saving ${savingsRate.toFixed(1)}% of your income this month. Keep it up!`
          })
        } else if (savingsRate < 0) {
          newInsights.push({
            type: 'warning',
            title: 'Spending More Than Income',
            message: `You're spending more than your income this month. Consider reviewing your budget.`
          })
        }
      }
      
      return newInsights
    }
    
    setInsights(generateInsights())
  }, [transactions])
  
  // If no insights, don't render the component
  if (insights.length === 0) {
    return null
  }
  
  return (
    <div className="bg-white shadow sm:rounded-lg border border-gray-200">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
          <span className="mr-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100">
            <span className="text-sm font-medium text-indigo-800">
              💡
            </span>
          </span>
          Spending Insights
        </h3>
        
        <div className="mt-5 space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-md ${
                insight.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
                insight.type === 'success' ? 'bg-green-50 border-l-4 border-green-400' :
                'bg-blue-50 border-l-4 border-blue-400'
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {insight.type === 'warning' ? (
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : insight.type === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">{insight.title}</h3>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>{insight.message}</p>
                    {insight.details && (
                      <ul className="mt-2 list-disc list-inside pl-2">
                        {insight.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpendingInsights
