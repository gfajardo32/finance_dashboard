
function TransactionList({ transactions }) {
    return (
    <ul>
        {transactions.map((t) => (
        <li key={t.id}>
        {t.description}: {t.amount}
        </li>
        ))}
    </ul>
    );
}

export default TransactionList;
