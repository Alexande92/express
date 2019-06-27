const express = require('express');
const connectDb = require('./config/db');

const app = express();

const PORT = process.env.PORT || 3500;

connectDb();

// Init Middleware
app.use(express.json({ extended: false}));

app.get('/',  (req, res) => res.send(`API is running on the port ${PORT}`));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

app.listen(PORT,  () => {
    console.log(`Example app listening on port ${PORT}!`);
});