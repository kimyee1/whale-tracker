import { useState } from "react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import WhaleTable from "./components/WhaleTable"
import StatsBar from "./components/StatsBar"
import FilterBar from "./components/FilterBar"
import { useWhaleTrades } from "./hooks/useWhaleTrades"

export default function App() {
  const [activeToken, setActiveToken] = useState("all")
  const { trades, loading, error } = useWhaleTrades()

  const filteredTrades =
    activeToken === "all"
      ? trades
      : trades.filter((trade) => trade.token === activeToken)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">
            Base Whale Tracker
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Large token purchases happening live on Base blockchain
          </p>
        </div>

        <StatsBar trades={filteredTrades} />
        <FilterBar activeToken={activeToken} onSelect={setActiveToken} />

        {loading && (
          <p className="text-center text-gray-400 mt-10">
            Loading whale data from Base...
          </p>
        )}

        {error && (
          <p className="text-center text-red-400 mt-10">
            Error: {error}. Check your API key in the .env file.
          </p>
        )}

        {!loading && !error && (
          <WhaleTable trades={filteredTrades} />
        )}
      </main>
      <Footer />
    </div>
  )
}
