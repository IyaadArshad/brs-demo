'use client'

import { useState, useCallback } from 'react'
import { Upload } from 'lucide-react'

export default function FuturisticUpload() {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    // Handle file drop here
    const files = Array.from(e.dataTransfer.files)
    console.log('Dropped files:', files)
    // You can add your file handling logic here
  }, [])

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center p-4">
      <div
        className={`w-full max-w-4xl aspect-video border border-gray-800 rounded-2xl flex flex-col items-center justify-center transition-all ${
          isDragging ? 'bg-gray-900 scale-105' : 'bg-gray-950'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="hidden"
          id="fileInput"
          onChange={(e) => {
            const files = Array.from(e.target.files || [])
            console.log('Selected files:', files)
            // You can add your file handling logic here
          }}
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer flex flex-col items-center"
        >
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl transform rotate-6 group-hover:rotate-12 transition-transform"></div>
            <div className="relative bg-black p-6 rounded-xl border border-gray-800">
              <Upload className="w-16 h-16 text-gray-300" />
            </div>
          </div>
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Drop your file here
          </p>
          <p className="text-sm text-gray-400 mb-4">
            or click to upload
          </p>
          <div className="text-xs bg-white font-bold text-gray-600 bg-gray-900 px-3 py-1 rounded-full">
            Supports any file type
          </div>
        </label>
      </div>
    </div>
  )
}

