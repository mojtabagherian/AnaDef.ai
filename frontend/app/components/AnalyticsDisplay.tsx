"use client"

import { Coins } from "lucide-react"
import TokenBalances from "./TokenBalances"
import RecentTransactions from "./RecentTransactions"
import ProtocolAnalytics from "./ProtocolAnalytics"

interface AnalyticsDisplayProps {
  data: any | null  // Replace 'any' with proper type later
}

export default function AnalyticsDisplay({ data }: AnalyticsDisplayProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-[#1e40af]/10">
      <h2 className="text-xl font-semibold text-[#1e40af] mb-6 flex items-center">
        <Coins className="mr-2" />
        Covalent Analysis Results
      </h2>

      {!data ? (
        <div className="text-gray-600 text-center py-12">No wallet analyzed yet</div>
      ) : (
        <div className="space-y-6">
          <TokenBalances data={data.tokenBalances} />
          <RecentTransactions data={data.recentTransactions} />
          <ProtocolAnalytics data={data.protocolAnalytics} />
        </div>
      )}
    </div>
  )
}

