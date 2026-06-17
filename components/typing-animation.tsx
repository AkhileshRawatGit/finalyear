"use client"

import { useEffect, useState, useRef } from "react"

interface TypingAnimationProps {
  text: string
  speed?: number
  className?: string
  restartInterval?: number
}

export function TypingAnimation({ text, speed = 50, className = "", restartInterval = 4000 }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const restartIntervalRef = useRef(restartInterval)

  // Update ref when prop changes
  useEffect(() => {
    restartIntervalRef.current = restartInterval
  }, [restartInterval])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else {
      // Animation completed, restart after restartInterval
      const restartTimer = setTimeout(() => {
        setDisplayedText("")
        setCurrentIndex(0)
      }, restartIntervalRef.current)
      return () => clearTimeout(restartTimer)
    }
  }, [currentIndex, text, speed])

  // Split text for color rendering
  const renderColoredText = (text: string) => {
    const commaIndex = text.indexOf(", ")
    if (commaIndex !== -1) {
      const firstPart = text.substring(0, commaIndex + 1) // "Find Medicines Near You,"
      const secondPart = text.substring(commaIndex + 2) // "Instantly" (skip ", ")
      const firstPartLength = firstPart.length
      
      if (displayedText.length <= firstPartLength) {
        return (
          <>
            <span className="text-primary">{displayedText}</span>
            {currentIndex < text.length && <span className="animate-pulse text-primary">|</span>}
          </>
        )
      } else {
        const secondPartDisplayed = displayedText.substring(firstPartLength + 1) // +1 for space after comma
        return (
          <>
            <span className="text-primary">{firstPart}</span>
            <br />
            <span className="text-green-600">{secondPartDisplayed}</span>
            {currentIndex < text.length && <span className="animate-pulse text-green-600">|</span>}
          </>
        )
      }
    }
    return (
      <>
        <span className={className}>{displayedText}</span>
        {currentIndex < text.length && <span className="animate-pulse">|</span>}
      </>
    )
  }

  return <>{renderColoredText(text)}</>
}
