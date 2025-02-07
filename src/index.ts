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
    const result = await agent.analyze("Your prompt here");
    console.log('Analysis result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function and catch any errors
main().catch(console.error);