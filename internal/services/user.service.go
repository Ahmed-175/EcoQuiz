package services

import (
	"context"
	dto_user "ecoquiz/internal/dto/user"
	"ecoquiz/internal/models"
	"ecoquiz/internal/repos"
)

type UserService struct {
	userRepo repos.UserRepo
}

func NewUserService(userRepo repos.UserRepo) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}

func (s *UserService) Profile(ctx context.Context, userID string, user *models.User) error {
	existUser, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err
	}
	*user = *existUser
	return nil
}

func (s *UserService) UpdateUser(ctx context.Context, updateUser *dto_user.UpdateUserRequest, userID string) error {

	err := s.userRepo.Update(ctx, updateUser.Avatar, updateUser.Banner, updateUser.Username, userID)
	return err
}
