const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/users');

const app = express();

// Database connection
connectDB();

// Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('Server Running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port:${PORT}`);
});
