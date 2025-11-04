const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query

    // Mock notifications - in production, these would come from a database
    const notifications = [
      {
        id: 'notif1',
        type: 'assessment',
        title: 'Assessment Reminder',
        message: 'Your next personality assessment is due tomorrow',
        priority: 'high',
        read: false,
        createdAt: new Date('2024-01-20'),
        actionUrl: '/assessment/personality'
      },
      {
        id: 'notif2',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'Congratulations! You\'ve earned the "Domain Explorer" badge',
        priority: 'medium',
        read: false,
        createdAt: new Date('2024-01-19'),
        actionUrl: '/journey/achievements'
      },
      {
        id: 'notif3',
        type: 'competition',
        title: 'New Competition Available',
        message: 'Innovation Hackathon 2024 is now open for registration',
        priority: 'medium',
        read: true,
        createdAt: new Date('2024-01-18'),
        actionUrl: '/competitions/comp1'
      },
      {
        id: 'notif4',
        type: 'mentorship',
        title: 'Mentorship Session Scheduled',
        message: 'Your 1:1 session with Dr. Sarah Chen is tomorrow at 6 PM',
        priority: 'high',
        read: false,
        createdAt: new Date('2024-01-17'),
        actionUrl: '/mentorship/sessions'
      },
      {
        id: 'notif5',
        type: 'progress',
        title: 'Progress Update',
        message: 'You\'ve completed 75% of your learning journey!',
        priority: 'low',
        read: true,
        createdAt: new Date('2024-01-16'),
        actionUrl: '/journey'
      }
    ]

    // Filter and paginate notifications
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + parseInt(limit)
    const paginatedNotifications = notifications.slice(startIndex, endIndex)

    res.json({
      success: true,
      notifications: paginatedNotifications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(notifications.length / limit),
        total: notifications.length
      },
      unreadCount: notifications.filter(n => !n.read).length
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications'
    })
  }
})

// Mark notification as read
router.put('/:notificationId/read', auth, async (req, res) => {
  try {
    const { notificationId } = req.params

    // In a real application, you would update the notification in the database
    res.json({
      success: true,
      message: 'Notification marked as read'
    })
  } catch (error) {
    console.error('Mark notification read error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    })
  }
})

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    // In a real application, you would update all user notifications
    res.json({
      success: true,
      message: 'All notifications marked as read'
    })
  } catch (error) {
    console.error('Mark all notifications read error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    })
  }
})

// Delete notification
router.delete('/:notificationId', auth, async (req, res) => {
  try {
    const { notificationId } = req.params

    // In a real application, you would delete the notification from the database
    res.json({
      success: true,
      message: 'Notification deleted'
    })
  } catch (error) {
    console.error('Delete notification error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    })
  }
})

// Get notification preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      preferences: user.preferences.notifications
    })
  } catch (error) {
    console.error('Get notification preferences error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get notification preferences'
    })
  }
})

// Update notification preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { email, push, sms } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Update notification preferences
    user.preferences.notifications = {
      email: email !== undefined ? email : user.preferences.notifications.email,
      push: push !== undefined ? push : user.preferences.notifications.push,
      sms: sms !== undefined ? sms : user.preferences.notifications.sms
    }

    await user.save()

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      preferences: user.preferences.notifications
    })
  } catch (error) {
    console.error('Update notification preferences error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences'
    })
  }
})

// Create notification (for testing)
router.post('/create', auth, async (req, res) => {
  try {
    const { type, title, message, priority = 'medium' } = req.body

    // In a real application, you would create a notification in the database
    const notification = {
      id: `notif_${Date.now()}`,
      type,
      title,
      message,
      priority,
      read: false,
      createdAt: new Date()
    }

    res.json({
      success: true,
      message: 'Notification created successfully',
      notification
    })
  } catch (error) {
    console.error('Create notification error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    })
  }
})

module.exports = router
