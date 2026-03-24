// components/StatsBar.jsx
// Shows 3 summary numbers at the top:
//   - How many whale trades were found
//   - Total volume (all trades added up)
//   - The single biggest trade

import { formatUSD } from "./WhaleTable"

export default function StatsBar({ trades }) {

  // Count how many trades we have
  const count = trades.length

  // Add up all the USD values to get total volume
  // reduce() is like a loop that builds up a total
  const totalVolume = trades.reduce((sum, trade) => sum + trade.usdValue, 0)

  // Find the single biggest trade
  // Math.max(...) finds the largest number in a list
  const biggestBuy = trades.length > 0
    ? Math.max(...trades.map((t) => t.usdValue))
    : 0

  return (
    // grid grid-cols-3 = 3 columns side by side
    <div className="grid grid-cols-3 gap-4 mb-6">

      <StatCard label="Whales Found" value={count} color="text-white" />

      <StatCard
        label="Total Volume"
        value={formatUSD(totalVolume)}
        color="text-green-400"
      />

      <StatCard
        label="Biggest Buy"
        value={formatUSD(biggestBuy)}
        color="text-yellow-400"
      />

    </div>
  )
}

// A small helper component just for one stat card
// This is called a "sub-component" — it's used only inside StatsBar
function StatCard({ label, value, color }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      {/* Label at top */}
      <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
        {label}
      </div>
      {/* Big number below */}
      <div className={`text-2xl font-bold font-mono ${color}`}>
        {value}
      </div>
    </div>
  )
}
