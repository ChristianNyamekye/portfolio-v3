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
      <span className="text-xs text-[var(--muted)] mr-1.5">Thinking</span>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
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
      content: "Hi! I'm Christian's AI assistant. Ask me anything about his projects, experience, or background.",
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

  useEffect(() => { scrollToBottom() }, [messages, loading, scrollToBottom])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', content: text }])
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
        setError(data.error || 'Something went wrong.')
      } else {
        setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: data.reply }])
      }
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }, [input, loading])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const clearChat = () => {
    setMessages([{ id: 'welcome-reset', role: 'assistant', content: "Chat cleared! Ask me anything about Christian's work." }])
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
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--muted)] hover:text-[var(--accent)] flex items-center justify-center shadow-lg transition-all duration-300 group"
          >
            <Bot size={18} className="transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse" />
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
            style={{ width: 'min(380px, calc(100vw - 24px))', height: 'min(480px, calc(100vh - 100px))' }}
          >
            <div className="flex flex-col h-full rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)] leading-tight">AI Assistant</p>
                    <p className="text-[10px] text-[var(--muted)] leading-tight">Ask about Christian&apos;s work</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={clearChat} aria-label="Clear chat" className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] transition-colors" title="Clear chat">
                    <Trash2 size={13} />
                  </button>
                  <button onClick={() => setOpen(false)} aria-label="Close" className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] transition-colors">
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-3 px-3 space-y-3 scrollbar-thin">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-5 h-5 rounded bg-[var(--accent)]/10 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                        <MessageSquare size={10} className="text-[var(--accent)]" />
                      </div>
                    )}
                    <div className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words overflow-hidden ${
                      msg.role === 'user'
                        ? 'bg-[var(--accent)] text-white rounded-br-sm'
                        : 'bg-[var(--surface)] text-[var(--dim)] border border-[var(--border)] rounded-bl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="w-5 h-5 rounded bg-[var(--accent)]/10 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                      <MessageSquare size={10} className="text-[var(--accent)]" />
                    </div>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl rounded-bl-sm">
                      <TypingIndicator />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex justify-center">
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 max-w-[90%] text-center">{error}</p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-[var(--border)] bg-[var(--surface)] p-3 shrink-0">
                <div className="flex items-end gap-2 bg-[var(--background)] border border-[var(--border)] rounded-xl px-3 py-2 focus-within:border-[var(--accent)] transition-colors duration-200">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about Christian's projects…"
                    rows={1}
                    maxLength={500}
                    disabled={loading}
                    className="flex-1 bg-transparent text-[var(--text)] text-sm placeholder:text-[var(--muted)] resize-none outline-none min-h-[24px] max-h-[100px] leading-relaxed py-0.5 disabled:opacity-50"
                    style={{ height: '24px' }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    aria-label="Send"
                    className="shrink-0 w-7 h-7 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send size={13} />
                  </button>
                </div>
                <p className="text-[10px] text-[var(--muted)] mt-1 text-center">{input.length}/500</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
