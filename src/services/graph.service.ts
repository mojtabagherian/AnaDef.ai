import { request, gql } from 'graphql-request';
import { config } from '../config/agent.config';

export class GraphService {
  private endpoint: string;

  constructor() {
    this.endpoint = config.theGraph.endpoint;
  }

  async getWalletAnalytics(address: string) {
    const query = gql`
      query getWalletData($address: String!) {
        walletAnalyses(
          where: { wallet: $address }
          first: 5
          orderBy: timestamp
          orderDirection: desc
        ) {
          id
          wallet
          timestamp
          balances {
            id
          }
        }
        analyticsEvents(
          where: { user: $address }
          first: 5
          orderBy: timestamp
          orderDirection: desc
        ) {
          id
          user
          data
          timestamp
        }
      }
    `;

    try {
      const data = await request(this.endpoint, query, { address });
      return data;
    } catch (error) {
      console.error('Error fetching data from The Graph:', error);
      throw error;
    }
  }
} 