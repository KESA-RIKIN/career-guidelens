const mongoose = require('mongoose')

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['personality', 'domain', 'voice', 'tutorial'],
    required: true
  },
  questions: [{
    questionId: String,
    question: String,
    questionType: {
      type: String,
      enum: ['voice', 'multiple_choice', 'rating', 'text']
    },
    options: [String], // For multiple choice questions
    userAnswer: mongoose.Schema.Types.Mixed,
    audioRecording: {
      url: String,
      duration: Number,
      transcript: String
    },
    points: Number,
    timeSpent: Number // in seconds
  }],
  results: {
    overallScore: Number,
    domainScores: [{
      domain: String,
      score: Number,
      matchPercentage: Number,
      reasoning: String
    }],
    personalityTraits: [{
      trait: String,
      score: Number,
      description: String
    }],
    recommendations: [{
      domain: String,
      reason: String,
      confidence: Number,
      skills: [String]
    }],
    strengths: [String],
    areasForImprovement: [String]
  },
  metadata: {
    language: {
      type: String,
      default: 'en'
    },
    deviceInfo: {
      userAgent: String,
      platform: String
    },
    audioSettings: {
      noiseCancellation: Boolean,
      sampleRate: Number
    },
    duration: Number, // Total assessment duration in seconds
    retakeCount: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  completedAt: Date,
  aiAnalysis: {
    emotionalTone: String,
    confidenceLevel: Number,
    communicationStyle: String,
    personalityInsights: [String]
  }
}, {
  timestamps: true
})

// Index for efficient queries
assessmentSchema.index({ userId: 1, type: 1 })
assessmentSchema.index({ 'metadata.language': 1 })
assessmentSchema.index({ status: 1 })

// Calculate completion percentage
assessmentSchema.methods.getCompletionPercentage = function() {
  const totalQuestions = this.questions.length
  const answeredQuestions = this.questions.filter(q => q.userAnswer !== undefined && q.userAnswer !== null).length
  return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0
}

// Get assessment duration in minutes
assessmentSchema.methods.getDurationInMinutes = function() {
  return this.metadata.duration ? Math.round(this.metadata.duration / 60) : 0
}

// Check if assessment is complete
assessmentSchema.methods.isComplete = function() {
  return this.status === 'completed' && this.completedAt
}

// Get domain with highest score
assessmentSchema.methods.getTopDomain = function() {
  if (!this.results.domainScores || this.results.domainScores.length === 0) return null
  
  return this.results.domainScores.reduce((top, current) => 
    current.score > top.score ? current : top
  )
}

// Get personality insights summary
assessmentSchema.methods.getPersonalitySummary = function() {
  if (!this.results.personalityTraits || this.results.personalityTraits.length === 0) return []
  
  return this.results.personalityTraits
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(trait => ({
      name: trait.trait,
      score: trait.score,
      description: trait.description
    }))
}

module.exports = mongoose.model('Assessment', assessmentSchema)
