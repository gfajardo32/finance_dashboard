import {useState, useEffect} from "react";

function App() {
  const [transactions, setTransactions] = useState([]);
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc4NTk1ODQ2NiwiZXhwIjoxNzg1OTYyMDY2fQ.07RosN0w61Z8HYfQmHznNSjiDDhsHTfEsA6ZUIrDbl4";
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(""); 

  useEffect(() => {
    fetch("http://localhost:3000/transactions", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {console.log(data);
        setTransactions(data);
      });
  }, []);

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
