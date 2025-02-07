import dotenv from 'dotenv';

dotenv.config();

export const config = {
  agentKit: {
    name: process.env.CDP_API_KEY_NAME,
    privateKey: process.env.CDP_API_KEY_PRIVATE_KEY,
    model: {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.7
    }
  },
  covalent: {
    apiKey: process.env.COVALENT_API_KEY
  },
  theGraph: {
    apiKey: process.env.GRAPH_API_KEY,
    endpoint: process.env.GRAPH_ENDPOINT
  },
  base: {
    networkId: process.env.NETWORK_ID || 'base-sepolia'
  }
};