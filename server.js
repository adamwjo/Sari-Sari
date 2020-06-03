const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Database connection call
connectDB();

app.get('/', (req, res) => {
  res.send('Server Running');
});

//Route Imports
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/profiles', require('./routes/profiles'));
app.use('/api/v1/posts', require('./routes/posts'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started on port:${PORT}`);
});
