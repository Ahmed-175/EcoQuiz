CREATE TABLE options (
    id UUID PRIMARY KEY,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL ,
    is_correct BOOLEAN DEFAULT FALSE
);