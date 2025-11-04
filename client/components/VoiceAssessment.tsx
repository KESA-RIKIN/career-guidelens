'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  X, 
  Volume2,
  VolumeX,
  Settings,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface VoiceAssessmentProps {
  onClose: () => void
}

export default function VoiceAssessment({ onClose }: VoiceAssessmentProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [recordings, setRecordings] = useState<{ [key: number]: Blob }>({})
  const [showSettings, setShowSettings] = useState(false)
  const [noiseCancellation, setNoiseCancellation] = useState(true)
  const [language, setLanguage] = useState('en')
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const questions = [
    "Tell me about a time when you had to solve a complex problem. How did you approach it?",
    "What activities make you lose track of time? Describe your ideal day.",
    "If you could change one thing about the world, what would it be and why?",
    "Describe a situation where you had to work with people who had different opinions than you.",
    "What's something you've always wanted to learn or create?",
    "How do you handle failure or setbacks? Give me a specific example.",
    "What kind of environment helps you do your best work?",
    "If you had unlimited resources, what project would you start tomorrow?"
  ]

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: noiseCancellation,
          noiseSuppression: noiseCancellation,
          autoGainControl: true
        } 
      })
      
      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const audioChunks: BlobPart[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        setRecordings(prev => ({ ...prev, [currentQuestion]: audioBlob }))
        toast.success('Recording saved!')
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      toast.success('Recording started')
    } catch (error) {
      toast.error('Could not access microphone')
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      setIsRecording(false)
    }
  }

  const playRecording = () => {
    if (recordings[currentQuestion]) {
      const audioUrl = URL.createObjectURL(recordings[currentQuestion])
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const deleteRecording = () => {
    setRecordings(prev => {
      const newRecordings = { ...prev }
      delete newRecordings[currentQuestion]
      return newRecordings
    })
    setAnswers(prev => {
      const newAnswers = { ...prev }
      delete newAnswers[currentQuestion]
      return newAnswers
    })
    toast.success('Recording deleted')
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      toast.success('Assessment completed!')
      // Here you would typically send the data to your backend
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleTextEdit = (text: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: text }))
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Voice Assessment</h2>
              <p className="text-primary-100">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gray-50 p-4 border-b"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Noise Cancellation</label>
                  <button
                    onClick={() => setNoiseCancellation(!noiseCancellation)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      noiseCancellation ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {noiseCancellation ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    {noiseCancellation ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="p-6">
          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {questions[currentQuestion]}
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> Speak naturally and take your time. You can record multiple times 
                and edit your response before moving to the next question.
              </p>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
            
            {recordings[currentQuestion] && (
              <>
                <button
                  onClick={playRecording}
                  className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                
                <button
                  onClick={deleteRecording}
                  className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Text Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Edit your response (optional):</label>
            <textarea
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleTextEdit(e.target.value)}
              placeholder="You can type your answer here or edit the transcribed text from your recording..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentQuestion(0)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                title="Restart Assessment"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextQuestion}
                className="btn-primary flex items-center gap-2"
              >
                {currentQuestion === questions.length - 1 ? (
                  <>
                    <Check className="w-5 h-5" />
                    Complete
                  </>
                ) : (
                  'Next Question'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </motion.div>
    </motion.div>
  )
}
