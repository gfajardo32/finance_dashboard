import { formatCurrency } from "../utils/format";

function Summary({ total, currency }) {
  return <h3>Total: {formatCurrency(total, currency)}</h3>;
}

export default Summary;