import { useState, useEffect } from "react";
import TransactionList from "./components/TransactionList";
import TransactionForm from "./components/TransactionForm";
import LoginForm from "./components/LoginForm";
import Summary from "./components/Summary";

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
  function addTransaction(description, amount, currency) {
    apiFetch("/transactions", {
      method: "POST",
      body: JSON.stringify({
        description,
        amount,
        currency,
        category_id: null,
      }),
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

  function deleteTransaction(id) {
    apiFetch(`/transactions/${id}`, { method: "DELETE" }).then((data) => {
      if (!data) return;
      setTransactions(transactions.filter((t) => t.id !== id));
    });
  }

  useEffect(() => {
    if (!token) return;
    apiFetch("/transactions").then((data) => {
      if (data) setTransactions(data);
    });
  }, [token]);
  const lempiras = transactions.filter((t) => t.currency === "HNL");
  const dollars = transactions.filter((t) => t.currency === "USD");

  const totalHNL = lempiras.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalUSD = dollars.reduce((sum, t) => sum + Number(t.amount), 0);
  if (!token) {
    return (
      <div>
        <h1>Login</h1>
        <LoginForm onLogin={login} />
      </div>
    );
  }
  return (
    <div>
      <h1>Finance Dashboard</h1>
      <button onClick={logout}>Logout</button>

      <TransactionForm onAdd={addTransaction} />

      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: 1 }}>
          <h2>Lempiras</h2>
          <Summary total={totalHNL} currency="HNL" />
          <TransactionList
            transactions={lempiras}
            onDelete={deleteTransaction}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h2>Dólares</h2>
          <Summary total={totalUSD} currency="USD" />
          <TransactionList
            transactions={dollars}
            onDelete={deleteTransaction}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
