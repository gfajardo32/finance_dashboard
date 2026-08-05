function TransactionList({ transactions, onDelete }) {
return (
    <ul>
    {transactions.map((t) => (
        <li key={t.id}>
        {t.description}: {t.amount}
        <button onClick={() => onDelete(t.id)}>Delete</button>
        </li>
    ))}
    </ul>
    
);
}

export default TransactionList;