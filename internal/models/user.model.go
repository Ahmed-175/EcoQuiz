package models

import "time"

type User struct {
	ID         string    `json:"id"`
	Email      string    `json:"email"`
	Username   string    `json:"username"`
	Avatar     *string    `json:"avatar"`
	Banner     *string   `json:"banner"`
	GoogleID   string    `json:"google_id"`
	CreatedAt  time.Time `json:"created_id"`
	Updated_at time.Time `json:"updated_at"`
}
