package models

import (
	"database/sql"
	"time"
)

type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	Username     string    `json:"username"`
	Avatar       *string   `json:"avatar"`
	Banner       *string   `json:"banner"`
	PasswordHash sql.NullString    `json:"-"`
	GoogleID     string    `json:"google_id"`
	CreatedAt    time.Time `json:"created_at"`
	Updated_at   time.Time `json:"updated_at"`
}
