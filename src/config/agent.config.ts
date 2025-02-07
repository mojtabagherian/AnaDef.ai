import dotenv from 'dotenv';

dotenv.config();

// Helper function to clean private key
function cleanPrivateKey(key: string | undefined): string {
  if (!key) return '';
  // Remove any quotes and normalize newlines
  return key.replace(/["']/g, '').replace(/\\n/g, '\n');
}

export const config = {
  agentKit: {
    name: process.env.CDP_API_KEY_NAME?.trim(),
    privateKey: cleanPrivateKey(process.env.CDP_API_KEY_PRIVATE_KEY),
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
    networkId: 'base-sepolia', // Hardcode for now
    rpcUrl: 'https://sepolia.base.org'
  }
};