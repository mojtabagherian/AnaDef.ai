import { Coins } from "lucide-react"

export default function TokenBalances({ data }) {
  if (!data) {
    return null
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Coins className="mr-2" /> Token Balances
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((token) => (
          <div key={token.symbol} className="bg-gray-700 p-4 rounded-md">
            <div className="font-semibold">{token.name}</div>
            <div className="text-sm text-gray-400">{token.symbol}</div>
            <div className="mt-2">
              <span className="text-lg">{token.balance}</span>
              <span className="text-sm text-gray-400 ml-2">${token.usdValue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

