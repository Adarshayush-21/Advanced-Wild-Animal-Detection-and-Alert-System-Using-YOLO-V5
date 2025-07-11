'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, MapPin, Clock } from 'lucide-react'

interface Alert {
  id: string
  animal: string
  timestamp: string
  location: string
}

interface Props {
  alert: Alert
}

export default function AlertCard({ alert }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-red-50 border-2 border-red-200 rounded-lg p-4 shadow-lg"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="bg-red-500 rounded-full p-2">
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="text-red-900 font-semibold capitalize">
              {alert.animal} Detected
            </h4>
            <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full">
              ALERT
            </span>
          </div>
          
          <div className="space-y-1 text-sm text-red-800">
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{alert.timestamp}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{alert.location}</span>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-red-700 bg-red-100 rounded px-2 py-1">
            Email alert sent to authorities
          </div>
        </div>
      </div>
    </motion.div>
  )
}