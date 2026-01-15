package services

import (
	"context"
	"database/sql"

	"ecoquiz/internal/models"
	"ecoquiz/internal/repos"
	"ecoquiz/internal/utils"
	"errors"
	"math/rand"
	"strconv"
	"time"

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

func (s *AuthService) Register(ctx context.Context, username string, email string, password string) (string, error) {
	if _, err := s.userRepo.FindByEmail(ctx, email); err == nil {
		return "", errors.New("user already exists")
	}
	rand.Seed(time.Now().UnixNano())
	GoogleID := strconv.Itoa(rand.Int())

	var user = &models.User{
		Username:     username,
		Email:        email,
		PasswordHash: sql.NullString{String: password, Valid: true},
		GoogleID:     GoogleID,
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return "", errors.New("Failed to Register" + err.Error())
	}
	return utils.GenerateToken(user.Email, user.ID, s.jwtSecret)
}

func (s *AuthService) Login(ctx context.Context, email string, password string) (string, error) {
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return "", errors.New("invalid email or password" + err.Error())
	}
	if password != user.PasswordHash.String {
		return "", errors.New("invalid email or password")
	}
	return utils.GenerateToken(user.Email, user.ID, s.jwtSecret)
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
				PasswordHash: sql.NullString{String:  "" , Valid: false},
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
