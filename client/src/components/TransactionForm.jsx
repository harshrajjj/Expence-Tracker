import { useState, useEffect } from 'react';

const TransactionForm = ({ onAddTransaction, onUpdateTransaction, editTransaction, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Other'
  });

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        amount: editTransaction.amount,
        description: editTransaction.description,
        date: new Date(editTransaction.date).toISOString().split('T')[0],
        category: editTransaction.category || 'Other'
      });
    }
  }, [editTransaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = editTransaction
      ? await onUpdateTransaction(editTransaction._id, formData)
      : await onAddTransaction(formData);

    if (success) {
      setFormData({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Other'
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">
        {editTransaction ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="Other">Other</option>
              <option value="Income">Income</option>
              <option value="Housing">Housing</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          {editTransaction && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {editTransaction ? 'Update' : 'Add'} Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;