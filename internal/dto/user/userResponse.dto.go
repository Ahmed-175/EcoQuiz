package dto_user

import "time"

type Profile struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Username  string    `json:"username"`
	Avatar    *string    `json:"avatar"`
	Banner    *string   `json:"banner"`
	CreatedAt time.Time `json:"created_id"`
}
