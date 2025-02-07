import dotenv from 'dotenv';

dotenv.config();

export const config = {
  agentKit: {
    name: "organizations/fef69e6b-d1f8-4cc8-893d-d53efdb4d21a/apiKeys/eae280b7-b79e-4a79-9e7a-5514b9ad5a77",
    privateKey: "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIBViSYmS2H6CnvZ6R+5r1Z8dPxLPGhl1a1VIQ6MxrbmuoAoGCCqGSM49\nAwEHoUQDQgAEploGLXZyWbuLTgOM0+AWGYq49vjjrKHOz55gljb5IC+Di+vT+N7B\nnvFiwymuenmFrKooNrlkZsC4OELW1FdPmw==\n-----END EC PRIVATE KEY-----\n",
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