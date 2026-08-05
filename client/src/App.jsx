import {useState, useEffect} from "react";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [token, setToken] = useState(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(""); 

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3000/transactions", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {console.log(data);
        setTransactions(data);
      });
  }, [token]);
if (!token) {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          const email = e.target.email.value;
          const password = e.target.password.value;
          fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
          })
            .then(res => res.json())
            .then(data => {
              if (data.token) {
                setToken(data.token);
              } else {
                alert("Invalid credentials");
              }
            });
        }}>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" placeholder="Email" />
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
  return (
    <div>
      <h1>Finance Dashboard</h1>
      {/* list of transactions */}
      <ul> 
        {transactions.map(t => (
          <li key={t.id}>{t.description}: {t.amount}</li>
        ))}
      </ul> 
      {/*form submission handler for transactions */}
      <form onSubmit={(e) => {
        e.preventDefault();
        fetch("http://localhost:3000/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ description, amount, category_id: null })
          })
          .then(res => res.json())
          .then(newTransaction => {
            setTransactions([newTransaction, ...transactions]);
            setDescription("");
            setAmount("");
        });
      }}>
        <label htmlFor="description">Description:</label>
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <label htmlFor="amount">amount:</label>
        <input type="text" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
}

export default App;
