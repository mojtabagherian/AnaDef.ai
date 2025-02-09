import { Clock } from "lucide-react"

export default function RecentTransactions({ data }) {
  if (!data) {
    return null
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Clock className="mr-2" /> Recent Transactions
      </h2>
      <ul className="space-y-4">
        {data.map((tx) => (
          <li key={tx.hash} className="bg-gray-700 p-4 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{tx.type}</div>
                <div className="text-sm text-gray-400">{tx.date}</div>
              </div>
              <div className="text-right">
                <div className={tx.amount >= 0 ? "text-green-400" : "text-red-400"}>
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount} {tx.token}
                </div>
                <div className="text-sm text-gray-400">${tx.usdValue}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

