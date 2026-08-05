import { useState } from "react";

function TransactionForm({ onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(description, amount);
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
      <button type="submit">Add Transaction</button>
    </form>
  );
}

export default TransactionForm;