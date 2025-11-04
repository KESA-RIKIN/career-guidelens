const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// Get available competitions
router.get('/', auth, async (req, res) => {
  try {
    const competitions = [
      {
        id: 'comp1',
        title: 'Innovation Hackathon 2024',
        description: 'Build innovative solutions for real-world problems',
        type: 'hackathon',
        status: 'upcoming',
        startDate: '2024-02-15',
        endDate: '2024-02-17',
        prize: '$10,000',
        participants: 150,
        maxParticipants: 200,
        requirements: ['Team of 2-4', 'Innovation project', 'Presentation'],
        tags: ['Technology', 'Innovation', 'Team']
      },
      {
        id: 'comp2',
        title: 'Career Path Challenge',
        description: 'Complete career exploration tasks and earn points',
        type: 'challenge',
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        prize: 'Mentorship sessions',
        participants: 500,
        maxParticipants: 1000,
        requirements: ['Complete assessments', 'Explore domains', 'Build portfolio'],
        tags: ['Career', 'Learning', 'Individual']
      },
      {
        id: 'comp3',
        title: 'Skill Master Competition',
        description: 'Showcase your technical skills in various domains',
        type: 'skill',
        status: 'upcoming',
        startDate: '2024-03-01',
        endDate: '2024-03-15',
        prize: 'Certification & Job opportunities',
        participants: 75,
        maxParticipants: 100,
        requirements: ['Portfolio project', 'Skill demonstration', 'Interview'],
        tags: ['Skills', 'Portfolio', 'Career']
      }
    ]

    res.json({
      success: true,
      competitions
    })
  } catch (error) {
    console.error('Get competitions error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get competitions'
    })
  }
})

// Join a competition
router.post('/join', auth, async (req, res) => {
  try {
    const { competitionId, teamMembers = [] } = req.body

    // In a real application, you would:
    // 1. Check if user is eligible
    // 2. Check if competition has space
    // 3. Create participation record
    // 4. Send confirmation

    const participation = {
      id: `participation_${Date.now()}`,
      competitionId,
      userId: req.user._id,
      teamMembers,
      joinedAt: new Date(),
      status: 'registered'
    }

    res.json({
      success: true,
      message: 'Successfully joined competition',
      participation
    })
  } catch (error) {
    console.error('Join competition error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to join competition'
    })
  }
})

// Get user's competition history
router.get('/my-competitions', auth, async (req, res) => {
  try {
    // Mock user's competition history
    const myCompetitions = [
      {
        id: 'participation1',
        competition: {
          title: 'Career Path Challenge',
          type: 'challenge',
          status: 'active'
        },
        joinedAt: '2024-01-15',
        status: 'participating',
        progress: 65,
        rank: 45
      },
      {
        id: 'participation2',
        competition: {
          title: 'Skill Showcase 2023',
          type: 'skill',
          status: 'completed'
        },
        joinedAt: '2023-12-01',
        status: 'completed',
        progress: 100,
        rank: 12,
        prize: 'Certificate of Excellence'
      }
    ]

    res.json({
      success: true,
      competitions: myCompetitions
    })
  } catch (error) {
    console.error('Get my competitions error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get competition history'
    })
  }
})

// Get competition leaderboard
router.get('/:competitionId/leaderboard', auth, async (req, res) => {
  try {
    const { competitionId } = req.params

    // Mock leaderboard data
    const leaderboard = [
      { rank: 1, name: 'Alex Chen', score: 2450, team: 'Innovation Squad' },
      { rank: 2, name: 'Sarah Johnson', score: 2380, team: 'Tech Titans' },
      { rank: 3, name: 'Mike Rodriguez', score: 2250, team: 'Code Masters' },
      { rank: 4, name: 'Emma Wilson', score: 2100, team: 'Future Leaders' },
      { rank: 5, name: 'You', score: 1850, team: 'Rising Stars' }
    ]

    res.json({
      success: true,
      leaderboard,
      competitionId
    })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard'
    })
  }
})

// Submit competition entry
router.post('/submit', auth, async (req, res) => {
  try {
    const { competitionId, entry } = req.body

    // In a real application, you would:
    // 1. Validate entry format
    // 2. Store entry files
    // 3. Create submission record
    // 4. Send confirmation

    const submission = {
      id: `submission_${Date.now()}`,
      competitionId,
      userId: req.user._id,
      entry,
      submittedAt: new Date(),
      status: 'submitted'
    }

    res.json({
      success: true,
      message: 'Entry submitted successfully',
      submission
    })
  } catch (error) {
    console.error('Submit entry error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit entry'
    })
  }
})

// Get competition details
router.get('/:competitionId', auth, async (req, res) => {
  try {
    const { competitionId } = req.params

    // Mock competition details
    const competition = {
      id: competitionId,
      title: 'Innovation Hackathon 2024',
      description: 'Build innovative solutions for real-world problems',
      type: 'hackathon',
      status: 'upcoming',
      startDate: '2024-02-15',
      endDate: '2024-02-17',
      prize: '$10,000',
      participants: 150,
      maxParticipants: 200,
      requirements: ['Team of 2-4', 'Innovation project', 'Presentation'],
      tags: ['Technology', 'Innovation', 'Team'],
      rules: [
        'Teams must have 2-4 members',
        'Projects must be original work',
        'Presentations must be under 10 minutes',
        'All code must be open source'
      ],
      timeline: [
        { date: '2024-02-15', event: 'Registration & Team Formation' },
        { date: '2024-02-16', event: 'Development Phase' },
        { date: '2024-02-17', event: 'Presentations & Judging' }
      ]
    }

    res.json({
      success: true,
      competition
    })
  } catch (error) {
    console.error('Get competition details error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get competition details'
    })
  }
})

module.exports = router
