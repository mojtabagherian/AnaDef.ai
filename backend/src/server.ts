import express from 'express'
import cors from 'cors'
import { analyzeWallet } from './services/wallet'
import { generateChatResponse } from './services/chat'
import dotenv from 'dotenv'
import path from 'path'

// Load .env file from backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const port = process.env.PORT || 5002

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}))
app.use(express.json())

app.post("/analyze", async (req, res) => {
  try {
    const { walletAddress, network } = req.body
    
    // Log incoming request
    console.log("Received request:", { walletAddress, network })

    // Your analysis logic here
    const result = await analyzeWallet(walletAddress, network)
    
    // Log outgoing response
    console.log("Sending response:", result)

    res.json(result)
  } catch (error) {
    console.error("Analysis error:", error)
    res.status(500).json({ 
      error: "Failed to analyze wallet",
      details: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

app.post("/chat", async (req, res) => {
  try {
    const { message, walletAddress, walletData, history } = req.body
    const response = await generateChatResponse(message, walletData, history)
    res.json({ response })
  } catch (error) {
    console.error("Chat error:", error)
    res.status(500).json({ error: "Failed to process chat" })
  }
})

// Add health check endpoint
app.get("/health", (_, res) => {
  res.json({ status: "ok" })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
}) 