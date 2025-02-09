import { AgentKit, CdpWalletProvider } from '@coinbase/agentkit';
import { getLangChainTools } from '@coinbase/agentkit-langchain';
import { ChatOpenAI } from '@langchain/openai';
import { CovalentClient, Chains, BalancesResponse, TransactionsResponse } from '@covalenthq/client-sdk';
import { GraphService } from '../services/graph.service';
import { config } from '../config/agent.config';
import { SUPPORTED_NETWORKS, SupportedNetwork, NetworkData, isActiveNetwork, getChainId } from '../services/network.service';

interface NetworkResult {
  network: SupportedNetwork;
  balances: BalancesResponse;
  transactions: TransactionsResponse;
  error: boolean;
}

export class AnalyticsAgent {
  private agent?: AgentKit;
  private llm?: ChatOpenAI;
  private tools?: any[];
  private covalent: CovalentClient;
  private graph: GraphService;
  private initialized: Promise<void>;

  constructor() {
    this.covalent = new CovalentClient(config.covalent.apiKey);
    this.graph = new GraphService();
    this.initialized = this.initializeAgent();
  }

  private async initializeAgent() {
    try {
      console.log('Initializing with config:', {
        apiKeyName: config.agentKit.name,
        networkId: config.base.networkId,
        privateKeyLength: config.agentKit.privateKey?.length || 0
      });

      const walletProvider = await CdpWalletProvider.configureWithWallet({
        apiKeyName: config.agentKit.name,
        apiKeyPrivateKey: config.agentKit.privateKey,
        networkId: 'base-sepolia'
      });
      
      console.log('Wallet provider initialized');

      this.agent = await AgentKit.from({
        walletProvider,
        actionProviders: []
      });

      console.log('Agent initialized');

      this.llm = new ChatOpenAI({
        modelName: config.agentKit.model.model,
        temperature: 0.3,
        openAIApiKey: process.env.OPENAI_API_KEY
      });

      console.log('LLM initialized');

      // Initialize custom tools with correct Covalent API calls
      this.tools = [
        {
          name: 'getWalletBalances',
          description: 'Get token balances for a wallet address',
          func: async (address: string) => {
            const response = await this.covalent.BalanceService.getTokenBalancesForWalletAddress(
              'base-sepolia' as Chains,
              address
            );
            return response.data;
          }
        },
        {
          name: 'getTransactionHistory',
          description: 'Get transaction history for a wallet address',
          func: async (address: string) => {
            const response = await this.covalent.TransactionService.getTransactionsForAddressV3(
              'base-sepolia' as Chains,
              address,
              1 // page number
            );
            return response.data;
          }
        }
      ];

      console.log('Tools initialized');

    } catch (error) {
      console.error('Failed to initialize agent:', {
        error: error instanceof Error ? error.message : error,
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async analyzeWallet(address: string) {
    try {
      console.log("Received analysis request for address:", address);
      await this.initialized;
      
      if (!this.llm || !this.tools) {
        throw new Error('Agent not initialized');
      }

      const networkResults = await Promise.allSettled(
        SUPPORTED_NETWORKS.map(async (network) => {
          try {
            const [balances, transactions] = await Promise.all([
              this.covalent.BalanceService.getTokenBalancesForWalletAddress(
                network as Chains,
                address
              ),
              this.covalent.TransactionService.getTransactionsForAddressV3(
                network as Chains,
                address,
                1
              )
            ]);

            return {
              network,
              balances: balances.data,
              transactions: transactions.data,
              error: false
            };
          } catch (error) {
            console.error(`Error fetching data for ${network}:`, error);
            return {
              network,
              balances: { items: [] } as BalancesResponse,
              transactions: { items: [] } as TransactionsResponse,
              error: true
            };
          }
        })
      );

      const activeNetworks = networkResults
        .filter((result): result is PromiseFulfilledResult<NetworkResult> => 
          result.status === 'fulfilled')
        .map(result => result.value)
        .filter(data => !data.error && 
          (data.balances?.items?.length > 0 || data.transactions?.items?.length > 0));

      const analysisPrompt = `
        Analyze this wallet's activity across ${activeNetworks.length} networks:
        Address: ${address}

        ${activeNetworks.map(data => `
          Network: ${data.network}
          Balances: ${data.balances?.items?.length || 0} tokens
          Recent Transactions: ${data.transactions?.items?.length || 0} transactions
        `).join('\n')}

        Provide a focused analysis of:
        1. Active networks and their usage
        2. Main token holdings
        3. Recent transaction patterns
        4. Cross-chain activity patterns
      `.trim();

      const response = await this.llm.predict(analysisPrompt);

      // Format the response to match frontend expectations
      const formattedResponse = {
        analysis: response || '',
        tokenBalances: activeNetworks.flatMap(network => 
          network.balances?.items?.map(item => ({
            contract_name: item.contract_name || '',
            contract_ticker_symbol: item.contract_ticker_symbol || '',
            balance: item.balance || '0',
            quote: parseFloat(item.quote?.toString() || '0')
          })) || []
        ),
        recentTransactions: activeNetworks.flatMap(network => 
          network.transactions?.items?.map(tx => ({
            hash: tx.tx_hash || '',
            from_address: tx.from_address || '',
            to_address: tx.to_address || '',
            value: tx.value || '0',
            timestamp: tx.block_signed_at || ''
          })) || []
        ),
        protocolAnalytics: {
          networks: activeNetworks.map(network => ({
            name: network.network,
            balanceCount: network.balances?.items?.length || 0,
            transactionCount: network.transactions?.items?.length || 0
          }))
        }
      };

      console.log("Formatted response:", JSON.stringify(formattedResponse, null, 2));
      return formattedResponse;
    } catch (error) {
      console.error('Error in wallet analysis:', error);
      throw error;
    }
  }

  async analyze(prompt: string) {
    await this.initialized;
    
    if (!this.llm || !this.tools) {
      throw new Error('Agent not initialized');
    }
    try {
      // Extract wallet address if present in the prompt
      const addressMatch = prompt.match(/0x[a-fA-F0-9]{40}/);
      if (addressMatch) {
        return this.analyzeWallet(addressMatch[0]);
      }

      // General blockchain analysis
      const contextualPrompt = `
        You are a blockchain analytics agent on the Base network.
        Using Covalent data and The Graph insights, analyze: ${prompt}
      `;
      
      const response = await this.llm.predict(contextualPrompt, {
        tools: this.tools
      });
      return response;
    } catch (error) {
      console.error('Error in analysis:', error);
      throw error;
    }
  }
} 