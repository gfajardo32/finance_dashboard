import { useState, useEffect } from "react";
import TransactionList from "./components/TransactionList";
import TransactionForm from "./components/TransactionForm";
import LoginForm from "./components/LoginForm";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }
  async function apiFetch(path, options = {}) {
    const res = await fetch(`http://localhost:3000${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      logout();
      return null;
    }

    return res.json();
  }
  function addTransaction(description, amount) {
    apiFetch("/transactions", {
      method: "POST",
      body: JSON.stringify({ description, amount, category_id: null }),
    }).then((newTransaction) => {
      if (!newTransaction) return;
      setTransactions([newTransaction, ...transactions]);
    });
  }
  function login(email, password) {
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          alert("Invalid credentials");
        }
      });
  }
  useEffect(() => {
    if (!token) {
      return (
        <div>
          <h1>Login</h1>
          <LoginForm onLogin={login} />
        </div>
      );
    }
  }, [token]);
  if (!token) {
    return (
      <div>
        <h1>Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            fetch("http://localhost:3000/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.token) {
                  localStorage.setItem("token", data.token);
                  setToken(data.token);
                } else {
                  alert("Invalid credentials");
                }
              });
          }}
        >
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" name="email" placeholder="Email" />
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
  return (
    <div>
      <h1>Finance Dashboard</h1>
      <button onClick={logout}>Logout</button>
      {/* list of transactions */}
      <TransactionList transactions={transactions} />
      {/*form submission handler for transactions */}
      <TransactionForm onAdd={addTransaction} />
    </div>
  );
}

export default App;
