const express = require('express')
const router = express.Router()
const pool = require('./db')
const authMiddleware = require('./middleware')

// Get all transactions
router.get('/', authMiddleware, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
    [req.user.id]
  )
  res.json(result.rows)
})

// Create a transaction
router.post('/', authMiddleware, async (req, res) => {
  const { category_id, type, amount, date, note } = req.body
  const result = await pool.query(
    'INSERT INTO transactions (user_id, category_id, type, amount, date, note) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [req.user.id, category_id, type, amount, date, note]
  )
  res.json(result.rows[0])
})

// Update a transaction
router.put('/:id', authMiddleware, async (req, res) => {
  const { category_id, type, amount, date, note } = req.body
  const result = await pool.query(
    'UPDATE transactions SET category_id=$1, type=$2, amount=$3, date=$4, note=$5, updated_at=NOW() WHERE id=$6 AND user_id=$7 RETURNING *',
    [category_id, type, amount, date, note, req.params.id, req.user.id]
  )
  res.json(result.rows[0])
})

// Delete a transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  await pool.query(
    'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id]
  )
  res.json({ message: 'Deleted' })
})

module.exports = router