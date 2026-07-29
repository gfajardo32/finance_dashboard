const express = require("express");
const pool = require("./db");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.disable("x-powered-by");

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // 2. validás
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, hash],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT id, email, password_hash FROM users WHERE email = $1",
    [email],
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.post("/transactions", authenticate, async (req, res) => {
  const { amount, description, category_id } = req.body;
  const result = await pool.query(
    "INSERT INTO transactions (user_id, amount, description, category_id) VALUES ($1, $2, $3, $4) RETURNING id, amount, description, category_id, occurred_at",
    [req.userId, amount, description, category_id],
  );
  res.status(201).json(result.rows[0]);
});

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.get("/users", authenticate, async (req, res) => {
  const result = await pool.query("SELECT id, email, created_at FROM users");
  res.json(result.rows);
});

app.get("/transactions", authenticate, async (req, res) => {
  const result = await pool.query(
    "SELECT id, amount, description, category_id, occurred_at FROM transactions WHERE user_id = $1 ORDER BY occurred_at DESC",
    [req.userId],
  );
  res.json(result.rows);
});

app.listen(3000, () => console.log("Server is running on port 3000"));

//AUTHENTICATION
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
