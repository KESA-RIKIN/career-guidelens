<<<<<<< HEAD
# Innovation Discovery Platform

An AI-powered self-discovery and innovation guidance platform that helps students uncover their passions, strengths, skills, and innovation potential through personalized voice assessments and gamified learning journeys.

## 🚀 Features

### 🎙️ Voice-Interactive Assessment
- Dynamic AI-powered personality assessment using voice analysis
- Speech-to-text input with editing and noise cancellation
- Multi-language support (English, Hindi, Tamil, Telugu)
- Privacy-first approach with user control over recordings

### 🧭 Adaptive Domain Exploration
- Personalized domain quizzes with MCQ, descriptive, and rating scale questions
- Clear reasoning for every domain recommendation
- Retake options for both personality and domain assessments
- Tutorial tests before main assessments

### 🚀 Innovation Score System
- Dynamic Innovation Score that evolves with user growth
- Real-time progress tracking and score history
- Detailed score breakdown across multiple dimensions
- Personalized recommendations based on scores

### 🎓 Gamified Growth Journey
- 5-stage journey: Curiosity → Learning → Skill → Innovation → Impact
- Visual progress tracker with achievements and milestones
- Task-based learning with point system
- Leaderboards and team competitions

### 👥 Mentorship System
- Free demo sessions
- Group mentorship programs
- 1:1 personalized mentorship
- Industry expert matching

### 🏆 Competitions & Projects
- Hackathons and innovation challenges
- Skill-based competitions
- Team formation and collaboration
- Real-world project opportunities

### 🔒 Privacy & Security
- Full user control over data and recordings
- Secure data management
- GDPR compliant
- Transparent data usage

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **React Speech Kit** - Voice interaction
- **Zustand** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **OpenAI API** - AI integration

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd innovation-discovery-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp server/env.example server/.env
   
   # Edit server/.env with your configuration
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/innovation-discovery

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI API
OPENAI_API_KEY=your-openai-api-key-here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Client URL
CLIENT_URL=http://localhost:3000
```

## 📱 Usage

### 1. User Registration
- Create an account with email and password
- Complete profile setup
- Set notification preferences

### 2. Voice Assessment
- Start with tutorial assessment
- Complete personality assessment using voice
- Review and edit transcriptions
- Get AI-powered insights

### 3. Domain Exploration
- Take domain-specific quizzes
- Receive personalized recommendations
- Understand reasoning behind suggestions

### 4. Innovation Score
- View your dynamic innovation score
- Track progress over time
- Get detailed breakdowns
- Receive improvement suggestions

### 5. Growth Journey
- Follow the 5-stage journey
- Complete tasks and earn points
- Unlock achievements
- Track progress visually

### 6. Mentorship
- Choose mentorship tier
- Book sessions with experts
- Get personalized guidance
- Build industry connections

### 7. Competitions
- Join hackathons and challenges
- Collaborate with teams
- Showcase skills
- Win prizes and recognition

## 🏗️ Project Structure

```
innovation-discovery-platform/
├── client/                 # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and helpers
│   └── public/           # Static assets
├── server/               # Node.js backend
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── uploads/          # File uploads
└── docs/                # Documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Assessment
- `GET /api/assessment/questions/:type` - Get assessment questions
- `POST /api/assessment/start` - Start new assessment
- `POST /api/assessment/answer` - Submit answer
- `POST /api/assessment/complete` - Complete assessment

### Innovation Score
- `GET /api/score` - Get innovation score
- `GET /api/score/history` - Get score history
- `GET /api/score/breakdown` - Get detailed breakdown

### Journey
- `GET /api/journey` - Get journey progress
- `POST /api/journey/complete-task` - Complete task
- `GET /api/journey/tasks` - Get available tasks
- `GET /api/journey/achievements` - Get achievements

### Mentorship
- `GET /api/mentorship/options` - Get mentorship options
- `GET /api/mentorship/mentors` - Get available mentors
- `POST /api/mentorship/book` - Book session

### Competitions
- `GET /api/competitions` - Get competitions
- `POST /api/competitions/join` - Join competition
- `GET /api/competitions/:id/leaderboard` - Get leaderboard

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/preferences` - Update preferences

## 🧪 Testing

```bash
# Run frontend tests
cd client && npm test

# Run backend tests
cd server && npm test

# Run integration tests
npm run test:integration
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build and deploy
npm run build
vercel deploy
```

### Backend (Railway/Heroku)
```bash
# Deploy to Railway
railway deploy

# Or deploy to Heroku
git push heroku main
```

### Database (MongoDB Atlas)
- Create cluster on MongoDB Atlas
- Update MONGODB_URI in environment variables
- Configure network access and database user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- MongoDB for database services
- Vercel for deployment platform
- All contributors and mentors

## 📞 Support

For support, email support@innovationdiscovery.com or join our Discord community.

---

**Built with ❤️ for student innovation and growth**
=======
# Innovation Discovery Platform

An AI-powered self-discovery and innovation guidance platform that helps students uncover their passions, strengths, skills, and innovation potential through personalized voice assessments and gamified learning journeys.

## 🚀 Features

### 🎙️ Voice-Interactive Assessment
- Dynamic AI-powered personality assessment using voice analysis
- Speech-to-text input with editing and noise cancellation
- Multi-language support (English, Hindi, Tamil, Telugu)
- Privacy-first approach with user control over recordings

### 🧭 Adaptive Domain Exploration
- Personalized domain quizzes with MCQ, descriptive, and rating scale questions
- Clear reasoning for every domain recommendation
- Retake options for both personality and domain assessments
- Tutorial tests before main assessments

### 🚀 Innovation Score System
- Dynamic Innovation Score that evolves with user growth
- Real-time progress tracking and score history
- Detailed score breakdown across multiple dimensions
- Personalized recommendations based on scores

### 🎓 Gamified Growth Journey
- 5-stage journey: Curiosity → Learning → Skill → Innovation → Impact
- Visual progress tracker with achievements and milestones
- Task-based learning with point system
- Leaderboards and team competitions

### 👥 Mentorship System
- Free demo sessions
- Group mentorship programs
- 1:1 personalized mentorship
- Industry expert matching

### 🏆 Competitions & Projects
- Hackathons and innovation challenges
- Skill-based competitions
- Team formation and collaboration
- Real-world project opportunities

### 🔒 Privacy & Security
- Full user control over data and recordings
- Secure data management
- GDPR compliant
- Transparent data usage

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **React Speech Kit** - Voice interaction
- **Zustand** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **OpenAI API** - AI integration

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd innovation-discovery-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp server/env.example server/.env
   
   # Edit server/.env with your configuration
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/innovation-discovery

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI API
OPENAI_API_KEY=your-openai-api-key-here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Client URL
CLIENT_URL=http://localhost:3000
```

## 📱 Usage

### 1. User Registration
- Create an account with email and password
- Complete profile setup
- Set notification preferences

### 2. Voice Assessment
- Start with tutorial assessment
- Complete personality assessment using voice
- Review and edit transcriptions
- Get AI-powered insights

### 3. Domain Exploration
- Take domain-specific quizzes
- Receive personalized recommendations
- Understand reasoning behind suggestions

### 4. Innovation Score
- View your dynamic innovation score
- Track progress over time
- Get detailed breakdowns
- Receive improvement suggestions

### 5. Growth Journey
- Follow the 5-stage journey
- Complete tasks and earn points
- Unlock achievements
- Track progress visually

### 6. Mentorship
- Choose mentorship tier
- Book sessions with experts
- Get personalized guidance
- Build industry connections

### 7. Competitions
- Join hackathons and challenges
- Collaborate with teams
- Showcase skills
- Win prizes and recognition

## 🏗️ Project Structure

```
innovation-discovery-platform/
├── client/                 # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and helpers
│   └── public/           # Static assets
├── server/               # Node.js backend
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── uploads/          # File uploads
└── docs/                # Documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Assessment
- `GET /api/assessment/questions/:type` - Get assessment questions
- `POST /api/assessment/start` - Start new assessment
- `POST /api/assessment/answer` - Submit answer
- `POST /api/assessment/complete` - Complete assessment

### Innovation Score
- `GET /api/score` - Get innovation score
- `GET /api/score/history` - Get score history
- `GET /api/score/breakdown` - Get detailed breakdown

### Journey
- `GET /api/journey` - Get journey progress
- `POST /api/journey/complete-task` - Complete task
- `GET /api/journey/tasks` - Get available tasks
- `GET /api/journey/achievements` - Get achievements

### Mentorship
- `GET /api/mentorship/options` - Get mentorship options
- `GET /api/mentorship/mentors` - Get available mentors
- `POST /api/mentorship/book` - Book session

### Competitions
- `GET /api/competitions` - Get competitions
- `POST /api/competitions/join` - Join competition
- `GET /api/competitions/:id/leaderboard` - Get leaderboard

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/preferences` - Update preferences

## 🧪 Testing

```bash
# Run frontend tests
cd client && npm test

# Run backend tests
cd server && npm test

# Run integration tests
npm run test:integration
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build and deploy
npm run build
vercel deploy
```

### Backend (Railway/Heroku)
```bash
# Deploy to Railway
railway deploy

# Or deploy to Heroku
git push heroku main
```

### Database (MongoDB Atlas)
- Create cluster on MongoDB Atlas
- Update MONGODB_URI in environment variables
- Configure network access and database user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- MongoDB for database services
- Vercel for deployment platform
- All contributors and mentors

## 📞 Support

For support, email support@innovationdiscovery.com or join our Discord community.

---

**Built with ❤️ for student innovation and growth**
>>>>>>> 64c6a543dda09a594d42ea034e59e12393f214c7
