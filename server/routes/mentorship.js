const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// Get mentorship options
router.get('/options', auth, async (req, res) => {
  try {
    const mentorshipOptions = [
      {
        id: 'free_demo',
        name: 'Free Demo Session',
        description: '30-minute introductory session to understand mentorship',
        duration: '30 minutes',
        price: 0,
        features: [
          'Personalized career guidance',
          'Assessment review',
          'Goal setting discussion',
          'Next steps planning'
        ],
        popular: false
      },
      {
        id: 'group_mentorship',
        name: 'Group Mentorship',
        description: 'Weekly group sessions with peers and industry experts',
        duration: '4 weeks',
        price: 99,
        features: [
          'Weekly group sessions',
          'Peer networking',
          'Industry expert talks',
          'Group projects',
          'Progress tracking'
        ],
        popular: true
      },
      {
        id: 'one_on_one',
        name: '1:1 Mentorship',
        description: 'Personalized one-on-one mentorship with industry experts',
        duration: '8 weeks',
        price: 299,
        features: [
          'Weekly 1:1 sessions',
          'Personalized guidance',
          'Career roadmap',
          'Industry connections',
          'Portfolio review',
          'Job search support'
        ],
        popular: false
      }
    ]

    res.json({
      success: true,
      options: mentorshipOptions
    })
  } catch (error) {
    console.error('Get mentorship options error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get mentorship options'
    })
  }
})

// Get available mentors
router.get('/mentors', auth, async (req, res) => {
  try {
    const { domain, experience } = req.query

    // Mock mentor data - in production, this would come from a database
    const mentors = [
      {
        id: 'mentor1',
        name: 'Dr. Sarah Chen',
        title: 'Senior Software Engineer at Google',
        experience: '8 years',
        domain: 'Technology',
        rating: 4.9,
        studentsHelped: 150,
        specialties: ['Software Development', 'AI/ML', 'Career Growth'],
        bio: 'Passionate about helping students discover their potential in technology',
        availability: 'Weekdays 6-8 PM',
        price: 150
      },
      {
        id: 'mentor2',
        name: 'Michael Rodriguez',
        title: 'Product Manager at Microsoft',
        experience: '6 years',
        domain: 'Business',
        rating: 4.8,
        studentsHelped: 120,
        specialties: ['Product Management', 'Leadership', 'Strategy'],
        bio: 'Experienced in building products that users love',
        availability: 'Weekends',
        price: 200
      },
      {
        id: 'mentor3',
        name: 'Dr. Priya Sharma',
        title: 'Research Scientist at MIT',
        experience: '10 years',
        domain: 'Research',
        rating: 4.9,
        studentsHelped: 200,
        specialties: ['Research', 'Data Science', 'Innovation'],
        bio: 'Dedicated to advancing scientific knowledge and mentoring future researchers',
        availability: 'Flexible',
        price: 180
      }
    ]

    // Filter mentors based on query parameters
    let filteredMentors = mentors
    if (domain) {
      filteredMentors = filteredMentors.filter(mentor => 
        mentor.domain.toLowerCase().includes(domain.toLowerCase())
      )
    }

    res.json({
      success: true,
      mentors: filteredMentors
    })
  } catch (error) {
    console.error('Get mentors error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get mentors'
    })
  }
})

// Book mentorship session
router.post('/book', auth, async (req, res) => {
  try {
    const { mentorId, sessionType, date, time, duration } = req.body

    // In a real application, you would:
    // 1. Validate mentor availability
    // 2. Create a booking record
    // 3. Send confirmation emails
    // 4. Handle payment processing

    const booking = {
      id: `booking_${Date.now()}`,
      mentorId,
      sessionType,
      date,
      time,
      duration,
      status: 'confirmed',
      createdAt: new Date()
    }

    res.json({
      success: true,
      message: 'Mentorship session booked successfully',
      booking
    })
  } catch (error) {
    console.error('Book mentorship error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to book mentorship session'
    })
  }
})

// Get user's mentorship history
router.get('/history', auth, async (req, res) => {
  try {
    // Mock mentorship history
    const history = [
      {
        id: 'session1',
        mentorName: 'Dr. Sarah Chen',
        sessionType: '1:1 Mentorship',
        date: '2024-01-15',
        duration: '60 minutes',
        status: 'completed',
        rating: 5,
        feedback: 'Excellent session, very helpful guidance'
      },
      {
        id: 'session2',
        mentorName: 'Michael Rodriguez',
        sessionType: 'Group Mentorship',
        date: '2024-01-22',
        duration: '90 minutes',
        status: 'completed',
        rating: 4,
        feedback: 'Great group discussion and networking'
      }
    ]

    res.json({
      success: true,
      history
    })
  } catch (error) {
    console.error('Get mentorship history error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get mentorship history'
    })
  }
})

// Get mentorship recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Get user's top domains for personalized recommendations
    const topDomains = user.assessment.domainScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(domain => domain.domain)

    const recommendations = [
      {
        type: 'mentor',
        reason: 'Based on your high technology score',
        mentor: {
          name: 'Dr. Sarah Chen',
          domain: 'Technology',
          match: 95
        }
      },
      {
        type: 'session',
        reason: 'Your innovation score suggests you would benefit from leadership mentoring',
        session: {
          type: 'Leadership Workshop',
          duration: '2 hours',
          price: 99
        }
      },
      {
        type: 'program',
        reason: 'Your learning stage indicates you need skill-building support',
        program: {
          name: 'Skill Development Program',
          duration: '4 weeks',
          price: 199
        }
      }
    ]

    res.json({
      success: true,
      recommendations,
      userDomains: topDomains
    })
  } catch (error) {
    console.error('Get mentorship recommendations error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get mentorship recommendations'
    })
  }
})

module.exports = router
