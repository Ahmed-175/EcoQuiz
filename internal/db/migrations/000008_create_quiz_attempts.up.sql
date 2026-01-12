CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY,
    quiz_id UUID REFERENCES quizzes(id),
    user_id UUID REFERENCES users(id),
    score INTEGER,
    total_questions INTEGER,
    percentage DECIMAL(5,2),
    time_taken_seconds INTEGER,
    completed_at TIMESTAMP DEFAULT NOW()
)
