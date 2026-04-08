// components/FilterBar.jsx
// Row of buttons to filter trades by token type
// e.g. clicking "USDC" shows only USDC whale trades

// These are the filter options we show as buttons
const TOKENS = ["all", "USDC", "WETH", "cbETH", "BRETT", "DAI", "BNB", "BTC", "ETHT"]

export default function FilterBar({ activeToken, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap mb-5">

      {/* Loop through each token and create a button for it */}
      {TOKENS.map((token) => (
        <button
          key={token}
          // When clicked, call onSelect with this token's name
          onClick={() => onSelect(token)}
          className={`
            px-4 py-1.5 rounded-full text-sm font-medium border transition-all
            ${
              // If this button is the active filter, make it blue
              // Otherwise, make it gray/outlined
              activeToken === token
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
            }
          `}
        >
          {/* Show "All" with capital A, others as-is */}
          {token === "all" ? "All Tokens" : token}
        </button>
      ))}

    </div>
  )
}
