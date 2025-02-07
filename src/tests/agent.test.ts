import { AnalyticsAgent } from '../agent/analytics.agent';

async function testAgent() {
    const agent = new AnalyticsAgent();
    
    // Test with a real address (e.g., Vitalik's address)
    const analysis = await agent.analyzeWallet('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
    console.log('Analysis results:', analysis);
}

testAgent().catch(console.error);