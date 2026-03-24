// hooks/useWhaleTrades.js
// A "hook" is just a reusable function in React that handles data or logic.
// This one fetches large token transfers (whale buys) from Base blockchain
// using the Alchemy API.

import { useState, useEffect } from "react"

// This is the minimum USD value to be considered a "whale buy"
// $10,000 = only show trades larger than $10k
const MIN_USD_VALUE = 10000

export function useWhaleTrades() {
  // useState creates a variable that React watches.
  // When it changes, the screen automatically updates.
  const [trades, setTrades] = useState([])       // The list of whale trades
  const [loading, setLoading] = useState(true)   // Are we still fetching?
  const [error, setError] = useState(null)       // Any error message

  useEffect(() => {
    // useEffect runs code when the component first appears on screen
    // The empty [] at the bottom means "only run once when page loads"

    fetchWhales() // Run the fetch immediately when page loads

    // Also set up auto-refresh every 30 seconds (30000 milliseconds)
    const interval = setInterval(fetchWhales, 30000)

    // Cleanup: when user leaves the page, stop the auto-refresh
    return () => clearInterval(interval)
  }, [])

  async function fetchWhales() {
    try {
      setLoading(true)

      // Your Alchemy API key — stored safely in .env file
      const apiKey = import.meta.env.VITE_ALCHEMY_KEY

      // The Alchemy API URL for Base Mainnet
      const url = `https://base-mainnet.g.alchemy.com/v2/${apiKey}`

      // We call the Alchemy API and ask for recent token transfers
      // "asset transfers" = movements of tokens between wallets
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getAssetTransfers",
          params: [
            {
              fromBlock: "latest",   // Start from the most recent block
              toBlock: "latest",     // End at the most recent block
              category: ["erc20"],   // Only look at ERC20 token transfers
              withMetadata: true,    // Include extra info like timestamps
              excludeZeroValue: true, // Skip $0 transfers
              maxCount: "0x32",      // Max 50 results (0x32 = 50 in hex)
            },
          ],
        }),
      })

      const data = await response.json()

      // "data.result.transfers" is where Alchemy puts the list of transfers
      const transfers = data?.result?.transfers || []

      // Now we clean up the data and only keep the big ones
      const whaleTransfers = transfers
        .map((tx) => ({
          // Shorten the wallet address so it fits on screen
          // e.g. "0x123456789abcdef" → "0x1234...cdef"
          wallet: shortenAddress(tx.from),

          // The token symbol (e.g. "USDC", "WETH")
          token: tx.asset || "UNKNOWN",

          // The amount in tokens (not USD yet)
          amount: parseFloat(tx.value || 0).toFixed(2),

          // USD value — Alchemy sometimes provides this
          // If not available, we use 0
          usdValue: tx.metadata?.value
            ? parseFloat(tx.metadata.value)
            : estimateUSD(tx.asset, parseFloat(tx.value || 0)),

          // When this happened
          time: formatTime(tx.metadata?.blockTimestamp),

          // Full transaction hash for the Basescan link
          txHash: tx.hash,

          // Full wallet address (for the Basescan link)
          fullAddress: tx.from,
        }))
        // Only keep trades worth more than $10,000
        .filter((tx) => tx.usdValue >= MIN_USD_VALUE)
        // Sort so the biggest buys appear at the top
        .sort((a, b) => b.usdValue - a.usdValue)

      setTrades(whaleTransfers)
      setError(null) // Clear any previous errors
    } catch (err) {
      // If something went wrong, save the error message
      setError(err.message)
    } finally {
      // Always set loading to false when done (whether success or error)
      setLoading(false)
    }
  }

  // Return the data so our components can use it
  return { trades, loading, error }
}

// ─── Helper Functions ───────────────────────────────────────────────────────

// Shorten a wallet address for display
// "0x1234567890abcdef1234" → "0x1234...cdef"
function shortenAddress(addr) {
  if (!addr) return "Unknown"
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

// Format a blockchain timestamp into a human-readable "X minutes ago"
function formatTime(timestamp) {
  if (!timestamp) return "Just now"
  const now = Date.now()
  const then = new Date(timestamp).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return "Just now"
  if (diffMin === 1) return "1 min ago"
  if (diffMin < 60) return `${diffMin} mins ago`

  const diffHr = Math.floor(diffMin / 60)
  return `${diffHr}h ago`
}

// Rough USD estimate when Alchemy doesn't provide a price
// These are approximate — in a real app you'd fetch live prices
function estimateUSD(token, amount) {
  const prices = {
    WETH: 3500,   // 1 WETH ≈ $3,500
    ETH: 3500,
    cbETH: 3600,
    USDC: 1,      // Stablecoins = $1
    USDT: 1,
    DAI: 1,
  }
  const price = prices[token] || 0
  return amount * price
}
