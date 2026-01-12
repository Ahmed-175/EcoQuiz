CREATE TABLE question_comments (
    id UUID PRIMARY KEY,
    question_id UUID REFERENCES questions(id),
    user_id UUID REFERENCES users(id),
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)