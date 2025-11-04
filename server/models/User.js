const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    phone: {
      type: String
    },
    location: {
      country: String,
      state: String,
      city: String
    },
    preferredLanguage: {
      type: String,
      default: 'en'
    },
    profilePicture: {
      type: String
    }
  },
  assessment: {
    personalityScore: {
      type: Number,
      default: 0
    },
    innovationScore: {
      type: Number,
      default: 0
    },
    domainScores: [{
      domain: String,
      score: Number,
      matchPercentage: Number
    }],
    completedAssessments: [{
      type: String,
      enum: ['personality', 'domain', 'voice']
    }],
    lastAssessmentDate: {
      type: Date
    }
  },
  journey: {
    currentStage: {
      type: String,
      enum: ['curiosity', 'learning', 'skill', 'innovation', 'impact'],
      default: 'curiosity'
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    completedTasks: [{
      taskId: String,
      completedAt: Date,
      points: Number
    }],
    achievements: [{
      achievementId: String,
      earnedAt: Date,
      title: String,
      description: String
    }]
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      shareData: {
        type: Boolean,
        default: false
      },
      publicProfile: {
        type: Boolean,
        default: false
      }
    }
  },
  recordings: [{
    questionId: String,
    audioUrl: String,
    transcript: String,
    createdAt: Date,
    deleted: {
      type: Boolean,
      default: false
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date()
  return this.save()
}

// Get user's innovation score
userSchema.methods.getInnovationScore = function() {
  return this.assessment.innovationScore
}

// Add points to user
userSchema.methods.addPoints = function(points, taskId) {
  this.journey.totalPoints += points
  this.journey.completedTasks.push({
    taskId,
    completedAt: new Date(),
    points
  })
  return this.save()
}

// Check if user has completed a task
userSchema.methods.hasCompletedTask = function(taskId) {
  return this.journey.completedTasks.some(task => task.taskId === taskId)
}

// Get user's progress percentage
userSchema.methods.getProgressPercentage = function() {
  const totalPossiblePoints = 5000 // Total points possible in journey
  return Math.min((this.journey.totalPoints / totalPossiblePoints) * 100, 100)
}

module.exports = mongoose.model('User', userSchema)
