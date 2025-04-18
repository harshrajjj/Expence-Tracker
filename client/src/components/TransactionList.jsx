import { useState, useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'

const TransactionList = ({ transactions, onDeleteTransaction, onEditTransaction }) => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Sort and filter transactions
  const sortedAndFilteredTransactions = () => {
    // First filter transactions
    const filtered = transactions.filter(transaction => {
      // Filter by type
      const typeMatch =
        filter === 'all' ||
        (filter === 'income' && transaction.amount > 0) ||
        (filter === 'expense' && transaction.amount < 0)

      // Filter by search term
      const searchMatch =
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())

      return typeMatch && searchMatch
    })

    // Then sort them
    return [...filtered].sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA
      } else if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount
      } else if (sortConfig.key === 'description') {
        return sortConfig.direction === 'asc'
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description)
      }
      return 0
    })
  }

  const filteredTransactions = sortedAndFilteredTransactions()

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  // Handle transaction deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setIsDeleting(true)
      setDeletingId(id)
      try {
        await onDeleteTransaction(id)
      } finally {
        setIsDeleting(false)
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="bg-white shadow sm:rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <span className="mr-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100">
              <span className="text-sm font-medium text-indigo-800">
                {filteredTransactions.length}
              </span>
            </span>
            Transactions
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          {/* Search input */}
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search transactions"
            />
          </div>

          {/* Filter dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-10 px-4 border-t border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try a different search term' : 'Add a new transaction to get started'}
          </p>
        </div>
      ) : (
        <>
          {/* Table header */}
          <div className="border-t border-gray-200 px-4 py-3 sm:px-6 bg-gray-50">
            <div className="flex justify-between text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="w-2/5 flex">
                <button
                  onClick={() => requestSort('description')}
                  className="flex items-center hover:text-gray-700 focus:outline-none"
                >
                  Description {getSortIndicator('description')}
                </button>
              </div>
              <div className="w-1/5 flex">
                <button
                  onClick={() => requestSort('date')}
                  className="flex items-center hover:text-gray-700 focus:outline-none"
                >
                  Date {getSortIndicator('date')}
                </button>
              </div>
              <div className="w-1/5 flex">
                <button
                  onClick={() => requestSort('amount')}
                  className="flex items-center hover:text-gray-700 focus:outline-none"
                >
                  Amount {getSortIndicator('amount')}
                </button>
              </div>
              <div className="w-1/5 text-right">Actions</div>
            </div>
          </div>

          {/* Table body */}
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="w-2/5 flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${transaction.amount < 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                      <span className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                        {transaction.amount < 0 ? '−' : '+'}
                      </span>
                    </div>
                    <div className="ml-4 truncate">
                      <p className="text-sm font-medium text-gray-900 truncate">{transaction.description}</p>
                      <p className="text-xs text-gray-500 md:hidden">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="w-1/5 hidden md:block">
                    <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                  <div className="w-1/5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.amount < 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(Math.abs(transaction.amount))}
                    </span>
                  </div>
                  <div className="w-1/5 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => onEditTransaction(transaction)}
                        className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(transaction.id)}
                        disabled={isDeleting && deletingId === transaction.id}
                        className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting && deletingId === transaction.id ? (
                          <LoadingSpinner size="small" />
                        ) : (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default TransactionList
