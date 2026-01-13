package models

import "time"

type Community struct {
	ID                        string    `json:"id"`
	Name                      string    `json:"name"`
	Description               *string   `json:"description"`
	Banner                    *string   `json:"banner"`
	CreatorID                 string    `json:"creator_id"`
	AllowPublicQuizSubmission bool      `json:"allow_public_quiz_submission"`
	CreatedAt                 time.Time `json:"created_at"`
	UpdatedAt                 time.Time `json:"updated_at"`
}
