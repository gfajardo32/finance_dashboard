const { Pool } = require('pg')

const pool = new Pool({
  user: 'guidofajardo',
  host: 'localhost',
  database: 'finance_dashboard',
  password: '',
  port: 5432,
})

module.exports = pool