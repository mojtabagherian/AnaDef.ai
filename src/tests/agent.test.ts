import { AnalyticsAgent } from '../agent/analytics.agent';
import { config } from '../config/agent.config';

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.CDP_API_KEY_NAME = 'test-cdp-name';
process.env.CDP_API_KEY_PRIVATE_KEY = 'test-cdp-key';

// Mock dependencies with required methods
jest.mock('@coinbase/agentkit', () => ({
  AgentKit: {
    from: jest.fn().mockResolvedValue({
      // Add the missing getActions method
      getActions: jest.fn().mockResolvedValue([]),
      run: jest.fn().mockResolvedValue({ output: 'Test response' })
    })
  },
  CdpWalletProvider: {
    configureWithWallet: jest.fn().mockResolvedValue({})
  }
}));

// Mock LangChain tools
jest.mock('@coinbase/agentkit-langchain', () => ({
  getLangChainTools: jest.fn().mockResolvedValue([
    // Mock tools array
    { name: 'test-tool', func: jest.fn() }
  ])
}));

jest.mock('@langchain/openai', () => ({
  ChatOpenAI: jest.fn().mockImplementation(() => ({
    predict: jest.fn().mockResolvedValue('Test response')
  }))
}));

describe('AnalyticsAgent', () => {
  let agent: AnalyticsAgent;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    agent = new AnalyticsAgent();
  });

  it('should initialize successfully', async () => {
    expect(agent).toBeDefined();
    // Wait for initialization to complete
    await (agent as any).initialized;
  });

  it('should analyze text successfully', async () => {
    // Wait for initialization first
    await (agent as any).initialized;
    const result = await agent.analyze('Test prompt');
    expect(result).toBe('Test response');
  });

  it('should handle errors during analysis', async () => {
    // Mock error case
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Test error');
    
    const failingAgent = new AnalyticsAgent();
    await (failingAgent as any).initialized;
    
    // Force the LLM to throw an error
    (failingAgent as any).llm = {
      predict: jest.fn().mockRejectedValue(mockError)
    };

    await expect(failingAgent.analyze('Test prompt')).rejects.toThrow();
  });
});