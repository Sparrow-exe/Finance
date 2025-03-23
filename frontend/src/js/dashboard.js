document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // Income & Tax Summary Section
  // -----------------------------
  const grossIncomeElem = document.getElementById("gross-income");
  const netIncomeElem = document.getElementById("net-income");
  const taxPercentElem = document.getElementById("tax-percent");
  const baseHourlyElem = document.getElementById("base-hourly");
  const overtimeElem = document.getElementById("overtime-earnings");
  const taxBreakdownBody = document.getElementById("tax-breakdown-body");
  const taxBreakdownDiv = document.getElementById("tax-breakdown");
  const toggleTaxBtn = document.getElementById("toggle-tax-btn");

  const taxBrackets = [
    { threshold: 9950, rate: 0.10 },
    { threshold: 40525, rate: 0.12 },
    { threshold: 86375, rate: 0.22 },
    { threshold: 164925, rate: 0.24 },
    { threshold: 209425, rate: 0.32 },
    { threshold: 523600, rate: 0.35 },
    { threshold: Infinity, rate: 0.37 }
  ];
  const STANDARD_HOURS = 40;
  const WEEKS_PER_YEAR = 52;
  const SS_WAGE_BASE = 160200;
  const SS_RATE = 0.062;
  const MEDICARE_RATE = 0.0145;

  function calculateFederalTax(gross) {
    let remaining = gross;
    let lower = 0;
    let totalFedTax = 0;
    const fedBreakdown = [];
    for (let i = 0; i < taxBrackets.length; i++) {
      const { threshold, rate } = taxBrackets[i];
      const taxable = Math.min(remaining, threshold - lower);
      if (taxable <= 0) break;
      const tax = taxable * rate;
      fedBreakdown.push({
        bracket: `$${lower + 1} - $${threshold === Infinity ? "∞" : threshold}`,
        taxable: taxable,
        rate: rate,
        tax: tax
      });
      totalFedTax += tax;
      remaining -= taxable;
      lower = threshold;
      if (remaining <= 0) break;
    }
    return { totalFedTax, fedBreakdown };
  }

  async function loadIncome() {
    try {
      const incomes = await apiGet("/income");
      let totalGross = 0;
      let totalBaseHourly = 0;
      let totalOvertime = 0;
      incomes.forEach(income => {
        if (income.payType === "hourly" && income.hourlyRate != null && income.hoursPerWeek != null) {
          const baseHours = Math.min(income.hoursPerWeek, STANDARD_HOURS);
          const overtimeHours = Math.max(income.hoursPerWeek - STANDARD_HOURS, 0);
          const baseAnnual = income.hourlyRate * baseHours * WEEKS_PER_YEAR;
          const overtimeAnnual = income.hourlyRate * 1.5 * overtimeHours * WEEKS_PER_YEAR;
          totalBaseHourly += baseAnnual;
          totalOvertime += overtimeAnnual;
          totalGross += baseAnnual + overtimeAnnual;
        } else if (income.payType === "salary" && income.annualSalary != null) {
          totalGross += income.annualSalary;
        }
      });
      grossIncomeElem.textContent = `$${totalGross.toFixed(2)}`;
      if (baseHourlyElem) baseHourlyElem.textContent = `$${totalBaseHourly.toFixed(2)}`;
      if (overtimeElem) overtimeElem.textContent = `$${totalOvertime.toFixed(2)}`;
      
      const { totalFedTax, fedBreakdown } = calculateFederalTax(totalGross);
      const ssTax = Math.min(totalGross, SS_WAGE_BASE) * SS_RATE;
      const medicareTax = totalGross * MEDICARE_RATE;
      const totalTax = totalFedTax + ssTax + medicareTax;
      const netIncome = totalGross - totalTax;
      netIncomeElem.textContent = `$${netIncome.toFixed(2)}`;
      const taxPercent = totalGross > 0 ? ((totalTax / totalGross) * 100).toFixed(1) : 0;
      taxPercentElem.textContent = `${taxPercent}%`;
      
      taxBreakdownBody.innerHTML = "";
      fedBreakdown.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${item.bracket}</td><td>$${item.taxable.toFixed(2)}</td><td>${(item.rate * 100).toFixed(0)}%</td><td>$${item.tax.toFixed(2)}</td>`;
        taxBreakdownBody.appendChild(row);
      });
      const ssRow = document.createElement("tr");
      ssRow.innerHTML = `<td>Social Security</td><td>$${Math.min(totalGross, SS_WAGE_BASE).toFixed(2)}</td><td>${(SS_RATE * 100).toFixed(1)}%</td><td>$${ssTax.toFixed(2)}</td>`;
      taxBreakdownBody.appendChild(ssRow);
      const medRow = document.createElement("tr");
      medRow.innerHTML = `<td>Medicare</td><td>$${totalGross.toFixed(2)}</td><td>${(MEDICARE_RATE * 100).toFixed(1)}%</td><td>$${medicareTax.toFixed(2)}</td>`;
      taxBreakdownBody.appendChild(medRow);
    } catch (error) {
      console.error("Error loading income data:", error);
    }
  }

  toggleTaxBtn.addEventListener("click", () => {
    if (!taxBreakdownDiv.style.display || taxBreakdownDiv.style.display === "none") {
      taxBreakdownDiv.style.display = "block";
      toggleTaxBtn.textContent = "Hide Tax Breakdown";
    } else {
      taxBreakdownDiv.style.display = "none";
      toggleTaxBtn.textContent = "Show Tax Breakdown";
    }
  });

  // -----------------------------
  // Expenses Filtering Section
  // -----------------------------
  const filterCategoryEl = document.getElementById("filter-category");
  const filterStartDateEl = document.getElementById("filter-start-date");
  const filterEndDateEl = document.getElementById("filter-end-date");
  const filterMinAmountEl = document.getElementById("filter-min-amount");
  const filterMaxAmountEl = document.getElementById("filter-max-amount");
  const filterSearchEl = document.getElementById("filter-search");
  const applyFiltersBtn = document.getElementById("apply-filters");
  const expensesTableBody = document.querySelector("#expenses-table tbody");
  
  let allExpenses = [];
  
  async function loadExpenses() {
    try {
      allExpenses = await apiGet("/expenses");
      populateCategoryFilter(allExpenses);
      renderExpensesTable(allExpenses);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  }
  
  function populateCategoryFilter(expenses) {
    const categories = new Set();
    expenses.forEach(exp => {
      if(exp.category) categories.add(exp.category);
    });
    filterCategoryEl.innerHTML = '<option value="">All</option>';
    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      filterCategoryEl.appendChild(opt);
    });
  }
  
  function renderExpensesTable(expenses) {
    expensesTableBody.innerHTML = "";
    expenses.forEach(exp => {
      const row = document.createElement("tr");
      const dateCell = document.createElement("td");
      dateCell.textContent = new Date(exp.date).toLocaleDateString();
      const categoryCell = document.createElement("td");
      categoryCell.textContent = exp.category || "";
      const descCell = document.createElement("td");
      descCell.textContent = exp.description || "";
      const budgetedCell = document.createElement("td");
      budgetedCell.textContent = exp.budgeted != null ? `$${exp.budgeted.toFixed(2)}` : "";
      const actualCell = document.createElement("td");
      actualCell.textContent = exp.actual != null ? `$${exp.actual.toFixed(2)}` : "";
      const recurringCell = document.createElement("td");
      recurringCell.textContent = exp.recurring ? "Yes" : "No";
      const paymentCell = document.createElement("td");
      paymentCell.textContent = exp.paymentMethod || "";
      const notesCell = document.createElement("td");
      notesCell.textContent = exp.notes || "";
      row.appendChild(dateCell);
      row.appendChild(categoryCell);
      row.appendChild(descCell);
      row.appendChild(budgetedCell);
      row.appendChild(actualCell);
      row.appendChild(recurringCell);
      row.appendChild(paymentCell);
      row.appendChild(notesCell);
      expensesTableBody.appendChild(row);
    });
  }
  
  function filterExpenses() {
    let filtered = allExpenses;
    const selectedCategory = filterCategoryEl.value;
    if (selectedCategory) {
      filtered = filtered.filter(exp => exp.category === selectedCategory);
    }
    const startDate = filterStartDateEl.value ? new Date(filterStartDateEl.value) : null;
    const endDate = filterEndDateEl.value ? new Date(filterEndDateEl.value) : null;
    if (startDate) {
      filtered = filtered.filter(exp => new Date(exp.date) >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(exp => new Date(exp.date) <= endDate);
    }
    const minAmount = filterMinAmountEl.value ? parseFloat(filterMinAmountEl.value) : null;
    const maxAmount = filterMaxAmountEl.value ? parseFloat(filterMaxAmountEl.value) : null;
    if (minAmount != null) {
      filtered = filtered.filter(exp => exp.actual != null && exp.actual >= minAmount);
    }
    if (maxAmount != null) {
      filtered = filtered.filter(exp => exp.actual != null && exp.actual <= maxAmount);
    }
    const searchTerm = filterSearchEl.value.trim().toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(exp => {
        const text = ((exp.category || "") + " " + (exp.description || "")).toLowerCase();
        return text.includes(searchTerm);
      });
    }
    renderExpensesTable(filtered);
  }
  
  applyFiltersBtn.addEventListener("click", filterExpenses);
  
  // -----------------------------
  // Debt Overview Section
  // -----------------------------
  const debtTableBody = document.getElementById("debt-table-body");

  function computePayoffMonths(balance, monthlyPayment, monthlyRate) {
    if (monthlyRate > 0 && monthlyPayment > balance * monthlyRate) {
      return -Math.log(1 - (monthlyRate * balance) / monthlyPayment) / Math.log(1 + monthlyRate);
    } else if (monthlyRate === 0) {
      return balance / monthlyPayment;
    }
    return null;
  }

  async function loadDebts() {
    try {
      const debts = await apiGet("/debt");
      renderDebtTable(debts);
    } catch (error) {
      console.error("Error loading debts:", error);
    }
  }

  function renderDebtTable(debts) {
    debtTableBody.innerHTML = "";
    debts.forEach(debt => {
      const row = document.createElement("tr");
      const r = (debt.apr / 100) / 12;
      let payoffDateText = "N/A";
      let payoffMonths = computePayoffMonths(debt.balance, debt.monthlyPayment, r);
      if (payoffMonths != null) {
        const payoffDate = new Date();
        payoffDate.setMonth(payoffDate.getMonth() + Math.round(payoffMonths));
        payoffDateText = payoffDate.toLocaleDateString();
      }
      const monthlyInterest = debt.balance * r;
      let interestMinPct = debt.minimumPayment > 0 ? (monthlyInterest / debt.minimumPayment) * 100 : "N/A";
      let interestMonthlyPct = debt.monthlyPayment > 0 ? (monthlyInterest / debt.monthlyPayment) * 100 : "N/A";
      // Calculate total interest paid (using simple amortization approximation).
      let payoffInterest = "N/A";
      if (payoffMonths != null) {
        const totalPaid = payoffMonths * debt.monthlyPayment;
        payoffInterest = totalPaid - debt.balance;
        payoffInterest = `$${payoffInterest.toFixed(2)}`;
      }
      row.innerHTML = `
        <td>${debt.debtName}</td>
        <td>$${debt.balance.toFixed(2)}</td>
        <td>${debt.apr}%</td>
        <td>$${debt.monthlyPayment.toFixed(2)}</td>
        <td>${debt.type || ""}</td>
        <td>${debt.dueDate || ""}</td>
        <td>${debt.minimumPayment != null ? "$" + debt.minimumPayment.toFixed(2) : ""}</td>
        <td>${debt.status || ""}</td>
        <td>${payoffDateText}</td>
        <td>${payoffInterest}</td>
        <td>${interestMinPct !== "N/A" ? interestMinPct.toFixed(1) + "%" : "N/A"}</td>
        <td>${interestMonthlyPct !== "N/A" ? interestMonthlyPct.toFixed(1) + "%" : "N/A"}</td>
      `;
      debtTableBody.appendChild(row);
    });
  }

  // -----------------------------
  // Savings Overview Section
  // -----------------------------
  const totalSavingsElem = document.getElementById("total-savings");
  const totalSavingsMonthlyElem = document.getElementById("total-savings-monthly");
  const overallProjectedElem = document.getElementById("overall-projected");
  const savingsTableBody = document.getElementById("savings-table-body");
  const toggleSavingsBtn = document.getElementById("toggle-savings-btn");
  
  async function loadSavings() {
    try {
      const savingsArr = await apiGet("/savings");
      renderSavingsSummary(savingsArr);
      renderSavingsTable(savingsArr);
    } catch (error) {
      console.error("Error loading savings:", error);
    }
  }
  
  function renderSavingsSummary(savingsArr) {
    let totalSavings = 0;
    let totalMonthlyContrib = 0;
    let projectedDates = [];
    
    savingsArr.forEach(savings => {
      totalSavings += savings.currentBalance;
      totalMonthlyContrib += savings.monthlyContribution || 0;
      if (savings.goalAmount && savings.monthlyContribution > 0) {
        const monthsToGoal = (savings.goalAmount - savings.currentBalance) / savings.monthlyContribution;
        if (monthsToGoal > 0) {
          const projDate = new Date();
          projDate.setMonth(projDate.getMonth() + Math.round(monthsToGoal));
          projectedDates.push(projDate);
        }
      }
    });
    totalSavingsElem.textContent = `$${totalSavings.toFixed(2)}`;
    totalSavingsMonthlyElem.textContent = `$${totalMonthlyContrib.toFixed(2)}`;
    
    if (projectedDates.length > 0) {
      const earliest = new Date(Math.min(...projectedDates.map(d => d.getTime())));
      overallProjectedElem.textContent = earliest.toLocaleDateString();
    } else {
      overallProjectedElem.textContent = "N/A";
    }
  }
  
  function renderSavingsTable(savingsArr) {
    savingsTableBody.innerHTML = "";
    savingsArr.forEach(savings => {
      const row = document.createElement("tr");
      
      let projDate = null;
      let projDateText = "N/A";
      let colorClass = "";
      let interestPaid = "N/A";
      if (savings.goalAmount && savings.monthlyContribution > 0) {
        const monthsToGoal = (savings.goalAmount - savings.currentBalance) / savings.monthlyContribution;
        if (monthsToGoal > 0) {
          projDate = new Date();
          projDate.setMonth(projDate.getMonth() + Math.round(monthsToGoal));
          projDateText = projDate.toLocaleDateString();
          if (savings.goalDate) {
            const desiredDate = new Date(savings.goalDate);
            const diffMonths = (projDate.getFullYear() - desiredDate.getFullYear()) * 12 + (projDate.getMonth() - desiredDate.getMonth());
            if (diffMonths <= 0) {
              colorClass = "green";
            } else if (diffMonths <= 3) {
              colorClass = "yellow";
            } else {
              colorClass = "red";
            }
          }
        }
      }
      
      // Rough estimate of total interest paid.
      if (projDate && savings.goalAmount && savings.monthlyContribution > 0) {
        const monthsToGoal = (savings.goalAmount - savings.currentBalance) / savings.monthlyContribution;
        const totalContrib = savings.monthlyContribution * monthsToGoal;
        interestPaid = totalContrib - (savings.goalAmount - savings.currentBalance);
        interestPaid = `$${interestPaid.toFixed(2)}`;
      }
      
      row.innerHTML = `
        <td>${savings.savingsName}</td>
        <td>$${savings.currentBalance.toFixed(2)}</td>
        <td>${savings.interestRate}%</td>
        <td>$${savings.monthlyContribution.toFixed(2)}</td>
        <td>${savings.goalAmount ? "$" + savings.goalAmount.toFixed(2) : "N/A"}</td>
        <td>${savings.goalDate ? new Date(savings.goalDate).toLocaleDateString() : "N/A"}</td>
        <td class="${colorClass}">${projDateText}</td>
        <td>${interestPaid}</td>
        <td>${savings.compoundPeriod || ""}</td>
      `;
      if (colorClass) {
        row.classList.add(colorClass);
      }
      savingsTableBody.appendChild(row);
    });
  }
  
  toggleSavingsBtn.addEventListener("click", () => {
    const savingsTableDiv = document.getElementById("savings-table");
    if (!savingsTableDiv.style.display || savingsTableDiv.style.display === "none") {
      savingsTableDiv.style.display = "block";
      toggleSavingsBtn.textContent = "Hide Savings Details";
    } else {
      savingsTableDiv.style.display = "none";
      toggleSavingsBtn.textContent = "Show Savings Details";
    }
  });
  
  // -----------------------------
  // Initial Load and Polling
  // -----------------------------
  loadIncome();
  setInterval(loadIncome, 1000);
  loadExpenses();
  // Assume expense filtering functions are already handled.
  loadDebts();
  setInterval(loadDebts, 1000);
  loadSavings();
  setInterval(loadSavings, 1000);
});
