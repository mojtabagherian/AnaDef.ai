import { AgentKit, CdpWalletProvider } from '@coinbase/agentkit';
import { getLangChainTools } from '@coinbase/agentkit-langchain';
import { ChatOpenAI } from '@langchain/openai';
import { config } from '../config/agent.config';

export class AnalyticsAgent {
  private agent?: AgentKit;
  private llm?: ChatOpenAI;
  private tools?: any[];
  private initialized: Promise<void>;

  constructor() {
    this.initialized = this.initializeAgent();
  }

  private async initializeAgent() {
    try {
      const walletProvider = await CdpWalletProvider.configureWithWallet({
        apiKeyName: config.agentKit.name,
        apiKeyPrivateKey: config.agentKit.privateKey,
        networkId: config.base.networkId || 'base-sepolia'
      });
      
      this.agent = await AgentKit.from({
        walletProvider,
        actionProviders: []
      });

      // Initialize LangChain components
      this.llm = new ChatOpenAI({
        modelName: config.agentKit.model.model,
        temperature: config.agentKit.model.temperature
      });

      this.tools = await getLangChainTools(this.agent);

    } catch (error) {
      console.error('Failed to initialize agent:', error);
      throw error;
    }
  }

  async analyze(prompt: string) {
    await this.initialized; // Wait for initialization to complete
    
    if (!this.llm || !this.tools) {
      throw new Error('Agent not initialized');
    }
    try {
      const response = await this.llm.predict(prompt, {
        tools: this.tools
      });
      return response;
    } catch (error) {
      console.error('Error in analysis:', error);
      throw error;
    }
  }
} 