import { BigInt, BigDecimal } from '@graphprotocol/graph-ts'
import { AnalysisCompleted } from '../generated/Analytics/Analytics'
import { WalletAnalysis, TokenBalance, Transaction } from '../generated/schema'

export function handleAnalysisCompleted(event: AnalysisCompleted): void {
  let analysis = new WalletAnalysis(event.transaction.hash.toHex())
  analysis.wallet = event.params.wallet.toHexString()
  analysis.timestamp = event.block.timestamp
  analysis.save()
} 