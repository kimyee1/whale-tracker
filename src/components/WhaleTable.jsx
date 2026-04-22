// components/WhaleTable.jsx
// This component shows all the whale buys in a table.
// It receives "trades" as a prop (data passed from App.jsx)

export default function WhaleTable({ trades }) {

  // If there are no trades to show, display a friendly message
  if (trades.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="text-5xl mb-3">??</div>
        <p>No whale buys found right now.</p>
        <p className="text-sm mt-1">The ocean is calm — check back soon!</p>
      </div>
    )
  }

  return (
    // overflow-x-auto = allows horizontal scrolling on small phone screens
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm">

        {/* Table header row */}
        <thead className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">Weight</th>
            <th className="px-4 py-3 text-left">Address</th>
            <th className="px-4 py-3 text-left">Token</th>
            <th className="px-4 py-3 text-left">Amount (USD)</th>
            <th className="px-4 py-3 text-left">Time</th>
            <th className="px-4 py-3 text-left">View</th>
          </tr>
        </thead>

        {/* Table body — one row per whale trade */}
        <tbody>
          {trades.map((trade, index) => (
            // Each row gets a unique "key" — React needs this to track rows
            <tr
              key={index}
              className="border-t border-gray-800 hover:bg-gray-900 transition-colors"
            >
              {/* Whale emoji based on size */}
              <td className="px-4 py-3 text-xl">
                {getWhaleEmoji(trade.usdValue)}
              </td>

              {/* Shortened wallet address */}
              <td className="px-4 py-3 font-mono text-gray-300">
                {trade.wallet}
              </td>

              {/* Token badge */}
              <td className="px-4 py-3">
                <span className="bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {trade.token}
                </span>
              </td>

              {/* USD value — color changes based on size */}
              <td className="px-4 py-3 font-mono font-bold">
                <span className={getAmountColor(trade.usdValue)}>
                  {formatUSD(trade.usdValue)}
                </span>
              </td>

              {/* Time */}
              <td className="px-4 py-3 text-gray-500 text-xs">
                {trade.time}
              </td>

              {/* Link to Basescan (blockchain explorer) */}
              <td className="px-4 py-3">
                <a
                  href={`https://basescan.org/tx/${trade.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs underline"
                >
                  Basescan ?
                </a>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )
}

// --- Helper Functions --------------------------------------------------------

// Returns a whale emoji based on how big the trade is
function getWhaleEmoji(usdValue) {
  if (usdValue >= 500000) return "??" // Huge trade — full whale!
  if (usdValue >= 100000) return "??" // Big trade
  return "??"                          // Medium trade
}

// Returns a Tailwind CSS color class based on trade size
function getAmountColor(usdValue) {
  if (usdValue >= 500000) return "text-yellow-400" // Gold for mega whales
  if (usdValue >= 100000) return "text-green-400"  // Green for big trades
  return "text-white"                               // White for normal
}

// Formats a number like 850000 into "$850K" or "$1.2M"
export function formatUSD(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${Math.round(value / 1000)}K`
  return `$${value}`
}
