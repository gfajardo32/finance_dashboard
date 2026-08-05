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
      {/* list of transactions */}
      <TransactionList
        transactions={transactions}
        onDelete={deleteTransaction}
      />{" "}
      {/*form submission handler for transactions */}
      <TransactionForm onAdd={addTransaction} />
    </div>
  );
}

export default App;
