// index.js
const express = require('express')
const connectDB = require('./config/db')

const app = express()

// Connect Database
connectDB()

// Init Middleware
app.use(express.json())

// Define Routes
app.use('/api/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
