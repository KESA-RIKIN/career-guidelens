'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Star, 
  Trophy, 
  Zap, 
  Target, 
  Users, 
  BookOpen, 
  Lightbulb,
  Award,
  ChevronRight,
  Lock,
  CheckCircle,
  Clock,
  Flame
} from 'lucide-react'

interface GamifiedJourneyProps {
  onClose: () => void
}

export default function GamifiedJourney({ onClose }: GamifiedJourneyProps) {
  const [currentStage, setCurrentStage] = useState(2) // Currently at Learning stage
  const [selectedTask, setSelectedTask] = useState<number | null>(null)

  const journeyStages = [
    {
      id: 0,
      name: 'Curiosity',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      description: 'Discover your interests and passions',
      completed: true,
      tasks: [
        { id: 1, title: 'Complete Voice Assessment', points: 100, completed: true },
        { id: 2, title: 'Explore 3 Career Domains', points: 75, completed: true },
        { id: 3, title: 'Take Personality Quiz', points: 50, completed: true }
      ]
    },
    {
      id: 1,
      name: 'Learning',
      icon: <Target className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      description: 'Build skills and knowledge',
      completed: true,
      current: true,
      tasks: [
        { id: 4, title: 'Complete Domain Assessment', points: 150, completed: true },
        { id: 5, title: 'Watch 5 Learning Videos', points: 100, completed: false },
        { id: 6, title: 'Join Study Group', points: 75, completed: false }
      ]
    },
    {
      id: 2,
      name: 'Skill',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Develop practical abilities',
      completed: false,
      current: false,
      tasks: [
        { id: 7, title: 'Complete Skill Challenge', points: 200, completed: false },
        { id: 8, title: 'Build Portfolio Project', points: 250, completed: false },
        { id: 9, title: 'Get Skill Certification', points: 300, completed: false }
      ]
    },
    {
      id: 3,
      name: 'Innovation',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      description: 'Create and innovate',
      completed: false,
      current: false,
      tasks: [
        { id: 10, title: 'Submit Innovation Project', points: 400, completed: false },
        { id: 11, title: 'Participate in Hackathon', points: 350, completed: false },
        { id: 12, title: 'Mentor Other Students', points: 300, completed: false }
      ]
    },
    {
      id: 4,
      name: 'Impact',
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      description: 'Make a difference',
      completed: false,
      current: false,
      tasks: [
        { id: 13, title: 'Launch Real Project', points: 500, completed: false },
        { id: 14, title: 'Lead Team Initiative', points: 450, completed: false },
        { id: 15, title: 'Create Social Impact', points: 600, completed: false }
      ]
    }
  ]

  const leaderboard = [
    { rank: 1, name: 'Alex Chen', score: 2450, badge: 'Innovation Master' },
    { rank: 2, name: 'Sarah Johnson', score: 2380, badge: 'Skill Builder' },
    { rank: 3, name: 'You', score: 1850, badge: 'Rising Star' },
    { rank: 4, name: 'Mike Rodriguez', score: 1720, badge: 'Quick Learner' },
    { rank: 5, name: 'Emma Wilson', score: 1650, badge: 'Team Player' }
  ]

  const achievements = [
    { title: 'First Steps', description: 'Completed your first assessment', icon: <Star className="w-5 h-5" />, earned: true },
    { title: 'Domain Explorer', description: 'Explored 5+ career domains', icon: <Target className="w-5 h-5" />, earned: true },
    { title: 'Learning Streak', description: '7 days of continuous learning', icon: <Flame className="w-5 h-5" />, earned: false },
    { title: 'Skill Master', description: 'Completed 3 skill challenges', icon: <Award className="w-5 h-5" />, earned: false }
  ]

  const totalPoints = 1850
  const nextMilestone = 2000
  const progressToNext = (totalPoints / nextMilestone) * 100

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
              <h2 className="text-2xl font-bold">Your Growth Journey</h2>
              <p className="text-primary-100">Gamified learning path to unlock your potential</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Progress Overview */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Journey Progress</h3>
              <div className="text-sm text-gray-600">
                {totalPoints} / {nextMilestone} points
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <motion.div
                className="bg-gradient-to-r from-primary-600 to-accent-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {nextMilestone - totalPoints} points to next milestone
            </p>
          </div>

          {/* Journey Stages */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-6">Journey Stages</h3>
            <div className="space-y-4">
              {journeyStages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    stage.completed 
                      ? 'border-green-200 bg-green-50' 
                      : stage.current 
                        ? 'border-primary-200 bg-primary-50' 
                        : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stage.color} flex items-center justify-center text-white`}>
                      {stage.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : stage.current ? (
                        stage.icon
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{stage.name}</h4>
                        {stage.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {stage.current && <Clock className="w-4 h-4 text-primary-500" />}
                      </div>
                      <p className="text-sm text-gray-600">{stage.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">
                        {stage.tasks.filter(task => task.completed).length} / {stage.tasks.length} tasks
                      </div>
                      <div className="text-xs text-gray-500">
                        {stage.tasks.reduce((sum, task) => sum + (task.completed ? task.points : 0), 0)} points
                      </div>
                    </div>
                  </div>

                  {/* Tasks for current stage */}
                  {stage.current && (
                    <div className="mt-4 space-y-2">
                      {stage.tasks.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-lg border ${
                            task.completed 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {task.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                              )}
                              <span className={`font-medium ${
                                task.completed ? 'text-green-700' : 'text-gray-700'
                              }`}>
                                {task.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">+{task.points}</span>
                              <button
                                onClick={() => setSelectedTask(task.id)}
                                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                              >
                                {task.completed ? 'View' : 'Start'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      player.name === 'You' ? 'bg-primary-100 border-2 border-primary-200' : 'bg-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      player.rank === 1 ? 'bg-yellow-500 text-white' :
                      player.rank === 2 ? 'bg-gray-400 text-white' :
                      player.rank === 3 ? 'bg-orange-500 text-white' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {player.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{player.name}</div>
                      <div className="text-sm text-gray-600">{player.badge}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">{player.score.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    achievement.earned 
                      ? 'border-yellow-200 bg-yellow-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.earned ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-500'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <Award className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn-primary flex items-center gap-2">
              <Target className="w-5 h-5" />
              Continue Journey
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Users className="w-5 h-5" />
              Join Team
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              View Competitions
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
