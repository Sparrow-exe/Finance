import React from 'react';

function DebtAnalysis({ entries = [] }) {
  const totalBalance = entries.reduce((sum, e) => sum + (e.balance || 0), 0);
  const totalMonthly = entries.reduce((sum, e) => sum + (e.monthlyPayment || 0), 0);
  const totalMinPayment = entries.reduce((sum, e) => sum + (e.minimumPayment || 0), 0);

  const averageAPR =
    entries.length > 0
      ? entries.reduce((sum, e) => sum + (e.apr || 0), 0) / entries.length
      : 0;

  const estimatedAnnualInterest = entries.reduce((sum, e) => {
    const apr = e.apr || 0;
    const bal = e.balance || 0;
    return sum + ((apr / 100) * bal);
  }, 0);

  // Rounded payoff months
  const totalPayoffMonths =
    totalMonthly > 0 ? Math.round(totalBalance / totalMonthly) : 0;

  const estimatedPayoffDate = () => {
    if (totalPayoffMonths <= 0) return '—';
    const now = new Date();
    now.setMonth(now.getMonth() + totalPayoffMonths);
    return now.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
    });
  };

  // Simple interest projection (per-debt)
  let totalInterest = 0;

  entries.forEach((e) => {
    if (e.monthlyPayment > 0 && e.apr > 0 && e.balance > 0) {
      const months = Math.round(e.balance / e.monthlyPayment);
      const interest = (e.balance * (e.apr / 100)) * (months / 12);
      totalInterest += interest;
    }
  });

  const monthlyInterest = totalPayoffMonths > 0 ? totalInterest / totalPayoffMonths : 0;

  const formatCurrency = (v) =>
    `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  const formatPercent = (v) =>
    `${Number(v).toFixed(2)}%`;

  return (
    <div className="bg-white p-4 rounded shadow mt-6 space-y-2">
      <h2 className="text-xl font-semibold mb-4">Debt Summary</h2>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <p><strong>Total Debts:</strong> {entries.length}</p>
        <p><strong>Total Balance:</strong> {formatCurrency(totalBalance)}</p>
        <p><strong>Total Monthly Payment:</strong> {formatCurrency(totalMonthly)}</p>
        <p><strong>Total Minimum Payment:</strong> {formatCurrency(totalMinPayment)}</p>
        <p><strong>Average APR:</strong> {formatPercent(averageAPR)}</p>
        <p><strong>Est. Annual Interest:</strong> {formatCurrency(estimatedAnnualInterest)}</p>
        <p><strong>Est. Months to Pay Off:</strong> {totalPayoffMonths > 0 ? totalPayoffMonths : '—'}</p>
        <p><strong>Est. Payoff Date:</strong> {estimatedPayoffDate()}</p>
        <p><strong>Est. Total Interest Paid:</strong> {formatCurrency(totalInterest)}</p>
        <p><strong>Est. Monthly Interest:</strong> {formatCurrency(monthlyInterest)}</p>
      </div>
    </div>
  );
}

export default DebtAnalysis;
