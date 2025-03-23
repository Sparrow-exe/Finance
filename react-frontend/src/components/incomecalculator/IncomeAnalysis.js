import React from 'react';

function IncomeAnalysis({ entries = [] }) {
  const brackets = [
    { upTo: 11000, rate: 0.10 },
    { upTo: 44725, rate: 0.12 },
    { upTo: 95375, rate: 0.22 },
    { upTo: 182100, rate: 0.24 },
    { upTo: 231250, rate: 0.32 },
    { upTo: 578125, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ];

  let salaryTotal = 0;
  let hourlyRegularTotal = 0;
  let hourlyOvertimeTotal = 0;

  entries.forEach((entry) => {
    if (entry.payType === 'salary') {
      salaryTotal += entry.annualSalary || 0;
    } else if (entry.payType === 'hourly') {
      const rate = entry.hourlyRate || 0;
      const hours = entry.hoursPerWeek || 0;

      const regularHours = Math.min(40, hours);
      const overtimeHours = Math.max(0, hours - 40);

      hourlyRegularTotal += regularHours * rate * 52;
      hourlyOvertimeTotal += overtimeHours * rate * 1.5 * 52;
    }
  });

  const gross = salaryTotal + hourlyRegularTotal + hourlyOvertimeTotal;

  const calculateFederalTax = (income) => {
    let tax = 0;
    let lastLimit = 0;

    for (const bracket of brackets) {
      const taxable = Math.min(income, bracket.upTo) - lastLimit;
      if (taxable > 0) {
        tax += taxable * bracket.rate;
      }
      lastLimit = bracket.upTo;
      if (income <= bracket.upTo) break;
    }

    return tax;
  };

  const federalTax = calculateFederalTax(gross);
  const socialSecurity = Math.min(gross, 168600) * 0.062;
  const medicare = gross * 0.0145;
  const totalTax = federalTax + socialSecurity + medicare;
  const netIncome = gross - totalTax;
  const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Income Analysis</h2>
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <p><strong>Gross Income:</strong> ${gross.toLocaleString()}</p>
        <p><strong>Net Income:</strong> ${netIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>

        <p><strong>Base (Salary + Regular Hourly):</strong> ${ (salaryTotal + hourlyRegularTotal).toLocaleString(undefined, { maximumFractionDigits: 2 }) }</p>
        <p><strong>Overtime Earnings:</strong> ${hourlyOvertimeTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>

        <p><strong>Federal Tax Owed:</strong> ${federalTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        <p><strong>Tax Bracket:</strong> {
          brackets.find(b => gross <= b.upTo)?.rate * 100
        }%</p>
        <p><strong>Social Security (6.2%):</strong> ${socialSecurity.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        <p><strong>Medicare (1.45%):</strong> ${medicare.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        <p><strong>Total Tax Paid:</strong> ${totalTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        <p><strong>Effective Tax Rate:</strong> {effectiveRate.toFixed(2)}%</p>
      </div>
    </div>
  );
}

export default IncomeAnalysis;
