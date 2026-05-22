const express = require('express')
const router = express.Router()
const pool = require('./db')
const authMiddleware = require('./middleware')

// Get all categories
router.get('/', authMiddleware, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM categories WHERE user_id = $1',
    [req.user.id]
  )
  res.json(result.rows)
})

// Create a category
router.post('/', authMiddleware, async (req, res) => {
  const { name, type, color } = req.body
  const result = await pool.query(
    'INSERT INTO categories (user_id, name, type, color) VALUES ($1, $2, $3, $4) RETURNING *',
    [req.user.id, name, type, color]
  )
  res.json(result.rows[0])
})

// Delete a category
router.delete('/:id', authMiddleware, async (req, res) => {
  await pool.query(
    'DELETE FROM categories WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id]
  )
  res.json({ message: 'Deleted' })
})

module.exports = router