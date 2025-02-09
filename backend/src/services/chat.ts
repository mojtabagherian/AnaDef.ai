import OpenAI from 'openai'
import dotenv from 'dotenv'
import path from 'path'

// Ensure environment variables are loaded
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateChatResponse(message: string, walletData: any, history: any[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a DeFi analytics assistant analyzing wallet data. 
                   Current wallet data: ${JSON.stringify(walletData, null, 2)}`
        },
        ...history,
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    return completion.choices[0].message.content || "I couldn't analyze that. Please try again."
  } catch (error) {
    console.error('Chat generation error:', error)
    throw error
  }
} 