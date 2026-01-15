package models

import "time"

// question_comments (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
//     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//     comment_text TEXT NOT NULL,
//     created_at TIMESTAMP NOT NULL DEFAULT NOW(),
//     updated_at TIMESTAMP NOT NULL DEFAULT NOW()
// );

type QuestionComment struct {
	ID          string    `json:"id"`
	QuestionID  string    `json:"question_id"`
	UserID      string    `json:"user_id"`
	CommentText string    `json:"comment_text"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
