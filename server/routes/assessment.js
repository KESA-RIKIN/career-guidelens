const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Assessment = require('../models/Assessment')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/audio'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `audio-${uniqueSuffix}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true)
    } else {
      cb(new Error('Only audio files are allowed'))
    }
  }
})

// Get assessment questions
router.get('/questions/:type', auth, async (req, res) => {
  try {
    const { type } = req.params
    const { language = 'en' } = req.query

    // Define questions based on type
    let questions = []

    if (type === 'personality') {
      questions = [
        {
          questionId: 'p1',
          question: 'Tell me about a time when you had to solve a complex problem. How did you approach it?',
          questionType: 'voice',
          points: 25
        },
        {
          questionId: 'p2',
          question: 'What activities make you lose track of time? Describe your ideal day.',
          questionType: 'voice',
          points: 25
        },
        {
          questionId: 'p3',
          question: 'If you could change one thing about the world, what would it be and why?',
          questionType: 'voice',
          points: 25
        },
        {
          questionId: 'p4',
          question: 'Describe a situation where you had to work with people who had different opinions than you.',
          questionType: 'voice',
          points: 25
        }
      ]
    } else if (type === 'domain') {
      questions = [
        {
          questionId: 'd1',
          question: 'Which of these activities interests you most?',
          questionType: 'multiple_choice',
          options: ['Building software', 'Designing products', 'Analyzing data', 'Leading teams'],
          points: 20
        },
        {
          questionId: 'd2',
          question: 'Rate your interest in technology (1-10)',
          questionType: 'rating',
          points: 20
        },
        {
          questionId: 'd3',
          question: 'Describe your ideal work environment',
          questionType: 'text',
          points: 30
        }
      ]
    } else if (type === 'tutorial') {
      questions = [
        {
          questionId: 't1',
          question: 'This is a sample question. Please speak your answer clearly.',
          questionType: 'voice',
          points: 10
        }
      ]
    }

    res.json({
      success: true,
      questions,
      metadata: {
        type,
        language,
        estimatedDuration: questions.length * 2 // minutes
      }
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch questions' })
  }
})

// Start new assessment
router.post('/start', auth, async (req, res) => {
  try {
    const { type, language = 'en' } = req.body

    // Check if user already has an incomplete assessment of this type
    const existingAssessment = await Assessment.findOne({
      userId: req.user.id,
      type,
      status: 'in_progress'
    })

    if (existingAssessment) {
      return res.json({
        success: true,
        assessment: existingAssessment,
        message: 'Resuming existing assessment'
      })
    }

    // Create new assessment
    const assessment = new Assessment({
      userId: req.user.id,
      type,
      metadata: {
        language,
        deviceInfo: {
          userAgent: req.get('User-Agent'),
          platform: req.get('X-Platform') || 'web'
        }
      }
    })

    await assessment.save()

    res.status(201).json({
      success: true,
      assessment,
      message: 'Assessment started successfully'
    })
  } catch (error) {
    console.error('Error starting assessment:', error)
    res.status(500).json({ success: false, message: 'Failed to start assessment' })
  }
})

// Submit answer for a question
router.post('/answer', auth, async (req, res) => {
  try {
    const { assessmentId, questionId, answer, audioFile } = req.body

    const assessment = await Assessment.findOne({
      _id: assessmentId,
      userId: req.user.id
    })

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' })
    }

    // Find and update the question
    const questionIndex = assessment.questions.findIndex(q => q.questionId === questionId)
    if (questionIndex === -1) {
      return res.status(404).json({ success: false, message: 'Question not found' })
    }

    assessment.questions[questionIndex].userAnswer = answer
    if (audioFile) {
      assessment.questions[questionIndex].audioRecording = {
        url: audioFile,
        duration: req.body.duration || 0,
        transcript: req.body.transcript || ''
      }
    }

    await assessment.save()

    res.json({
      success: true,
      message: 'Answer submitted successfully'
    })
  } catch (error) {
    console.error('Error submitting answer:', error)
    res.status(500).json({ success: false, message: 'Failed to submit answer' })
  }
})

// Upload audio file
router.post('/upload-audio', auth, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio file provided' })
    }

    const audioUrl = `/uploads/audio/${req.file.filename}`
    
    res.json({
      success: true,
      audioUrl,
      filename: req.file.filename,
      size: req.file.size
    })
  } catch (error) {
    console.error('Error uploading audio:', error)
    res.status(500).json({ success: false, message: 'Failed to upload audio file' })
  }
})

// Complete assessment
router.post('/complete', auth, async (req, res) => {
  try {
    const { assessmentId } = req.body

    const assessment = await Assessment.findOne({
      _id: assessmentId,
      userId: req.user.id
    })

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' })
    }

    // Calculate scores and generate results
    const results = await calculateAssessmentResults(assessment)
    assessment.results = results
    assessment.status = 'completed'
    assessment.completedAt = new Date()

    await assessment.save()

    // Update user's assessment data
    await updateUserAssessmentData(req.user.id, assessment)

    res.json({
      success: true,
      results,
      message: 'Assessment completed successfully'
    })
  } catch (error) {
    console.error('Error completing assessment:', error)
    res.status(500).json({ success: false, message: 'Failed to complete assessment' })
  }
})

// Get assessment results
router.get('/results/:assessmentId', auth, async (req, res) => {
  try {
    const { assessmentId } = req.params

    const assessment = await Assessment.findOne({
      _id: assessmentId,
      userId: req.user.id
    })

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' })
    }

    res.json({
      success: true,
      assessment
    })
  } catch (error) {
    console.error('Error fetching results:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch results' })
  }
})

// Get user's assessment history
router.get('/history', auth, async (req, res) => {
  try {
    const { type, limit = 10, page = 1 } = req.query

    const query = { userId: req.user.id }
    if (type) query.type = type

    const assessments = await Assessment.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-questions.userAnswer -questions.audioRecording')

    const total = await Assessment.countDocuments(query)

    res.json({
      success: true,
      assessments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Error fetching history:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch assessment history' })
  }
})

// Delete audio recording
router.delete('/recording/:recordingId', auth, async (req, res) => {
  try {
    const { recordingId } = req.params

    // Find and delete the recording
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const recordingIndex = user.recordings.findIndex(r => r._id.toString() === recordingId)
    if (recordingIndex === -1) {
      return res.status(404).json({ success: false, message: 'Recording not found' })
    }

    // Mark as deleted instead of actually deleting
    user.recordings[recordingIndex].deleted = true
    await user.save()

    res.json({
      success: true,
      message: 'Recording deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting recording:', error)
    res.status(500).json({ success: false, message: 'Failed to delete recording' })
  }
})

// Helper function to calculate assessment results
async function calculateAssessmentResults(assessment) {
  // This is a simplified version - in production, you'd use AI/ML models
  const results = {
    overallScore: 0,
    domainScores: [],
    personalityTraits: [],
    recommendations: [],
    strengths: [],
    areasForImprovement: []
  }

  // Calculate overall score based on answers
  let totalPoints = 0
  let earnedPoints = 0

  assessment.questions.forEach(question => {
    totalPoints += question.points || 0
    if (question.userAnswer) {
      earnedPoints += question.points || 0
    }
  })

  results.overallScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0

  // Generate domain scores (simplified)
  if (assessment.type === 'domain') {
    results.domainScores = [
      { domain: 'Technology', score: 85, matchPercentage: 85, reasoning: 'Strong interest in tech' },
      { domain: 'Business', score: 72, matchPercentage: 72, reasoning: 'Good business acumen' },
      { domain: 'Creative', score: 68, matchPercentage: 68, reasoning: 'Creative thinking abilities' }
    ]
  }

  // Generate personality traits
  if (assessment.type === 'personality') {
    results.personalityTraits = [
      { trait: 'Analytical', score: 85, description: 'Strong problem-solving abilities' },
      { trait: 'Creative', score: 78, description: 'Good creative thinking' },
      { trait: 'Leadership', score: 72, description: 'Natural leadership qualities' }
    ]
  }

  // Generate recommendations
  results.recommendations = [
    {
      domain: 'Software Development',
      reason: 'Strong analytical skills and interest in technology',
      confidence: 0.85,
      skills: ['Programming', 'Problem Solving', 'Logic']
    }
  ]

  return results
}

// Helper function to update user assessment data
async function updateUserAssessmentData(userId, assessment) {
  const user = await User.findById(userId)
  if (!user) return

  // Update assessment scores
  if (assessment.results.overallScore) {
    if (assessment.type === 'personality') {
      user.assessment.personalityScore = assessment.results.overallScore
    } else if (assessment.type === 'domain') {
      user.assessment.innovationScore = assessment.results.overallScore
    }
  }

  // Update domain scores
  if (assessment.results.domainScores) {
    user.assessment.domainScores = assessment.results.domainScores
  }

  // Mark assessment as completed
  if (!user.assessment.completedAssessments.includes(assessment.type)) {
    user.assessment.completedAssessments.push(assessment.type)
  }

  user.assessment.lastAssessmentDate = new Date()
  await user.save()
}

module.exports = router
