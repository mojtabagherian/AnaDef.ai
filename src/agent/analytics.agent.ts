import { AgentKit, CdpWalletProvider } from '@coinbase/agentkit';
import { getLangChainTools } from '@coinbase/agentkit-langchain';
import { ChatOpenAI } from '@langchain/openai';
import { CovalentClient, Chains } from '@covalenthq/client-sdk';
import { GraphService } from '../services/graph.service';
import { config } from '../config/agent.config';

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
    await this.initialized;
    
    if (!this.llm || !this.tools) {
      throw new Error('Agent not initialized');
    }

    try {
      // Get data from both Covalent and The Graph
      const [balances, transactions, graphData] = await Promise.all([
        this.tools[0].func(address),
        this.tools[1].func(address),
        this.graph.getWalletAnalytics(address)
      ]);

      // Create analysis prompt
      const analysisPrompt = `
        Analyze the following wallet data on Base Sepolia network:
        
        Address: ${address}
        
        Token Balances (Covalent): ${JSON.stringify(balances, null, 2)}
        Recent Transactions (Covalent): ${JSON.stringify(transactions, null, 2)}
        
        Protocol Analytics (The Graph): ${JSON.stringify(graphData, null, 2)}
        
        Provide a detailed analysis including:
        1. Total value held in tokens
        2. Most significant holdings
        3. Recent transaction patterns
        4. DeFi activities and protocol interactions
        5. Historical analytics trends
      `;

      const response = await this.llm.predict(analysisPrompt);
      return response;
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