package dto_user

import (
	"ecoquiz/internal/models"
)

func UserMapperResponse(user *models.User) *Profile {
	return &Profile{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		Avatar:    user.Avatar,
		Banner:    user.Banner,
		CreatedAt: user.CreatedAt,
	}
}
