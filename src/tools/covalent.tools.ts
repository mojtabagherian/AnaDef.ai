import { CovalentClient, Chain } from '@covalenthq/client-sdk';
import { config } from '../config/agent.config';

export class CovalentTools {
  private client: CovalentClient;

  constructor() {
    if (!config.covalent.apiKey) {
      throw new Error('Covalent API key is required');
    }
    this.client = new CovalentClient(config.covalent.apiKey);
  }

  async getTokenBalances(address: string) {
    try {
      const response = await this.client.BalanceService.getTokenBalancesForWalletAddress(
        config.base.networkId as Chain,
        address
      );
      return response;
    } catch (error) {
      console.error('Error fetching token balances:', error);
      throw error;
    }
  }

  async getTransactionHistory(address: string) {
    try {
      const response = await this.client.TransactionService.getTransactionsForAddressV3(
        config.base.networkId as Chain,
        address,
        1 // page number
      );
      return response;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }
}

// Tool wrapper
export class TokenBalanceTool {
    private tools: CovalentTools;
    
    constructor() {
        this.tools = new CovalentTools();
    }

    name = 'token_balance';
    description = 'Get token balances for a wallet address';

    async execute(address: string) {
        return await this.tools.getTokenBalances(address);
    }
}