CREATE TABLE questions (
    id UUID PRIMARY KEY,
    quiz_id UUID REFERENCES quizzes(id),
    question_text TEXT NOT NULL,
    explanation TEXT,
    order_index INT,
    created_at TIMESTAMP DEFAULT now()
);