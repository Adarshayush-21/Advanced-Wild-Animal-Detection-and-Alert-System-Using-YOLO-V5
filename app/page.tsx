'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, 
  Upload, 
  AlertTriangle, 
  Shield, 
  Users, 
  MapPin, 
  Clock,
  Zap,
  Eye,
  Smartphone
} from 'lucide-react'
import { toast } from 'sonner'
import ImageUpload from '../components/ImageUpload'
import WebcamCapture from '../components/WebcamCapture'
import DetectionResults from '../components/DetectionResults'
import AlertCard from '../components/AlertCard'

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

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'webcam'>('upload')
  const [detectionResult, setDetectionResult] = useState<DetectionResponse | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [alerts, setAlerts] = useState<Array<{id: string, animal: string, timestamp: string, location: string}>>([])

  const addAlert = useCallback((animal: string, location: string) => {
    const newAlert = {
      id: Date.now().toString(),
      animal,
      timestamp: new Date().toLocaleString(),
      location
    }
    setAlerts(prev => [newAlert, ...prev.slice(0, 4)]) // Keep only 5 latest alerts
    
    // Play alert sound
    if (typeof window !== 'undefined') {
      const audio = new Audio('/alert-sound.mp3')
      audio.play().catch(console.error)
    }
    
    toast.error(`🚨 Wild Animal Detected: ${animal}`, {
      description: `Location: ${location}`,
      duration: 10000,
    })
  }, [])

  const handleDetectionResult = useCallback((result: DetectionResponse) => {
    setDetectionResult(result)
    setIsProcessing(false)
    
    // Check for animal detections and trigger alerts
    if (result.detections.animals?.length > 0) {
      result.detections.animals.forEach(animal => {
        addAlert(animal.class, result.location)
      })
    }
  }, [addAlert])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-2 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  WildGuard
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Wildlife Protection</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>Real-time Detection</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4" />
                <span>Instant Alerts</span>
              </div>
              <div className="flex items-center space-x-1">
                <Smartphone className="h-4 w-4" />
                <span>Mobile Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Protect Communities with{' '}
            <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              AI Detection
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Advanced YOLO-powered system that detects wild animals in real-time, sending instant alerts to prevent human-animal conflicts in forest-adjacent areas.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-600">95%+</div>
              <div className="text-sm text-gray-600">Detection Accuracy</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">&lt;2s</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">24/7</div>
              <div className="text-sm text-gray-600">Monitoring</div>
            </div>
          </div>
        </motion.div>

        {/* Alert Cards */}
        {alerts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-danger-600 mr-2" />
              Recent Alerts
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card sticky top-24"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Detection Methods</h3>
              
              {/* Tab Selection */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                    activeTab === 'upload'
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-200'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span className="font-medium">Upload</span>
                </button>
                <button
                  onClick={() => setActiveTab('webcam')}
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                    activeTab === 'webcam'
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-200'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <span className="font-medium">Live Cam</span>
                </button>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'upload' ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <ImageUpload 
                      onResult={handleDetectionResult}
                      onProcessing={setIsProcessing}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="webcam"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <WebcamCapture 
                      onResult={handleDetectionResult}
                      onProcessing={setIsProcessing}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Info Panel */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">How it works</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Upload images or use live camera feed</li>
                  <li>• AI analyzes for wild animals and humans</li>
                  <li>• Instant email alerts for animal detection</li>
                  <li>• GPS location tracking for precise alerts</li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Detection Results</h3>
              
              {isProcessing ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Analyzing image with AI...</p>
                  </div>
                </div>
              ) : detectionResult ? (
                <DetectionResults result={detectionResult} />
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-8 w-8 text-gray-400" />
                  </div>
                  <p>Upload an image or start webcam to begin detection</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Community Safety</h4>
            <p className="text-gray-600 text-sm">Protect residents in forest-adjacent areas from dangerous wildlife encounters</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Location Tracking</h4>
            <p className="text-gray-600 text-sm">GPS-enabled alerts provide exact location data for quick response</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Real-time Response</h4>
            <p className="text-gray-600 text-sm">Instant email notifications and audio alerts for immediate action</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}