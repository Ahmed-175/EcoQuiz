package services

import (
	"context"
	"ecoquiz/internal/models"
	"ecoquiz/internal/repos"
	"ecoquiz/internal/utils"

	"github.com/golang-jwt/jwt"
	"github.com/jackc/pgx/v5"
)

type AuthService struct {
	userRepo  repos.UserRepo
	jwtSecret string
}

func NewAuthService(userRepo repos.UserRepo, jwtSecret string) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
	}
}

func (s *AuthService) GoogleHandle(ctx context.Context, claims jwt.MapClaims) (string, error) {
	email := claims["email"].(string)

	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if err == pgx.ErrNoRows {
			user = &models.User{
				Username: claims["name"].(string),
				Email:    email,
				GoogleID: claims["sub"].(string),
				Avatar:   claims["picture"].(string),
			}
			err := s.userRepo.Create(ctx, user)
			if err != nil {
				return "", err
			}
		} else {
			return "", err
		}
	}
	return utils.GenerateToken(user.Email, user.ID, s.jwtSecret)
}
