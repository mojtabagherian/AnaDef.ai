import { Chains } from '@covalenthq/client-sdk';

export const SUPPORTED_NETWORKS = [
  'eth-mainnet',
  'base-mainnet',
  'polygon-mainnet',
  'arbitrum-one',
  'base-sepolia'
] as const;

export type SupportedNetwork = typeof SUPPORTED_NETWORKS[number];

export interface NetworkData {
  network: SupportedNetwork;
  balances: any[]; // Will be updated with proper Covalent types
  transactions: any[];
  error?: boolean;
}

export interface NetworkResponse {
  network: SupportedNetwork;
  data: NetworkData | null;
  error?: string;
}

export function summarizeNetworkData(data: NetworkData): string {
  const balanceCount = Array.isArray(data.balances) ? data.balances.length : 0;
  const txCount = Array.isArray(data.transactions) ? data.transactions.length : 0;
  
  return `
    Network: ${data.network}
    Total Balances: ${balanceCount}
    Total Transactions: ${txCount}
  `;
}

export function isActiveNetwork(data: NetworkData): boolean {
  return !data.error && 
    Array.isArray(data.balances) && 
    Array.isArray(data.transactions) &&
    (data.balances.length > 0 || data.transactions.length > 0);
}

export function getChainId(network: SupportedNetwork): Chains {
  return network as Chains;
} 