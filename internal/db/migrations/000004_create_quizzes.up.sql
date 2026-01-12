CREATE TABLE quizzes (
    id UUID PRIMARY KEY,
    community_id UUID REFERENCES communities (id),
    creator_id UUID REFERENCES users (id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    likes_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)