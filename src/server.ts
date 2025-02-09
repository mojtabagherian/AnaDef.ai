import cors from 'cors';
import express from 'express';

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/analyze', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const agent = new AnalyticsAgent();
    const result = await agent.analyzeWallet(walletAddress);
    
    console.log('Sending response:', JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error('Error in analyze endpoint:', error);
    res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
}); 