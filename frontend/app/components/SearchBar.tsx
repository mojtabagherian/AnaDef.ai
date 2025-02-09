"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"

interface SearchBarProps {
  onAnalyze: (data: any) => void
}

export default function SearchBar({ onAnalyze }: SearchBarProps) {
  const [address, setAddress] = useState("")
  const [network, setNetwork] = useState("Base")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const networks = ["ETH", "Base", "Polygon", "Arbitrum"]

  const handleAnalyze = async () => {
    if (!address) {
      setError("Please enter a wallet address")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Log the request payload
      console.log("Sending request with:", { 
        walletAddress: address, 
        network: network.toLowerCase() 
      })

      const response = await fetch("http://localhost:5002/analyze", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Add CORS headers if needed
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          walletAddress: address,
          network: network.toLowerCase() 
        }),
      })

      // Log the raw response
      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze wallet")
      }

      onAnalyze(data)
    } catch (err) {
      console.error("Error details:", err)
      setError(err instanceof Error ? err.message : "An error occurred while analyzing the wallet")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-grow relative w-full">
          <input
            type="text"
            placeholder="Enter wallet address"
            className="w-full px-4 py-3 bg-white/50 border border-[#1e40af]/20 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-[#1e40af]/50 text-gray-800"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Search className="absolute right-3 top-3.5 text-[#1e40af]/40" />
        </div>

        <div className="relative">
          <select
            className="appearance-none bg-white/50 border border-[#1e40af]/20 px-4 py-3 pr-10 
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]/50 text-gray-800"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
          >
            {networks.map((net) => (
              <option key={net} value={net}>
                {net}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3.5 text-[#1e40af]/40 pointer-events-none" />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="px-8 py-3 bg-[#059669] text-white rounded-lg hover:bg-[#059669]/90 
                   focus:outline-none focus:ring-2 focus:ring-[#059669]/50 focus:ring-offset-2 
                   transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {isLoading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
    </div>
  )
}

