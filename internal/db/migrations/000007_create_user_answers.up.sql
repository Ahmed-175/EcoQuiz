CREATE TABLE user_answers (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users (id),
    question_id UUID REFERENCES questions (id),
    option_id UUID REFERENCES options (id),
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE (user_id, question_id)
);