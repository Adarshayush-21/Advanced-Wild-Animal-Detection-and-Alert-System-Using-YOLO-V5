'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { User, AlertTriangle, MapPin, Clock, CheckCircle } from 'lucide-react'

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
  result: DetectionResponse
}

export default function DetectionResults({ result }: Props) {
  const { detections, location, timestamp } = result
  const hasAnimals = detections.animals.length > 0
  const hasHumans = detections.humans.length > 0

  return (
    <div className="space-y-6">
      {/* Main Image with Detections */}
      {detections.annotated_frame && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <img
            src={detections.annotated_frame}
            alt="Detection Results"
            className="w-full rounded-lg border-2 border-gray-200 shadow-lg"
          />
          
          {/* Detection Count Overlay */}
          <div className="absolute top-4 left-4 space-y-2">
            {hasHumans && (
              <div className="bg-blue-500/90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{detections.humans.length} Human{detections.humans.length > 1 ? 's' : ''}</span>
              </div>
            )}
            {hasAnimals && (
              <div className="bg-red-500/90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 animate-pulse">
                <AlertTriangle className="h-4 w-4" />
                <span>{detections.animals.length} Animal{detections.animals.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Detection Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Human Detection Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-4 rounded-lg border-2 ${
            hasHumans
              ? 'bg-blue-50 border-blue-200'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <User className={`h-5 w-5 ${hasHumans ? 'text-blue-600' : 'text-gray-400'}`} />
            <h3 className={`font-semibold ${hasHumans ? 'text-blue-900' : 'text-gray-600'}`}>
              Human Detection
            </h3>
          </div>
          
          {hasHumans ? (
            <div className="space-y-2">
              {detections.humans.map((human, index) => (
                <div key={index} className="bg-white p-2 rounded border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Human</span>
                    <span className="text-sm text-blue-600">{human.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No humans detected</p>
          )}
        </motion.div>

        {/* Animal Detection Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-4 rounded-lg border-2 ${
            hasAnimals
              ? 'bg-red-50 border-red-200'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <AlertTriangle className={`h-5 w-5 ${hasAnimals ? 'text-red-600' : 'text-gray-400'}`} />
            <h3 className={`font-semibold ${hasAnimals ? 'text-red-900' : 'text-gray-600'}`}>
              Wild Animal Detection
            </h3>
          </div>
          
          {hasAnimals ? (
            <div className="space-y-2">
              {detections.animals.map((animal, index) => (
                <div key={index} className="bg-white p-2 rounded border border-red-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{animal.class}</span>
                    <span className="text-sm text-red-600 font-semibold">{animal.confidence}%</span>
                  </div>
                </div>
              ))}
              <div className="mt-3 p-2 bg-red-100 rounded border border-red-300">
                <div className="flex items-center space-x-2 text-red-800 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Alert sent to authorities!</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm text-gray-600">No wild animals detected</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Metadata */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 rounded-lg p-4 border"
      >
        <h4 className="font-semibold text-gray-900 mb-3">Detection Metadata</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Timestamp:</span>
            <span className="font-medium">{new Date(timestamp).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{location}</span>
          </div>
        </div>
      </motion.div>

      {/* Safety Recommendations */}
      {hasAnimals && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4"
        >
          <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Safety Recommendations
          </h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Keep a safe distance from the detected animal</li>
            <li>• Do not attempt to approach or feed the animal</li>
            <li>• Alert local wildlife authorities immediately</li>
            <li>• Move to a secure location if possible</li>
            <li>• Monitor the area and avoid until cleared</li>
          </ul>
        </motion.div>
      )}
    </div>
  )
}