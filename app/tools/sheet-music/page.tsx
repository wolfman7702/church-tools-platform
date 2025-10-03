'use client'

import { useState } from 'react'
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import ImageUpload from '@/components/ImageUpload'
import OutputEditor from '@/components/OutputEditor'
import TransposeControls from '@/components/TransposeControls'
import UsageTracker from '@/components/UsageTracker'
import EmailGateModal from '@/components/EmailGateModal'
import UpgradeModal from '@/components/UpgradeModal'
import { UploadedFile, ProcessSheetResponse, TransposeResponse } from '@/lib/types'
import { canUserConvert, incrementConversionCount } from '@/lib/usage-tracking'

export default function SheetMusicPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [outputText, setOutputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const processImages = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one image')
      return
    }

    // Check if user can convert
    const { canConvert, needsEmail, isPro, conversionsUsed } = await canUserConvert()
    
    // If at limit and not pro, show upgrade modal
    if (!canConvert && !isPro) {
      setShowUpgradeModal(true)
      return
    }
    
    // If needs email (after 1st conversion), show email gate
    if (needsEmail && !isPro) {
      setShowEmailGate(true)
      return
    }

    setIsProcessing(true)
    setError('')
    setSuccess('')

    try {
      let combinedOutput = ''
      
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]
        
        // Convert file to base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file.file)
        })

        // Call API
        const response = await fetch('/api/process-sheet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64 }),
        })

        const result: ProcessSheetResponse = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to process image')
        }

        if (result.text) {
          combinedOutput += result.text
          if (i < uploadedFiles.length - 1) {
            combinedOutput += '\n\n---\n\n' // Page break between songs
          }
        }
      }

      setOutputText(combinedOutput)
      
      // After successful processing, increment count
      await incrementConversionCount()
      
      // Dispatch event to update usage tracker
      window.dispatchEvent(new Event('churchkit-usage-updated'))
      
      toast.success(`Successfully processed ${uploadedFiles.length} image${uploadedFiles.length > 1 ? 's' : ''}`)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTranspose = async (semitones: number) => {
    if (!outputText) return

    try {
      const response = await fetch('/api/transpose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: outputText, semitones }),
      })

      const result: TransposeResponse = await response.json()

      if (result.success && result.text) {
        setOutputText(result.text)
        toast.success(`Transposed by ${semitones > 0 ? '+' : ''}${semitones} semitones`)
      } else {
        const errorMessage = result.error || 'Failed to transpose'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (err) {
      const errorMessage = 'An error occurred while transposing'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const handleReset = () => {
    setOutputText('')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText)
      toast.success('Copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sheet Music Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload sheet music images and convert to Planning Center format with AI-powered accuracy
          </p>
        </div>

        {/* Usage Tracker */}
        <div className="max-w-2xl mx-auto mb-8">
          <UsageTracker />
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-400px)]">
          {/* Left Column - Upload */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upload Sheet Music
              </h2>
              <ImageUpload 
                onFilesChange={setUploadedFiles}
                maxFiles={5}
              />
              
              <button
                onClick={processImages}
                disabled={uploadedFiles.length === 0 || isProcessing}
                className="w-full mt-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Process Images
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6 flex flex-col">
            <div className="card p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Planning Center Output
                </h2>
                {outputText && (
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Copy to Clipboard
                  </button>
                )}
              </div>
              
              <div className="flex-1 flex flex-col">
                <OutputEditor
                  value={outputText}
                  onChange={setOutputText}
                  placeholder="Your converted sheet music will appear here..."
                  className="flex-1"
                />
              </div>
            </div>

            {/* Transpose Controls */}
            {outputText && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Transpose
                </h3>
                <TransposeControls
                  text={outputText}
                  onTranspose={handleTranspose}
                  onReset={handleReset}
                />
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              How it works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Upload Images</h4>
                <p className="text-sm text-gray-600">
                  Upload clear photos or scans of your sheet music (JPG, PNG, PDF)
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Processing</h4>
                <p className="text-sm text-gray-600">
                  Our AI analyzes the sheet music and extracts chords and lyrics
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Get Results</h4>
                <p className="text-sm text-gray-600">
                  Receive formatted text ready for Planning Center Services
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <EmailGateModal
          isOpen={showEmailGate}
          onClose={() => setShowEmailGate(false)}
          onEmailSubmit={(email) => {
            setUserEmail(email)
            setShowEmailGate(false)
            // After email is submitted, allow them to process
            processImages()
          }}
        />

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          conversionsUsed={3}
        />
      </div>
    </div>
  )
}
