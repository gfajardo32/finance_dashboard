require('dotenv').config()


const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})

const pool = require('./db')

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB connection error:', err)
  } else {
    console.log('DB connected:', res.rows[0])
  }
})

const authRoutes = require('./auth')
app.use('/api/auth', authRoutes)