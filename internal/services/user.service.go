package services

import (
	"context"
	dto_user "ecoquiz/internal/dto/user"
	"ecoquiz/internal/models"
	"ecoquiz/internal/repos"
	"ecoquiz/internal/utils"
	"fmt"
	"mime/multipart"
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

func (s *UserService) UpdateAvatar(ctx context.Context, userID string, file *multipart.FileHeader) (string, error) {
	if file.Size > 2<<20 {
		return "", fmt.Errorf("file too large")
	}

	avatarURL, err := utils.SaveImage(file, "avatars")
	if err != nil {
		return "", err
	}

	if err := s.userRepo.UpdateAvatar(ctx, avatarURL, userID); err != nil {
		return "", err
	}
	return avatarURL, nil
}

func (s *UserService) UpdateBanner(ctx context.Context, userID string, file *multipart.FileHeader) (string, error) {
	if file.Size > 2<<20 {
		return "", fmt.Errorf("file too large")
	}

	BannerURL, err := utils.SaveImage(file, "banners")
	if err != nil {
		return "", err
	}

	if err := s.userRepo.UpdateBanner(ctx, BannerURL, userID); err != nil {
		return "", err
	}
	return BannerURL, nil
}
