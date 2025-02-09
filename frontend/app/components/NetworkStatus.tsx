"use client"

import { Wifi } from "lucide-react"

interface NetworkStatusProps {
  network?: {
    name: string
    gasPrice: string
    blockHeight: string
    tps: string
  }
}

export default function NetworkStatus({ network }: NetworkStatusProps) {
  // Default values if network is undefined
  const defaultNetwork = {
    name: "Unknown",
    gasPrice: "N/A",
    blockHeight: "N/A",
    tps: "N/A",
  }

  // Use network data if available, otherwise use default values
  const { name, gasPrice, blockHeight, tps } = network || defaultNetwork

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-[#1e40af] mb-6 flex items-center">
        <Wifi className="mr-2 text-[#059669]" /> Network Status
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatusCard label="Network" value={name} />
        <StatusCard label="Gas Price" value={`${gasPrice} Gwei`} />
        <StatusCard label="Block Height" value={blockHeight} />
        <StatusCard label="TPS" value={tps} />
      </div>
    </div>
  )
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#1e40af]/5 p-4 rounded-lg">
      <div className="font-medium text-[#059669]">{label}</div>
      <div className="text-lg text-gray-800">{value}</div>
    </div>
  )
}

