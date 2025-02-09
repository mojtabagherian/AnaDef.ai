// Basic Types
export interface TokenBalance {
  symbol: string
  name: string
  balance: string
  usdValue: string
}

export interface Transaction {
  hash: string
  type: string
  date: string
  amount: number
  token: string
  usdValue: string
}

// Analytics Types
export interface AnalyticsResult {
  tokenBalances: TokenBalance[]
  recentTransactions: Transaction[]
  liquidityPositions: any[]
  riskMetrics: {
    riskScore: number
    highRiskTxCount: number
    totalValue: number
    uniqueProtocols: string[]
  }
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
}

// AI Types
export interface ProtocolData {
  protocols: Array<{
    name: string
    tvl: number
    apy: number
    risk: string
  }>
}

export interface AiInsights {
  analysis: string
  recommendations: string[]
}

// Wallet Analysis Result
export interface WalletAnalysisResult {
  analysis: string
  tokenBalances: TokenBalance[]
  recentTransactions: Transaction[]
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
} 