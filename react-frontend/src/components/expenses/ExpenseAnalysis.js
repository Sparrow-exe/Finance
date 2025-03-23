import React, { useState, useMemo } from 'react';

function ExpenseAnalysis({ entries = [] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Unique categories for dropdown
  const categories = [...new Set(entries.map(e => e.category).filter(Boolean))];

  // Helpers
  const formatCurrency = (v) =>
    v != null ? `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '—';

  const formatPercent = (p) =>
    `${p > 0 ? '+' : ''}${p.toFixed(2)}%`;

  const getStatus = (budgeted, actual) => {
    const diff = actual - budgeted;
    const percent = budgeted > 0 ? (diff / budgeted) * 100 : 0;

    if (diff === 0) return 'On budget';
    if (diff > 0) return `Over by ${formatCurrency(diff)} (${formatPercent(percent)})`;
    return `Under by ${formatCurrency(Math.abs(diff))} (${formatPercent(percent)})`;
  };

  // Filtering logic
  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      const searchText = search.toLowerCase();
      const matchSearch =
        entry.description?.toLowerCase().includes(searchText) ||
        entry.category?.toLowerCase().includes(searchText);

      const matchCategory =
        !selectedCategory || entry.category === selectedCategory;

      const matchMin = minAmount === '' || (entry.actual || 0) >= parseFloat(minAmount);
      const matchMax = maxAmount === '' || (entry.actual || 0) <= parseFloat(maxAmount);

      return matchSearch && matchCategory && matchMin && matchMax;
    });
  }, [entries, search, selectedCategory, minAmount, maxAmount]);

  const totalBudgeted = filtered.reduce((sum, e) => sum + (e.budgeted || 0), 0);
  const totalActual = filtered.reduce((sum, e) => sum + (e.actual || 0), 0);
  const totalDifference = totalActual - totalBudgeted;
  const totalPercent = totalBudgeted > 0 ? (totalDifference / totalBudgeted) * 100 : 0;

  return (
    <div className="bg-white p-4 rounded shadow mt-6 space-y-4">
      <h2 className="text-xl font-semibold mb-2">Expense Analysis</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center text-sm">
        <input
          type="text"
          placeholder="Search by name or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Amount"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          className="border p-2 rounded w-28"
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          className="border p-2 rounded w-28"
        />
      </div>

      {/* Per-entry Breakdown */}
        <div className="space-y-3">
        {filtered.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No matching expenses found.</p>
        ) : (
            filtered.map((entry) => {
            const status = getStatus(entry.budgeted, entry.actual);
            return (
                <div
                key={entry._id}
                className="border-b pb-2 text-sm text-gray-800 space-y-1"
                >
                <div className="flex justify-between">
                    <span className="font-semibold">{entry.description || 'Untitled Expense'}</span>
                    <span className="text-gray-500">
                    {formatCurrency(entry.actual)} / {formatCurrency(entry.budgeted)}
                    </span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs">
                    <span>{entry.category || 'Uncategorized'}</span>
                    <span>{status}</span>
                </div>
                </div>
            );
            })
        )}
        </div>


      {/* Summary of filtered */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 pt-4 border-t">
          <p><strong>Total Budgeted:</strong> {formatCurrency(totalBudgeted)}</p>
          <p><strong>Total Spent:</strong> {formatCurrency(totalActual)}</p>
          <p><strong>Total Difference:</strong> {formatCurrency(totalDifference)}</p>
          <p><strong>Total % Over/Under:</strong> {formatPercent(totalPercent)}</p>
          <p><strong>Overall:</strong> {getStatus(totalBudgeted, totalActual)}</p>
        </div>
      )}
    </div>
  );
}

export default ExpenseAnalysis;
