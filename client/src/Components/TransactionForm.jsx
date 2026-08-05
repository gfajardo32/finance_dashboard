import { useState } from "react";

function TransactionForm({ onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("HNL");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(description, amount, currency);
        setDescription("");
        setAmount("");
      }}
    >
      <label htmlFor="description">Description:</label>
      <input
        id="description"
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="amount">Amount:</label>
      <input
        id="amount"
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <label htmlFor="currency">Currency:</label>
      <select
        id="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option value="HNL">Lempiras</option>
        <option value="USD">Dólares</option>
      </select>

      <button type="submit">Add Transaction</button>
    </form>
  );
}

export default TransactionForm;