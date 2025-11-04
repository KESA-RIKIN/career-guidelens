const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, dateOfBirth, phone, location } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    // Create new user
    const user = new User({
      email,
      password,
      profile: {
        firstName,
        lastName,
        dateOfBirth,
        phone,
        location
      }
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        assessment: user.assessment,
        journey: user.journey
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Update last login
    await user.updateLastLogin()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        assessment: user.assessment,
        journey: user.journey,
        lastLogin: user.lastLogin
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    })
  }
})

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        profile: req.user.profile,
        assessment: req.user.assessment,
        journey: req.user.journey,
        preferences: req.user.preferences,
        lastLogin: req.user.lastLogin
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user data'
    })
  }
})

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, phone, location, preferredLanguage } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Update profile fields
    if (firstName) user.profile.firstName = firstName
    if (lastName) user.profile.lastName = lastName
    if (dateOfBirth) user.profile.dateOfBirth = dateOfBirth
    if (phone) user.profile.phone = phone
    if (location) user.profile.location = location
    if (preferredLanguage) user.profile.preferredLanguage = preferredLanguage

    await user.save()

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    })
  }
})

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { notifications, privacy } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Update preferences
    if (notifications) {
      user.preferences.notifications = { ...user.preferences.notifications, ...notifications }
    }
    if (privacy) {
      user.preferences.privacy = { ...user.preferences.privacy, ...privacy }
    }

    await user.save()

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    })
  } catch (error) {
    console.error('Update preferences error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences'
    })
  }
})

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    })
  }
})

// Deactivate account
router.delete('/deactivate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    user.isActive = false
    await user.save()

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    })
  } catch (error) {
    console.error('Deactivate account error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate account'
    })
  }
})

// Verify token
router.get('/verify', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: {
      id: req.user._id,
      email: req.user.email
    }
  })
})

module.exports = router
