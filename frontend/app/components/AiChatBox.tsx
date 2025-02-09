"use client"

import { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Card, CardHeader, CardContent } from './ui/card'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AiChatBoxProps {
  walletData: any
  walletAddress: string
}

export function AiChatBox({ walletData, walletAddress }: AiChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionError, setConnectionError] = useState(false)

  useEffect(() => {
    // Check if backend is running
    fetch('http://localhost:5002/health')
      .then(res => res.ok ? setConnectionError(false) : setConnectionError(true))
      .catch(() => setConnectionError(true))
  }, [])

  // Show connection error if backend is not reachable
  if (connectionError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <h3 className="text-lg font-semibold text-red-600">Connection Error</h3>
        </CardHeader>
        <CardContent>
          <p>Unable to connect to AI service. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    try {
      setIsLoading(true)
      setError(null)
      const userMessage = { role: 'user', content: input }
      setMessages(prev => [...prev, userMessage])
      setInput('')

      const response = await fetch('http://localhost:5002/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          walletAddress,
          walletData,
          history: messages
        })
      })

      if (!response.ok) {
        throw new Error('Failed to connect to AI service')
      }

      const data = await response.json()
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }])
    } catch (error) {
      console.error('Chat error:', error)
      setError('Failed to connect to AI service. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">AI Assistant</h3>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
            {error ? (
              <div className="text-red-500 text-center p-2 bg-red-50 rounded">
                {error}
              </div>
            ) : messages.length === 0 ? (
              <p className="text-gray-500 text-center">
                Ask me anything about this wallet's activity!
              </p>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-100 ml-auto max-w-[80%]' 
                      : 'bg-white border max-w-[80%]'
                  }`}
                >
                  {msg.content}
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              placeholder="Ask about this wallet's strategy..."
              className="flex-1 p-2 border rounded-lg"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 