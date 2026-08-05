import { formatCurrency, formatDate } from "../utils/format";

function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return <p>No transactions yet.</p>;
  }

  return (
    <ul>
      {transactions.map((t) => (
        <li key={t.id}>
          {formatDate(t.occurred_at)} — {t.description}:{" "}
          {formatCurrency(t.amount, t.currency)}
          <button onClick={() => onDelete(t.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default TransactionList;