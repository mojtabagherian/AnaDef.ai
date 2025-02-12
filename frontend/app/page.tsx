"use client"

import { useState } from "react"
import Navbar from "./components/Navbar"
import SearchBar from "./components/SearchBar"
import AnalyticsDisplay from "./components/AnalyticsDisplay"
import NetworkStatus from "./components/NetworkStatus"
import { AiChatBox } from "./components/AiChatBox"

interface AnalyticsData {
  analysis: string
  tokenBalances: Array<{
    symbol: string
    name: string
    balance: string
    usdValue: string
  }>
  recentTransactions: Array<{
    hash: string
    type: string
    date: string
    amount: number
    token: string
    usdValue: string
  }>
  protocolAnalytics: {
    tvlHistory: Array<{
      date: string
      value: number
    }>
    assetAllocation: Array<{
      asset: string
      percentage: number
    }>
  }
  network: {
    name: string
    gasPrice: string
    blockHeight: string
    tps: string
  }
  walletAddress?: string
}

export default function Home() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [address, setAddress] = useState('')

  const handleAnalyze = (data: AnalyticsData) => {
    console.log("Received analytics data:", data)
    setAnalyticsData(data)
    setAddress(data.walletAddress || '')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Centered Search Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-2xl font-bold text-[#1e40af] text-center mb-4">Wallet Analytics</h1>
          <p className="text-center text-gray-600 mb-8">Powered by Covalent</p>
          <SearchBar onAnalyze={handleAnalyze} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalyticsDisplay data={analyticsData} />
          <AiChatBox 
            walletData={analyticsData} 
            walletAddress={address} 
          />
        </div>

        {/* Network Status */}
        <div className="mt-8">
          <NetworkStatus network={analyticsData?.network} />
        </div>
      </main>
    </div>
  )
}

