'use client'

import React, { useRef, useCallback, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import { Camera, CameraOff, Play, Square } from 'lucide-react'
import { motion } from 'framer-motion'

interface Detection {
  humans: Array<{
    class: string
    confidence: number
    bbox: number[]
  }>
  animals: Array<{
    class: string
    confidence: number
    bbox: number[]
  }>
  annotated_frame?: string
}

interface DetectionResponse {
  success: boolean
  detections: Detection
  location: string
  timestamp: string
}

interface Props {
  onResult: (result: DetectionResponse) => void
  onProcessing: (processing: boolean) => void
}

export default function WebcamCapture({ onResult, onProcessing }: Props) {
  const webcamRef = useRef<Webcam>(null)
  const [isActive, setIsActive] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  }

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/webcam')
    
    ws.onopen = () => {
      setIsConnected(true)
      setError(null)
    }
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      onResult(data)
      onProcessing(false)
    }
    
    ws.onclose = () => {
      setIsConnected(false)
    }
    
    ws.onerror = (error) => {
      setError('WebSocket connection failed')
      setIsConnected(false)
    }
    
    wsRef.current = ws
  }, [onResult, onProcessing])

  const captureAndSend = useCallback(() => {
    if (webcamRef.current && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        onProcessing(true)
        wsRef.current.send(JSON.stringify({ image: imageSrc }))
      }
    }
  }, [onProcessing])

  const startDetection = () => {
    setIsActive(true)
    connectWebSocket()
    
    // Start capturing frames every 2 seconds
    intervalRef.current = setInterval(captureAndSend, 2000)
  }

  const stopDetection = () => {
    setIsActive(false)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    setIsConnected(false)
    onProcessing(false)
  }

  useEffect(() => {
    return () => {
      stopDetection()
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full rounded-lg border-2 border-gray-200"
          onUserMediaError={() => setError('Camera access denied')}
        />
        
        {/* Status Indicator */}
        <div className="absolute top-2 left-2 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs bg-black/70 text-white px-2 py-1 rounded">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Recording Indicator */}
        {isActive && (
          <div className="absolute top-2 right-2 flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs bg-black/70 text-white px-2 py-1 rounded">
              LIVE
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {!isActive ? (
          <motion.button
            onClick={startDetection}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="h-4 w-4" />
            <span>Start Live Detection</span>
          </motion.button>
        ) : (
          <motion.button
            onClick={stopDetection}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Square className="h-4 w-4" />
            <span>Stop Detection</span>
          </motion.button>
        )}
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-2">Live Detection Features</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Real-time animal detection every 2 seconds</li>
          <li>• Instant email alerts for wild animals</li>
          <li>• Continuous monitoring capabilities</li>
          <li>• GPS location tracking with alerts</li>
        </ul>
      </div>
    </div>
  )
}