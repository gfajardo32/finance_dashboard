import {useState, useEffect} from "react";

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/transactions", {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc4NTI5ODEyOSwiZXhwIjoxNzg1MzAxNzI5fQ.ewh2HJQt3mUVe76lUWl27BF-zhTgpRdRSSjBKd2lHuw'
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
      <ul>
        {transactions.map(t => (
          <li key={t.id}>{t.description}: {t.amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
