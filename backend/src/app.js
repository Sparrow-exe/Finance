const express = require('express');
const connectDB = require('./config/db');
const incomeRoutes = require('./routes/incomeRoutes');
const debtRoutes = require('./routes/debtRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Connect to MongoDB
connectDB();


// Middleware to parse JSON
app.use(express.json());

// Use the income routes (all routes under /income)
app.use('/api/income', incomeRoutes);
app.use('/api/debt', debtRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/expenses', expenseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
