const express = require('express')
const User = require('../models/User')
const Assessment = require('../models/Assessment')
const auth = require('../middleware/auth')

const router = express.Router()

// Get user's innovation score
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const innovationScore = user.getInnovationScore()
    const progressPercentage = user.getProgressPercentage()

    res.json({
      success: true,
      score: {
        innovationScore,
        progressPercentage,
        totalPoints: user.journey.totalPoints,
        currentStage: user.journey.currentStage,
        completedTasks: user.journey.completedTasks.length,
        achievements: user.journey.achievements.length
      }
    })
  } catch (error) {
    console.error('Get score error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get innovation score'
    })
  }
})

// Get score history
router.get('/history', auth, async (req, res) => {
  try {
    const { period = '6months' } = req.query

    // Calculate date range
    const now = new Date()
    let startDate
    switch (period) {
      case '1month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        break
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
        break
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
    }

    // Get assessments from the specified period
    const assessments = await Assessment.find({
      userId: req.user._id,
      status: 'completed',
      completedAt: { $gte: startDate }
    }).sort({ completedAt: 1 })

    // Generate score history data
    const scoreHistory = assessments.map(assessment => ({
      date: assessment.completedAt,
      score: assessment.results.overallScore,
      type: assessment.type,
      points: assessment.questions.reduce((sum, q) => sum + (q.points || 0), 0)
    }))

    res.json({
      success: true,
      scoreHistory,
      period,
      totalAssessments: assessments.length
    })
  } catch (error) {
    console.error('Get score history error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get score history'
    })
  }
})

// Get score breakdown
router.get('/breakdown', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Get latest assessment for detailed breakdown
    const latestAssessment = await Assessment.findOne({
      userId: req.user._id,
      status: 'completed'
    }).sort({ completedAt: -1 })

    const breakdown = {
      overall: user.assessment.innovationScore,
      personality: user.assessment.personalityScore,
      domains: user.assessment.domainScores,
      journey: {
        currentStage: user.journey.currentStage,
        totalPoints: user.journey.totalPoints,
        completedTasks: user.journey.completedTasks.length,
        achievements: user.journey.achievements.length
      }
    }

    if (latestAssessment && latestAssessment.results) {
      breakdown.detailed = {
        personalityTraits: latestAssessment.results.personalityTraits || [],
        domainScores: latestAssessment.results.domainScores || [],
        strengths: latestAssessment.results.strengths || [],
        areasForImprovement: latestAssessment.results.areasForImprovement || []
      }
    }

    res.json({
      success: true,
      breakdown
    })
  } catch (error) {
    console.error('Get score breakdown error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get score breakdown'
    })
  }
})

// Update score (for testing purposes)
router.put('/update', auth, async (req, res) => {
  try {
    const { innovationScore, personalityScore } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (innovationScore !== undefined) {
      user.assessment.innovationScore = innovationScore
    }
    if (personalityScore !== undefined) {
      user.assessment.personalityScore = personalityScore
    }

    await user.save()

    res.json({
      success: true,
      message: 'Score updated successfully',
      score: {
        innovationScore: user.assessment.innovationScore,
        personalityScore: user.assessment.personalityScore
      }
    })
  } catch (error) {
    console.error('Update score error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update score'
    })
  }
})

// Get score recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Get latest assessment for recommendations
    const latestAssessment = await Assessment.findOne({
      userId: req.user._id,
      status: 'completed'
    }).sort({ completedAt: -1 })

    const recommendations = []

    if (latestAssessment && latestAssessment.results.recommendations) {
      recommendations.push(...latestAssessment.results.recommendations)
    } else {
      // Default recommendations based on current score
      const score = user.assessment.innovationScore
      if (score >= 80) {
        recommendations.push({
          domain: 'Leadership & Management',
          reason: 'High innovation score indicates strong leadership potential',
          confidence: 0.9,
          skills: ['Strategic Thinking', 'Team Leadership', 'Innovation Management']
        })
      } else if (score >= 60) {
        recommendations.push({
          domain: 'Technical Innovation',
          reason: 'Good innovation score suggests technical innovation potential',
          confidence: 0.8,
          skills: ['Problem Solving', 'Technical Skills', 'Creative Thinking']
        })
      } else {
        recommendations.push({
          domain: 'Skill Development',
          reason: 'Focus on building foundational skills and knowledge',
          confidence: 0.7,
          skills: ['Learning', 'Practice', 'Mentorship']
        })
      }
    }

    res.json({
      success: true,
      recommendations,
      currentScore: user.assessment.innovationScore
    })
  } catch (error) {
    console.error('Get recommendations error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations'
    })
  }
})

module.exports = router
