CREATE TABLE quiz_likes (
    id UUID PRIMARY KEY,
    quiz_id UUID REFERENCES quizzes(id),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(quiz_id, user_id)
)
