import { TokenBalance, Transaction, WalletAnalysisResult } from '../types'
import { covalentService, SupportedChain, BatchItem } from '../types/covalent'

interface ToolParams {
  walletAddress: string
  chain?: SupportedChain
}

// Token balance tool
export const tokenBalancesTool = {
  name: 'getTokenBalances',
  description: 'Get token balances',
  async execute({ walletAddress, chain = SupportedChain.ETH_MAINNET }: ToolParams) {
    try {
      const resp = await covalentService.getBalances(walletAddress, chain)
      if (!resp?.items) throw new Error('No data returned')
      
      return resp.items.map(item => ({
        symbol: item.contract_ticker_symbol || '',
        name: item.contract_name || '',
        balance: String(BigInt(item.balance || '0')),
        usdValue: String(item.quote || 0)
      })) as TokenBalance[]
    } catch (error) {
      console.error('Error fetching balances:', error)
      throw error
    }
  }
}

// Protocol analytics tool
export const protocolAnalyticsTool = {
  name: 'getProtocolAnalytics',
  description: 'Get protocol analytics',
  async execute({ walletAddress, chain = SupportedChain.ETH_MAINNET }: ToolParams) {
    try {
      const response = await covalentService.getTransactions(walletAddress, chain)
      const transactions: Transaction[] = []
      
      if (response.data?.items) {
        transactions.push(...response.data.items.map(item => ({
          hash: item.tx_hash || '',
          type: item.successful ? 'success' : 'failed',
          date: new Date(item.block_signed_at || Date.now()).toISOString(),
          amount: Number(item.value || '0'),
          token: item.contract_ticker_symbol || 'ETH',
          usdValue: String(item.value_quote || 0)
        })))
      }
      
      return { transactions }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  }
}

export const covalentAgent = {
  async analyze(walletAddress: string, chainStr: string = "eth-mainnet"): Promise<WalletAnalysisResult> {
    try {
      const chain = chainStr.toLowerCase() === "eth-mainnet" 
        ? SupportedChain.ETH_MAINNET 
        : SupportedChain.BASE_MAINNET

      const [balances, analytics] = await Promise.all([
        tokenBalancesTool.execute({ walletAddress, chain }),
        protocolAnalyticsTool.execute({ walletAddress, chain })
      ])

      const totalValue = balances.reduce((sum, token) => sum + Number(token.usdValue), 0)
      const uniqueTokens = new Set(balances.map(token => token.symbol))
      const recentActivity = analytics.transactions.slice(0, 10)

      return {
        tokenBalances: balances,
        recentTransactions: recentActivity,
        analysis: `Wallet ${walletAddress} on ${chainStr}:
          - Total Value: $${totalValue.toLocaleString()}
          - Unique Tokens: ${uniqueTokens.size}
          - Recent Activity: ${recentActivity.length} transactions
          - Most Active Token: ${getMostActiveToken(recentActivity)}`,
        protocolAnalytics: {
          tvlHistory: generateTVLHistory(balances, recentActivity),
          assetAllocation: calculateAssetAllocation(balances, totalValue)
        }
      }
    } catch (error) {
      console.error('Covalent agent error:', error)
      throw error
    }
  }
}

// Helper functions
function getMostActiveToken(transactions: Transaction[]): string {
  const tokenCounts = transactions.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.token] = (acc[tx.token] || 0) + 1
    return acc
  }, {})
  
  const sortedTokens = Object.entries(tokenCounts).sort(([,a], [,b]) => b - a)
  return sortedTokens[0]?.[0] || 'None'
}

function generateTVLHistory(balances: TokenBalance[], transactions: Transaction[]) {
  const dates = [...new Set(transactions.map(tx => tx.date.split('T')[0]))]
  return dates.map(date => ({
    date,
    value: calculateTVLForDate(date, transactions, balances)
  }))
}

function calculateTVLForDate(date: string, transactions: Transaction[], currentBalances: TokenBalance[]): number {
  const dayTransactions = transactions.filter(tx => tx.date.startsWith(date))
  return dayTransactions.reduce((sum, tx) => sum + Number(tx.usdValue), 0)
}

function calculateAssetAllocation(balances: TokenBalance[], totalValue: number) {
  return balances.map(token => ({
    asset: token.symbol,
    percentage: (Number(token.usdValue) / totalValue) * 100
  })).sort((a, b) => b.percentage - a.percentage)
} 