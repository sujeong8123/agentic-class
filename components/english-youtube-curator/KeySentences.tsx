'use client'

import { useState, useCallback } from 'react'

interface KeySentencesProps {
  sentences: string[]
}

export function KeySentences({ sentences }: KeySentencesProps) {
  const [speaking, setSpeaking] = useState<number | null>(null)

  const speak = useCallback((sentence: string, index: number) => {
    window.speechSynthesis.cancel()

    if (speaking === index) {
      setSpeaking(null)
      return
    }

    const utterance = new SpeechSynthesisUtterance(sentence)
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    utterance.onstart = () => setSpeaking(index)
    utterance.onend = () => setSpeaking(null)
    utterance.onerror = () => setSpeaking(null)
    window.speechSynthesis.speak(utterance)
  }, [speaking])

  if (sentences.length === 0) return null

  return (
    <div className="rounded-lg border bg-card p-4 space-y-2">
      <h2 className="text-sm font-semibold text-muted-foreground">이건 기억해보자~ 😊</h2>
      <ul className="space-y-2">
        {sentences.map((sentence, i) => (
          <li key={i} className="flex items-start gap-3">
            <button
              onClick={() => speak(sentence, i)}
              className="mt-0.5 shrink-0 text-lg leading-none transition-transform active:scale-90"
              aria-label={speaking === i ? '중지' : '따라 읽기'}
              title={speaking === i ? '중지' : '따라 읽기'}
            >
              {speaking === i ? '⏹️' : '🔊'}
            </button>
            <span className="text-sm leading-relaxed">{sentence}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
