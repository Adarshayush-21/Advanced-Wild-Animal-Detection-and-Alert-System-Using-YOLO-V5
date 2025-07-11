'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon, X } from 'lucide-react'
import axios from 'axios'
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

export default function ImageUpload({ onResult, onProcessing }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const uploadImage = async () => {
    if (!selectedFile) return

    setUploading(true)
    onProcessing(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await axios.post('/api/detect/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      onResult(response.data)
    } catch (error) {
      console.error('Error uploading image:', error)
      onProcessing(false)
    } finally {
      setUploading(false)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreview(null)
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <motion.div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-primary-600">Drop the image here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">Drag & drop an image here, or click to select</p>
              <p className="text-sm text-gray-500">Supports: JPG, PNG, WebP (max 10MB)</p>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <button
              onClick={clearSelection}
              className="absolute top-2 right-2 bg-gray-900/70 hover:bg-gray-900/90 text-white rounded-full p-1 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ImageIcon className="h-4 w-4" />
              <span>{selectedFile?.name}</span>
              <span className="text-gray-400">
                ({(selectedFile?.size || 0 / 1024 / 1024).toFixed(1)} MB)
              </span>
            </div>
          </div>

          <motion.button
            onClick={uploadImage}
            disabled={uploading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl'
            } text-white`}
            whileHover={{ scale: uploading ? 1 : 1.02 }}
            whileTap={{ scale: uploading ? 1 : 0.98 }}
          >
            {uploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              'Detect Animals'
            )}
          </motion.button>
        </div>
      )}
    </div>
  )
}