export async function analyzeWallet(walletAddress: string, network: string) {
  // Mock response for now
  return {
    analysis: `Analysis for ${walletAddress} on ${network}`,
    tokenBalances: [
      {
        symbol: "ETH",
        name: "Ethereum",
        balance: "1.5",
        usdValue: "3000"
      }
    ],
    recentTransactions: [
      {
        hash: "0x123...",
        type: "Transfer",
        date: "2024-02-08",
        amount: 0.5,
        token: "ETH",
        usdValue: "1000"
      }
    ],
    protocolAnalytics: {
      tvlHistory: [
        { date: "2024-01", value: 1000 },
        { date: "2024-02", value: 1200 }
      ],
      assetAllocation: [
        { asset: "ETH", percentage: 60 },
        { asset: "USDC", percentage: 40 }
      ]
    }
  }
} 