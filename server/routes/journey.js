const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// Get user's journey progress
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const journey = {
      currentStage: user.journey.currentStage,
      totalPoints: user.journey.totalPoints,
      completedTasks: user.journey.completedTasks,
      achievements: user.journey.achievements,
      progressPercentage: user.getProgressPercentage()
    }

    res.json({
      success: true,
      journey
    })
  } catch (error) {
    console.error('Get journey error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get journey progress'
    })
  }
})

// Complete a task
router.post('/complete-task', auth, async (req, res) => {
  try {
    const { taskId, points } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if task is already completed
    if (user.hasCompletedTask(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Task already completed'
      })
    }

    // Add points and mark task as completed
    await user.addPoints(points, taskId)

    // Check for stage progression
    const newProgress = user.getProgressPercentage()
    let stageProgression = null

    if (newProgress >= 20 && user.journey.currentStage === 'curiosity') {
      user.journey.currentStage = 'learning'
      stageProgression = 'learning'
    } else if (newProgress >= 40 && user.journey.currentStage === 'learning') {
      user.journey.currentStage = 'skill'
      stageProgression = 'skill'
    } else if (newProgress >= 60 && user.journey.currentStage === 'skill') {
      user.journey.currentStage = 'innovation'
      stageProgression = 'innovation'
    } else if (newProgress >= 80 && user.journey.currentStage === 'innovation') {
      user.journey.currentStage = 'impact'
      stageProgression = 'impact'
    }

    await user.save()

    res.json({
      success: true,
      message: 'Task completed successfully',
      points,
      totalPoints: user.journey.totalPoints,
      stageProgression
    })
  } catch (error) {
    console.error('Complete task error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to complete task'
    })
  }
})

// Get available tasks
router.get('/tasks', auth, async (req, res) => {
  try {
    const { stage } = req.query

    // Define tasks for each stage
    const stageTasks = {
      curiosity: [
        { id: 'c1', title: 'Complete Voice Assessment', points: 100, description: 'Take your first personality assessment' },
        { id: 'c2', title: 'Explore 3 Career Domains', points: 75, description: 'Learn about different career paths' },
        { id: 'c3', title: 'Take Personality Quiz', points: 50, description: 'Discover your personality traits' }
      ],
      learning: [
        { id: 'l1', title: 'Complete Domain Assessment', points: 150, description: 'Assess your domain interests' },
        { id: 'l2', title: 'Watch 5 Learning Videos', points: 100, description: 'Expand your knowledge base' },
        { id: 'l3', title: 'Join Study Group', points: 75, description: 'Connect with other learners' }
      ],
      skill: [
        { id: 's1', title: 'Complete Skill Challenge', points: 200, description: 'Test your practical abilities' },
        { id: 's2', title: 'Build Portfolio Project', points: 250, description: 'Create something tangible' },
        { id: 's3', title: 'Get Skill Certification', points: 300, description: 'Validate your skills' }
      ],
      innovation: [
        { id: 'i1', title: 'Submit Innovation Project', points: 400, description: 'Create an innovative solution' },
        { id: 'i2', title: 'Participate in Hackathon', points: 350, description: 'Collaborate in a team event' },
        { id: 'i3', title: 'Mentor Other Students', points: 300, description: 'Help others grow' }
      ],
      impact: [
        { id: 'im1', title: 'Launch Real Project', points: 500, description: 'Bring your ideas to life' },
        { id: 'im2', title: 'Lead Team Initiative', points: 450, description: 'Take on leadership role' },
        { id: 'im3', title: 'Create Social Impact', points: 600, description: 'Make a positive difference' }
      ]
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const currentStage = stage || user.journey.currentStage
    const tasks = stageTasks[currentStage] || []

    // Mark completed tasks
    const tasksWithStatus = tasks.map(task => ({
      ...task,
      completed: user.hasCompletedTask(task.id)
    }))

    res.json({
      success: true,
      tasks: tasksWithStatus,
      currentStage: user.journey.currentStage
    })
  } catch (error) {
    console.error('Get tasks error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get tasks'
    })
  }
})

// Get achievements
router.get('/achievements', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Define all possible achievements
    const allAchievements = [
      { id: 'first_steps', title: 'First Steps', description: 'Completed your first assessment', points: 50 },
      { id: 'domain_explorer', title: 'Domain Explorer', description: 'Explored 5+ career domains', points: 100 },
      { id: 'learning_streak', title: 'Learning Streak', description: '7 days of continuous learning', points: 150 },
      { id: 'skill_master', title: 'Skill Master', description: 'Completed 3 skill challenges', points: 200 },
      { id: 'innovation_catalyst', title: 'Innovation Catalyst', description: 'Scored 80+ in innovation assessment', points: 300 },
      { id: 'mentor', title: 'Mentor', description: 'Helped 3+ other students', points: 250 },
      { id: 'leader', title: 'Leader', description: 'Led a team project', points: 400 },
      { id: 'impact_maker', title: 'Impact Maker', description: 'Created positive social impact', points: 500 }
    ]

    // Check which achievements are earned
    const earnedAchievements = allAchievements.map(achievement => {
      const earned = user.journey.achievements.some(earned => earned.achievementId === achievement.id)
      return {
        ...achievement,
        earned,
        earnedAt: earned ? user.journey.achievements.find(e => e.achievementId === achievement.id)?.earnedAt : null
      }
    })

    res.json({
      success: true,
      achievements: earnedAchievements,
      totalEarned: user.journey.achievements.length
    })
  } catch (error) {
    console.error('Get achievements error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get achievements'
    })
  }
})

// Add achievement
router.post('/add-achievement', auth, async (req, res) => {
  try {
    const { achievementId, title, description } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if achievement is already earned
    const alreadyEarned = user.journey.achievements.some(a => a.achievementId === achievementId)
    if (alreadyEarned) {
      return res.status(400).json({
        success: false,
        message: 'Achievement already earned'
      })
    }

    // Add achievement
    user.journey.achievements.push({
      achievementId,
      title,
      description,
      earnedAt: new Date()
    })

    await user.save()

    res.json({
      success: true,
      message: 'Achievement added successfully',
      achievement: {
        achievementId,
        title,
        description,
        earnedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Add achievement error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add achievement'
    })
  }
})

// Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query

    // Get top users by total points
    const topUsers = await User.find({ isActive: true })
      .select('profile.firstName profile.lastName journey.totalPoints journey.achievements')
      .sort({ 'journey.totalPoints': -1 })
      .limit(parseInt(limit))

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      name: `${user.profile.firstName} ${user.profile.lastName}`,
      score: user.journey.totalPoints,
      achievements: user.journey.achievements.length,
      badge: getBadgeForScore(user.journey.totalPoints)
    }))

    // Find current user's rank
    const currentUserRank = await User.countDocuments({
      isActive: true,
      'journey.totalPoints': { $gt: req.user.journey.totalPoints }
    }) + 1

    res.json({
      success: true,
      leaderboard,
      currentUserRank,
      currentUserScore: req.user.journey.totalPoints
    })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard'
    })
  }
})

// Helper function to get badge based on score
function getBadgeForScore(score) {
  if (score >= 5000) return 'Innovation Master'
  if (score >= 3000) return 'Skill Builder'
  if (score >= 1500) return 'Rising Star'
  if (score >= 500) return 'Quick Learner'
  return 'Getting Started'
}

module.exports = router
