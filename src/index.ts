// Import our AnalyticsAgent class from the agent folder
import { AnalyticsAgent } from './agent/analytics.agent';
// Import dotenv to handle environment variables
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Main async function that runs our agent
async function main() {
  try {
    const agent = new AnalyticsAgent();
    
    // Example wallet analysis
    const walletAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
    console.log(`Analyzing wallet: ${walletAddress}`);
    const result = await agent.analyzeWallet(walletAddress);
    console.log('Analysis result:', result);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function and catch any errors
main().catch(console.error);