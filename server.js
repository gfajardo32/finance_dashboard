const express = require('express');
const pool = require('./db');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


app.use(express.json());

app.post('/register', async (req, res) => {
    const {email, password} = req.body;
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at', [email, hash]);
    res.status(201).json(result.rows[0]);
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    
    const result = await pool.query(
        'SELECT id, email, password_hash FROM users WHERE email = $1',
        [email]
    );

    if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials'});
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
        return res.status(401).json({ error: 'Invalid credentials'});
    }
    
    const token = jwt.sign(
        { userId: user.id},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );
    res.json({ token });
});
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

app.get ('/users', authenticate, async (req, res) => {
    const result = await pool.query('SELECT id, email, created_at FROM users');
    res.json(result.rows);
});

app.listen(3000,  () => console.log('Server is running on port 3000')); 


//AUTHENTICATION
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    
    
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided'});
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token'});
    }
}
