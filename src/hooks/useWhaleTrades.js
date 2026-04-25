import { useState, useEffect } from "react"

const MIN_USD_VALUE = 15000

export function useWhaleTrades() {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchWhales()
    const interval = setInterval(fetchWhales, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchWhales() {
    try {
      setLoading(true)
      const apiKey = import.meta.env.VITE_ALCHEMY_KEY
      const url = `https://base-mainnet.g.alchemy.com/v2/${apiKey}`

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getAssetTransfers",
          params: [
            {
              fromBlock: "latest",
              toBlock: "latest",
              category: ["erc20"],
              withMetadata: true,
              excludeZeroValue: true,
              maxCount: "0x32",
            },
          ],
        }),
      })

      const data = await response.json()
      const transfers = data?.result?.transfers || []

      const whaleTransfers = transfers
        .map((tx) => ({
          wallet: shortenAddress(tx.from),
          token: tx.asset || "UNKNOWN",
          amount: parseFloat(tx.value || 0).toFixed(2),
          usdValue: estimateUSD(tx.asset, parseFloat(tx.value || 0)),
          time: formatTime(tx.metadata?.blockTimestamp),
          txHash: tx.hash,
          fullAddress: tx.from,
        }))
        .filter((tx) => tx.usdValue >= MIN_USD_VALUE)
        .sort((a, b) => b.usdValue - a.usdValue)

      setTrades(whaleTransfers)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { trades, loading, error }
}

function shortenAddress(addr) {
  if (!addr) return "Unknown"
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function formatTime(timestamp) {
  if (!timestamp) return "Just now"
  const diffMin = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000)
  if (diffMin < 1) return "Just now"
  if (diffMin < 60) return `${diffMin} mins ago`
  return `${Math.floor(diffMin / 60)}h ago`
}

function estimateUSD(token, amount) {
  const prices = { WETH: , ETH: 3500, cbETH: 3600, USDC: 1, USDT: 1, DAI: 1 }
  return amount * (prices[token] || 0)
}
