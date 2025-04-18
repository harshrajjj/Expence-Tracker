import { useState, useEffect } from 'react';
import { fetchBudgetVsActual } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from './LoadingSpinner';

const BudgetVsActual = ({ selectedMonth, selectedYear }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchBudgetVsActual(selectedMonth, selectedYear);
        
        // Transform data for the chart
        const transformedData = result.map(item => ({
          category: item.category,
          Budget: item.budgetAmount,
          Actual: item.actualAmount,
          difference: item.difference,
          percentUsed: item.percentUsed
        }));

        setData(transformedData);
        setError('');
      } catch (err) {
        console.error('Error loading budget vs actual data:', err);
        setError('Failed to load budget comparison data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedMonth, selectedYear]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Budget vs. Actual Spending</h3>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis 
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
            />
            <Legend />
            <Bar dataKey="Budget" fill="#4F46E5" />
            <Bar dataKey="Actual" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <h4 className="text-md font-semibold mb-3">Spending Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((item) => (
            <div 
              key={item.category}
              className={`p-4 rounded-lg ${
                item.difference < 0 ? 'bg-red-50' : 'bg-green-50'
              }`}
            >
              <h5 className="font-medium">{item.category}</h5>
              <div className="mt-2 space-y-1">
                <p>Budget: {formatCurrency(item.Budget)}</p>
                <p>Actual: {formatCurrency(item.Actual)}</p>
                <p className={item.difference < 0 ? 'text-red-600' : 'text-green-600'}>
                  {item.difference < 0 ? 'Over by ' : 'Under by '}
                  {formatCurrency(Math.abs(item.difference))}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      item.percentUsed > 100 ? 'bg-red-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min(item.percentUsed, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {item.percentUsed.toFixed(1)}% of budget used
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetVsActual;