-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- Users
-- =====================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT,
    avatar TEXT,
    banner TEXT,
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================
-- Communities
-- =====================
CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    banner TEXT,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    allow_public_quiz_submission BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================
-- Community Members
-- =====================
CREATE TABLE community_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (community_id, user_id),
    CHECK (role IN ('creator', 'admin', 'member'))
);

-- =====================
-- Quizzes
-- =====================
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration_minutes INTEGER CHECK (duration_minutes > 0),
    likes_count INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT false,
    average_score DECIMAL(5,2) NOT NULL DEFAULT 0,
    students_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================
-- Questions
-- =====================
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    explanation TEXT,
    correct_answer TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (quiz_id, order_index)
);

-- =====================
-- Options
-- =====================
CREATE TABLE options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

-- =====================
-- Quiz Attempts
-- =====================
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    time_taken_minutes INTEGER CHECK (time_taken_minutes >= 0),
    attempt_number INTEGER NOT NULL DEFAULT 1,
    completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (quiz_id, user_id, attempt_number)
);

-- =====================
-- User Answers
-- =====================
CREATE TABLE user_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES options(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (attempt_id, question_id)
);

-- =====================
-- Question Comments
-- =====================
CREATE TABLE question_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================
-- Quiz Likes
-- =====================
CREATE TABLE quiz_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (quiz_id, user_id)
);

-- =====================
-- Indexes (Performance)
-- =====================
CREATE INDEX idx_quizzes_community_id ON quizzes(community_id);
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_options_question_id ON options(question_id);
CREATE INDEX idx_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);
