import React, { useState } from 'react'

export default function WalletAnalysis({ data }) {
  if (!data) {
    return <div className="text-center p-4">Enter a wallet address to analyze</div>
  }

  if (data.error) {
    return <div className="text-red-500 p-4">{data.error}</div>
  }

  // Add loading state
  const [isLoading, setIsLoading] = useState(false)

  // ... rest of the component
} 