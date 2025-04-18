import axios from 'axios'

// Use relative URL in production, absolute URL in development
// For Vercel deployment, we always use relative URLs
const API_URL = '/api'

// Function to fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`)
    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

// Function to fetch all budgets
export const fetchBudgets = async (month, year) => {
  try {
    const response = await axios.get(`${API_URL}/budgets`, {
      params: { month, year }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching budgets:', error)
    throw error
  }
}

// Function to add or update a budget
export const saveBudget = async (budgetData) => {
  try {
    const response = await axios.post(`${API_URL}/budgets`, budgetData)
    return response.data
  } catch (error) {
    console.error('Error saving budget:', error)
    throw error
  }
}

// Function to delete a budget
export const deleteBudget = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/budgets/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting budget:', error)
    throw error
  }
}

// Function to fetch budget vs actual spending
export const fetchBudgetVsActual = async (month, year) => {
  try {
    const response = await axios.get(`${API_URL}/budget-vs-actual`, {
      params: { month, year }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching budget vs actual:', error)
    // Return empty array instead of throwing to prevent component crashes
    return []
  }
}

// Function to fetch all transactions
export const fetchTransactions = async () => {
  try {
    const response = await axios.get(`${API_URL}/transactions`)
    return response.data
  } catch (error) {
    console.error('Error fetching transactions:', error)
    throw error
  }
}

// Function to add a new transaction
export const addTransaction = async (transaction) => {
  try {
    const response = await axios.post(`${API_URL}/transactions`, transaction)
    return response.data
  } catch (error) {
    console.error('Error adding transaction:', error)
    throw error
  }
}

// Function to update a transaction
export const updateTransaction = async (id, transaction) => {
  try {
    const response = await axios.put(`${API_URL}/transactions/${id}`, transaction)
    return response.data
  } catch (error) {
    console.error('Error updating transaction:', error)
    throw error
  }
}

// Function to delete a transaction
export const deleteTransaction = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/transactions/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting transaction:', error)
    throw error
  }
}
