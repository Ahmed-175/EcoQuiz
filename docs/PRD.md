# Project Requirements Document (PRD): ecoQuiz

## 1. Project Overview

### 1.1 Project Name

**ecoQuiz** - An interactive quiz platform for community-based learning

### 1.2 Vision

Create a full-stack application where users can create, join communities, and participate in quizzes to test knowledge on various subjects.

### 1.3 Technology Stack

**Backend:**

- **Language:** Golang
- **Framework:** Gin
- **Database:** PostgreSQL
- **ORM/Driver:** pgx
- **Authentication:** OAuth2 (Google), JWT

**Frontend:**

- **Framework:** React 18+
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **HTTP Client:** Axios

## 2. Core Features

### 2.1 User Management

- Google OAuth2 authentication
- User profile with avatar and banner
- User statistics and achievements

### 2.2 Community System

- Create communities around specific subjects
- Community settings and permissions
- Role management (Creator, Admin, Member)
- Community discovery and joining

### 2.3 Quiz System

- Multiple-choice quizzes (4 options per question)
- Quiz creation with permission-based access
- Quiz taking with real-time validation
- Score tracking and leaderboards
- Like system for quizzes

### 2.4 Social Features

- Comments on questions
- Likes on quizzes
- User following system

## 3. Database Schema

### 3.1 Tables

```sql
-- Users table
users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    avatar TEXT,
    banner TEXT,
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)

-- Communities table
communities (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    subject VARCHAR(100) NOT NULL,
    creator_id UUID REFERENCES users(id),
    allow_public_quiz_submission BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)

-- Community members table
community_members (
    id UUID PRIMARY KEY,
    community_id UUID REFERENCES communities(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(20) DEFAULT 'member', -- 'creator', 'admin', 'member'
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(community_id, user_id)
)

-- Quizzes table
quizzes (
    id UUID PRIMARY KEY,
    community_id UUID REFERENCES communities(id),
    creator_id UUID REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)

-- Questions table
questions (
    id UUID PRIMARY KEY,
    quiz_id UUID REFERENCES quizzes(id),
    picture TEXT,
    question_text TEXT NOT NULL,
    correct_answer TEXT,
    explanation TEXT,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
)
options (
    id UUID PRIMARY KEY,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,

)
user_answers (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users (id),
    question_id UUID REFERENCES questions (id),
    option_id UUID REFERENCES options (id),
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE (user_id, question_id)
);

-- Quiz attempts table
quiz_attempts (
    id UUID PRIMARY KEY,
    quiz_id UUID REFERENCES quizzes(id),
    user_id UUID REFERENCES users(id),
    score INTEGER,
    total_questions INTEGER,
    percentage DECIMAL(5,2),
    time_taken_seconds INTEGER,
    completed_at TIMESTAMP DEFAULT NOW()
)

-- Question comments table
question_comments (
    id UUID PRIMARY KEY,
    question_id UUID REFERENCES questions(id),
    user_id UUID REFERENCES users(id),
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)

-- Quiz likes table
quiz_likes (
    id UUID PRIMARY KEY,
    quiz_id UUID REFERENCES quizzes(id),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(quiz_id, user_id)
)
```

## 4. Backend API Endpoints

### 4.1 Authentication

```
POST   /api/auth/google           - Initiate Google OAuth
GET    /api/auth/google/callback  - Google OAuth callback
POST   /api/auth/logout           - Logout user
```

### 4.2 Users

```
GET    /api/users/:id             - Get user profile
PUT    /api/users/:id             - Update user profile
GET    /api/auth/me               - Get current user info
```

### 4.3 Communities

```
GET    /api/communities           - List all communities
POST   /api/communities           - Create new community
GET    /api/communities/:id       - Get community details
PUT    /api/communities/:id       - Update community
DELETE /api/communities/:id       - Delete community
POST   /api/communities/:id/join  - Join community
POST   /api/communities/:id/leave - Leave community
POST   /api/communities/:id/members/:userId/role - Update member role
```

### 4.4 Quizzes

```
GET    /api/quizzes               - List all quizzes (with filters)
POST   /api/quizzes               - Create new quiz
GET    /api/quizzes/:id           - Get quiz details
PUT    /api/quizzes/:id           - Update quiz
DELETE /api/quizzes/:id           - Delete quiz
POST   /api/quizzes/:id/like      - Like a quiz
DELETE /api/quizzes/:id/like      - Unlike a quiz
```

### 4.5 Quiz Attempts

```
POST   /api/quizzes/:id/start     - Start quiz attempt
POST   /api/quizzes/:id/submit    - Submit quiz answers
GET    /api/quizzes/:id/attempts  - Get quiz attempts
GET    /api/quizzes/:id - Get quiz details and the results
```

### 4.6 Questions

```
GET    /api/questions/:id/comments - Get question comments
POST   /api/questions/:id/comments - Add comment to question
PUT    /api/comments/:id          - Update comment
DELETE /api/comments/:id          - Delete comment
```

## 5. Frontend Pages Structure

### 5.1 Public Pages

```
/                   - Intro page (marketing)
/community/:id      - Community public view
```

### 5.2 Authenticated Pages

```
/home               - Dashboard with recommendations
/community/:id      - Community details (member view)
/community/create   - Create new community
/community/:id/settings - Community settings
/quiz/create        - Create new quiz
/quiz/:id           - Quiz details page
/quiz/:id/take      - Take quiz interface
/quiz/:id/results   - Quiz results
/quiz/:id/leaderboard - Quiz leaderboard
/profile            - User's own profile
/profile/:id        - Other user's profile
/search             - Search page
```

### 5.3 Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Input.tsx
│   ├── quiz/
│   │   ├── QuestionCard.tsx
│   │   ├── QuizCard.tsx
│   │   ├── QuizTimer.tsx
│   │   └── ResultCard.tsx
│   ├── community/
│   │   ├── CommunityCard.tsx
│   │   └── MemberList.tsx
│   └── profile/
│       ├── AvatarUpload.tsx
│       └── StatsCard.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── QuizPage.tsx
│   ├── CommunityPage.tsx
│   └── ProfilePage.tsx
├── services/
│   ├── api.ts
│   ├── auth.ts
│   └── quiz.ts
├── hooks/
│   ├── useAuth.ts
│   └── useQuiz.ts
├── store/
│   ├── authSlice.ts
│   └── quizSlice.ts
└── utils/
    ├── constants.ts
    └── helpers.ts
```

## 6. Detailed Feature Specifications

### 6.1 User Authentication Flow

1. User clicks "Sign in with Google"
2. Redirect to Google OAuth consent screen
3. Backend validates and creates/updates user
4. JWT token issued and stored securely
5. User redirected to home page

### 6.2 Community Creation & Management

**Community Settings:**

- Name, description, subject category
- Privacy: Public/Private
- Quiz submission permissions:
  - Everyone can submit
  - Only admins can submit
  - Specific members can submit
- Community banner image

**Admin Features:**

- Add/remove members
- Promote to admin

### 6.3 Quiz Taking Experience

1. User selects a quiz
2. Quiz instructions and duration shown
3. Questions presented one at a time
4. Timer visible (if timed quiz)
5. Navigation between questions
6. Submit button at the end
7. Instant results with:
   - Score and percentage
   - Correct/incorrect answers
   - Explanation for each question
   - Comparison with top scores

### 6.4 Recommendation System

**Home page recommendations based on:**

- Communities user follows
- User's past quiz performance
- New quizzes from followed creators
- Quizzes in user's interest categories

### 6.5 Profile Features

**Profile includes:**

- Customizable avatar and banner
- Statistics dashboard:
  - Total quizzes taken
  - Average score
  - Best score
  - Community count
- Created quizzes list
- Quiz attempts history
- Followed communities

## 7. API Response Examples

### 7.1 Quiz Response

```json
{
  "id": "uuid",
  "title": "JavaScript Basics",
  "description": "Test your JS knowledge",
  "community": {
    "id": "uuid",
    "name": "Web Dev Learners",
    "subject": "Programming"
  },
  "creator": {
    "id": "uuid",
    "username": "js_expert",
    "avatar": "url"
  },
  "duration_minutes": 30,
  "likes_count": 150,
  "question_count": 20,
  "avg_score": 75.5,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### 7.2 Quiz Attempt Submission

```json
{
  "quiz_id": "uuid",
  "answers": [
    {
      "question_id": "uuid",
      "selected_option": "a"
    }
  ]
}
```

## 8. Deployment Strategy

### 8.1 Backend Deployment (Golang)

- **Platform:** AWS EC2, Google Cloud Run, or DigitalOcean Droplet
- **Database:** Managed PostgreSQL (AWS RDS, Google Cloud SQL)
- **Environment Variables:**
  ```
  DATABASE_URL=postgresql://...
  GOOGLE_CLIENT_ID=...
  GOOGLE_CLIENT_SECRET=...
  JWT_SECRET=...
  FRONTEND_URL=...
  ```
- **Dockerfile:**
  ```dockerfile
  FROM golang:1.21-alpine
  WORKDIR /app
  COPY go.mod go.sum ./
  RUN go mod download
  COPY . .
  RUN go build -o main .
  EXPOSE 8080
  CMD ["./main"]
  ```

### 8.2 Frontend Deployment (React/Vite)

- **Platform:** Vercel, Netlify, or AWS Amplify
- **Build Command:** `npm run build`
- **Environment Variables:**
  ```
  VITE_API_URL=https://api.ecoquiz.com
  VITE_GOOGLE_CLIENT_ID=...
  ```

### 8.3 CI/CD Pipeline

- GitHub Actions for automated testing
- Automated deployments on push to main
- Database migrations on deploy
- Health check endpoints

## 9. Development Phases

### Phase 1: Foundation (Week 1-2)

- Set up Go project with Gin
- Configure PostgreSQL with pgx
- Implement Google OAuth
- Create basic user models and APIs
- Set up React Vite with TypeScript
- Implement authentication flow

### Phase 2: Core Features (Week 3-4)

- Community CRUD operations
- Quiz creation system
- Basic quiz taking interface
- Score calculation
- User profiles

### Phase 3: Advanced Features (Week 5-6)

- Comments system
- Like functionality
- Leaderboards
- Recommendation engine
- Community permissions
- Admin controls

### Phase 4: Polish & Deployment (Week 7-8)

- UI/UX improvements
- Performance optimization
- Testing
- Deployment setup
- Documentation

## 10. Success Metrics

### 10.1 Technical Metrics

- API response time < 200ms
- Page load time < 2 seconds
- 99.9% uptime
- Zero critical bugs in production

### 10.2 User Metrics

- User registration completion rate > 70%
- Quiz completion rate > 80%
- Return rate > 60%
- Average session duration > 10 minutes

## 11. Future Enhancements (Post-MVP)

### 11.1 Features

- Mobile app (React Native)
- Real-time quiz competitions
- Quiz sharing on social media
- Achievement badges
- Quiz categories and tags
- Offline quiz taking
- Voice-based questions
- Video explanations
- Group quiz challenges
- Quiz marketplace (premium quizzes)

### 11.2 Technical

- Redis caching for leaderboards
- Elasticsearch for quiz/search
- WebSocket for real-time features
- CDN for media assets
- Advanced analytics dashboard
- A/B testing framework

---

## Project Setup Commands

### Backend Setup

```bash
# Initialize Go module
go mod init ecoquiz-backend

# Install dependencies
go get -u github.com/gin-gonic/gin
go get -u github.com/jackc/pgx/v5
go get -u golang.org/x/oauth2

# Create project structure
mkdir -p cmd api internal/pkg/{auth,db,models,handlers,middleware} migrations
```

### Frontend Setup

```bash
# Create React app with Vite
npm create vite@latest ecoquiz-frontend -- --template react-ts

# Install dependencies
cd ecoquiz-frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npm install axios react-router-dom react-hook-form @hookform/resolvers yup
npm install @headlessui/react heroicons-react

# Initialize Tailwind
npx tailwindcss init -p
```

This PRD provides a comprehensive roadmap for building ecoQuiz from zero to deployment. Each component is designed to be modular and scalable, allowing for iterative development and easy maintenance.
