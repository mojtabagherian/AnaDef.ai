import { CovalentClient } from "@covalenthq/client-sdk";

// Define supported chains as const enum
export const enum SupportedChain {
 ETH_MAINNET = "eth-mainnet", 
 BASE_MAINNET = "base-mainnet"
}

// Define response types
export interface BatchItem {
 tx_hash: string;
 block_signed_at: string;
 value: string | null;
 gas_spent: number;
 successful: boolean;
 to_address: string;
 contract_ticker_symbol?: string;
 value_quote?: number;
}

export interface TransactionResponse {
 data: {
   items: BatchItem[];
   pagination?: {
     has_more: boolean;
     page_number: number;
     page_size: number;
     total_count: number;
   }
 }
}

// Create a singleton service class 
class CovalentService {
 private static instance: CovalentService;
 private client: CovalentClient;

 private constructor() {
   this.client = new CovalentClient(process.env.COVALENT_API_KEY || "");
 }
 public static getInstance(): CovalentService {
   if (!CovalentService.instance) {
     CovalentService.instance = new CovalentService();
   }
   return CovalentService.instance;
 }

 async getBalances(walletAddress: string, chain: SupportedChain) {
   try {
     const response = await this.client.BalanceService.getTokenBalancesForWalletAddress(chain, walletAddress);
     return response.data;
   } catch (error) {
     console.error("Covalent API error:", error);
     throw error;
   }
 }

 async getTransactions(walletAddress: string, chain: SupportedChain): Promise<TransactionResponse> {
   try {
     const response = await this.client.TransactionService.getAllTransactionsForAddress(chain, walletAddress);
     const firstBatch = await response[Symbol.asyncIterator]().next();
     return firstBatch.value;
   } catch (error) {
     console.error("Covalent API error:", error);
     throw error;
   }
 }
}

export const covalentService = CovalentService.getInstance();