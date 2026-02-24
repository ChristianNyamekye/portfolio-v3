'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Trash2, Bot } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <span className="text-xs text-muted mr-1.5">Thinking</span>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-accent"
          animate={{ 
            y: [0, -6, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi! I'm Christian's AI Assistant. Ask me anything about his projects, experience, or background.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (open) {
      scrollToBottom()
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open, scrollToBottom])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: data.reply,
          },
        ])
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }, [input, loading])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content:
          "Chat cleared! Ask me anything about Christian's projects, experience, or background.",
      },
    ])
    setError(null)
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            aria-label="Open AI Assistant"
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-surface-2 border border-border hover:border-accent/50 text-muted hover:text-accent flex items-center justify-center shadow-xl shadow-black/20 transition-all duration-300 group"
          >
            <Bot size={20} className="transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent/80 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col"
            style={{ width: 'min(400px, calc(100vw - 24px))', height: 'min(520px, calc(100vh - 100px))' }}
          >
            <div className="flex flex-col h-full rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-2 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text leading-tight">AI Assistant</p>
                    <p className="text-[11px] text-muted leading-tight">Ask about Christian&apos;s work</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={clearChat}
                    aria-label="Clear chat"
                    className="p-2 rounded-lg text-subtle hover:text-muted hover:bg-surface transition-colors duration-150"
                    title="Clear chat"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close AI Assistant"
                    className="p-2 rounded-lg text-subtle hover:text-muted hover:bg-surface transition-colors duration-150"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-3 scrollbar-thin">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                        <MessageSquare size={11} className="text-accent" />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words overflow-hidden ${
                        msg.role === 'user'
                          ? 'bg-accent text-white rounded-br-sm'
                          : 'bg-surface-2 text-text-dim border border-border rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="w-6 h-6 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                      <MessageSquare size={11} className="text-accent" />
                    </div>
                    <div className="bg-surface-2 border border-border rounded-2xl rounded-bl-sm">
                      <TypingIndicator />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex justify-center">
                    <p className="text-xs text-red-400/80 bg-red-400/5 border border-red-400/20 rounded-lg px-3 py-2 max-w-[90%] text-center">
                      {error}
                    </p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="border-t border-border bg-surface-2 p-3 shrink-0">
                <div className="flex items-end gap-2 bg-surface border border-border rounded-xl px-3 py-2 focus-within:border-accent/50 transition-colors duration-200">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      // Auto-resize
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about Christian's projects…"
                    rows={1}
                    maxLength={500}
                    disabled={loading}
                    className="flex-1 bg-transparent text-text text-sm placeholder:text-subtle resize-none outline-none min-h-[24px] max-h-[100px] leading-relaxed py-0.5 disabled:opacity-50"
                    style={{ height: '24px' }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    aria-label="Send message"
                    className="shrink-0 w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center hover:bg-accent-dim transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send size={13} />
                  </button>
                </div>
                <p className="text-[10px] text-subtle mt-1.5 text-center">
                  Answers about Christian&apos;s work only · {input.length}/500
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

