'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Brain, 
  Target, 
  Zap, 
  Star, 
  X, 
  RefreshCw,
  Award,
  Lightbulb,
  Users,
  Calendar
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface InnovationScoreProps {
  onClose: () => void
}

export default function InnovationScore({ onClose }: InnovationScoreProps) {
  const [currentScore, setCurrentScore] = useState(0)
  const [targetScore, setTargetScore] = useState(85)
  const [isAnimating, setIsAnimating] = useState(false)

  // Mock data for demonstration
  const scoreHistory = [
    { month: 'Jan', score: 45 },
    { month: 'Feb', score: 52 },
    { month: 'Mar', score: 58 },
    { month: 'Apr', score: 63 },
    { month: 'May', score: 68 },
    { month: 'Jun', score: 72 },
    { month: 'Jul', score: 75 },
    { month: 'Aug', score: 78 },
    { month: 'Sep', score: 82 },
    { month: 'Oct', score: 85 },
  ]

  const scoreBreakdown = [
    { name: 'Creativity', value: 85, color: '#3b82f6' },
    { name: 'Problem Solving', value: 78, color: '#10b981' },
    { name: 'Leadership', value: 72, color: '#f59e0b' },
    { name: 'Communication', value: 88, color: '#ef4444' },
    { name: 'Adaptability', value: 80, color: '#8b5cf6' },
  ]

  const achievements = [
    { title: 'First Assessment', description: 'Completed your initial voice assessment', points: 50, earned: true },
    { title: 'Domain Explorer', description: 'Explored 5+ career domains', points: 100, earned: true },
    { title: 'Innovation Catalyst', description: 'Scored 80+ in creativity assessment', points: 150, earned: true },
    { title: 'Growth Mindset', description: 'Improved score by 20+ points', points: 200, earned: false },
    { title: 'Mentorship Seeker', description: 'Joined mentorship program', points: 75, earned: false },
  ]

  const recommendations = [
    {
      domain: 'Technology & Innovation',
      match: 92,
      reason: 'Your high creativity score and problem-solving abilities align perfectly with tech innovation roles.',
      skills: ['Software Development', 'AI/ML', 'Product Design']
    },
    {
      domain: 'Entrepreneurship',
      match: 88,
      reason: 'Strong leadership potential and adaptability make you well-suited for entrepreneurial ventures.',
      skills: ['Business Strategy', 'Market Analysis', 'Team Building']
    },
    {
      domain: 'Research & Development',
      match: 85,
      reason: 'Your analytical thinking and communication skills are ideal for R&D positions.',
      skills: ['Data Analysis', 'Scientific Writing', 'Experimental Design']
    }
  ]

  useEffect(() => {
    // Animate score on component mount
    const timer = setTimeout(() => {
      setIsAnimating(true)
      let score = 0
      const increment = 85 / 100
      const interval = setInterval(() => {
        score += increment
        setCurrentScore(Math.min(score, 85))
        if (score >= 85) {
          clearInterval(interval)
        }
      }, 20)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Innovation Catalyst'
    if (score >= 60) return 'Rising Innovator'
    return 'Emerging Talent'
  }

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
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Your Innovation Score</h2>
              <p className="text-primary-100">Dynamic scoring that evolves with your growth</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentScore(0)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Reset Animation"
              >
                <RefreshCw className="w-5 h-5" />
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

        <div className="p-6">
          {/* Main Score Display */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Score Circle */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 251.2" }}
                    animate={{ strokeDasharray: `${(currentScore / 100) * 251.2} 251.2` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    className={`text-4xl font-bold ${getScoreColor(currentScore)}`}
                    animate={{ scale: isAnimating ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {Math.round(currentScore)}
                  </motion.div>
                  <div className="text-sm text-gray-600">out of 100</div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {getScoreLabel(currentScore)}
                </h3>
                <p className="text-gray-600">
                  Your innovation potential is {currentScore >= 80 ? 'exceptional' : currentScore >= 60 ? 'strong' : 'developing'}
                </p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
              <div className="space-y-4">
                {scoreBreakdown.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{item.value}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Progress Over Time</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={scoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Recommended Career Domains</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{rec.domain}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{rec.match}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Achievements & Milestones</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    achievement.earned 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      achievement.earned ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {achievement.earned ? (
                        <Award className="w-5 h-5 text-white" />
                      ) : (
                        <Award className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">+{achievement.points}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn-primary flex items-center gap-2">
              <Target className="w-5 h-5" />
              Set Goals
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Users className="w-5 h-5" />
              Find Mentor
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Review
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
