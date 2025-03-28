module.exports = {
    // Settings
    ...require('./settingsController'),
  
    // Widgets
    ...require('./widgetsController'),
  
    // Finances
    ...require('./incomeController'),
    ...require('./savingsController'),
    ...require('./debtController'),
    ...require('./expensesController'),
  };
  