'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mic, 
  Brain, 
  Target, 
  Users, 
  Trophy, 
  Shield, 
  Bell, 
  ChevronRight,
  Play,
  Star,
  Zap,
  Heart
} from 'lucide-react'
import VoiceAssessment from '@/components/VoiceAssessment'
import InnovationScore from '@/components/InnovationScore'
import GamifiedJourney from '@/components/GamifiedJourney'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  const [currentSection, setCurrentSection] = useState('hero')

  const features = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice-Interactive Assessment",
      description: "Dynamic AI-powered personality assessment using voice analysis and emotional context"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Adaptive Domain Exploration",
      description: "Personalized quizzes with clear reasoning for every recommendation"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Innovation Score System",
      description: "Dynamic scoring that evolves with your growth and achievements"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Growth Journey & Mentorship",
      description: "Gamified learning path with mentorship tiers and progress tracking"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Competitions & Projects",
      description: "Unlock challenges, join hackathons, and climb leaderboards"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy & Control",
      description: "Full control over your data with secure recording management"
    }
  ]

  const stats = [
    { number: "1M+", label: "Students Helped" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "50+", label: "Career Domains" },
    { number: "24/7", label: "AI Support" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent-600/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Discover Your{' '}
              <span className="gradient-text">True Potential</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              AI-powered self-discovery platform that helps students uncover their passions, 
              strengths, and innovation potential through personalized voice assessments and 
              gamified learning journeys.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
                onClick={() => setCurrentSection('assessment')}
              >
                <Play className="w-5 h-5" />
                Start Your Journey
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
                onClick={() => setCurrentSection('features')}
              >
                <ChevronRight className="w-5 h-5" />
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We don't just guide — we grow with the student through innovative AI technology 
              and personalized learning experiences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-8 group"
              >
                <div className="text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Voice Assessment Demo */}
      {currentSection === 'assessment' && (
        <VoiceAssessment onClose={() => setCurrentSection('hero')} />
      )}

      {/* Innovation Score Demo */}
      {currentSection === 'score' && (
        <InnovationScore onClose={() => setCurrentSection('hero')} />
      )}

      {/* Gamified Journey Demo */}
      {currentSection === 'journey' && (
        <GamifiedJourney onClose={() => setCurrentSection('hero')} />
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Discover Your Innovation Potential?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of students who have already started their journey of self-discovery 
              and career growth with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
                onClick={() => setCurrentSection('assessment')}
              >
                Start Free Assessment
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg text-lg hover:bg-white/10 transition-colors"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
