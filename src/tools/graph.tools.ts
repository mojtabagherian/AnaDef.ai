import { request, gql } from 'graphql-request';
import { config } from '../config/agent.config';

export class GraphTools {
  private endpoint: string;

  constructor(subgraphUrl: string) {
    if (!subgraphUrl) {
      throw new Error('Subgraph URL is required');
    }
    this.endpoint = subgraphUrl;
  }

  async queryProtocolData(query: string, variables: any = {}) {
    try {
      const data = await request(this.endpoint, query, variables);
      return data;
    } catch (error) {
      console.error('Error querying The Graph:', error);
      throw error;
    }
  }

  async getProtocolMetrics() {
    const query = gql`
      query GetProtocolMetrics {
        protocol(id: "example-protocol") {
          totalValueLocked
          totalVolume
          userCount
        }
      }
    `;
    return this.queryProtocolData(query);
  }
}

// Tool wrapper
export class ProtocolDataTool {
    private tools: GraphTools;
    
    constructor() {
        if (!config.theGraph.endpoint) {
            throw new Error('Graph endpoint is required');
        }
        this.tools = new GraphTools(config.theGraph.endpoint);
    }

    name = 'protocol_data';
    description = 'Get specific protocol data from The Graph';

    async execute(protocolId: string) {
        return await this.tools.getProtocolMetrics();
    }
}