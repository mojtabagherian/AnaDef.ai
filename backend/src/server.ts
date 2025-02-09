import express from 'express'
import cors from 'cors'
import { analyzeWallet } from './services/wallet'

const app = express()
const port = process.env.PORT || 5002

app.use(cors({
  origin: 'http://localhost:3000'
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
}) 