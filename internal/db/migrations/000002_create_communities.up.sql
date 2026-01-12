CREATE TABLE communities  (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    banner TEXT ,
    subject VARCHAR(100) NOT NULL,
    creator_id UUID REFERENCES users(id),
    allow_public_quiz_submission BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);