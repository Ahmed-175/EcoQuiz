package services

import (
	"context"
	dto_user "ecoquiz/internal/dto/user"
	"ecoquiz/internal/repos"
	"ecoquiz/internal/utils"
	"errors"
	"fmt"
	"mime/multipart"
)

type UserService struct {
	userRepo repos.UserRepo
	commRepo repos.CommunityRepo
	quizRepo repos.QuizRepo
}

func NewUserService(userRepo repos.UserRepo, commRepo repos.CommunityRepo, quizRepo repos.QuizRepo) *UserService {
	return &UserService{
		userRepo: userRepo,
		commRepo: commRepo,
		quizRepo: quizRepo,
	}
}

func (s *UserService) Profile(ctx context.Context, userID string) (*dto_user.Profile, error) {
	existUser, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, errors.New("failed to get the Profile user")
	}

	ProfileRes := dto_user.Profile{
		Username:    existUser.Username,
		Email:       existUser.Email,
		ID:          existUser.ID,
		Avatar:      existUser.Avatar,
		Banner:      existUser.Banner,
		Communities: make([]dto_user.Community, 0),
		Attempts:    make([]dto_user.Attempt, 0),
		CreatedAt:   existUser.CreatedAt,
	}

	// Fetch communities with full details
	communities, err := s.commRepo.FindUserCommunitiesWithDetails(ctx, userID)
	if err == nil {
		for _, c := range communities {
			community := dto_user.Community{
				ID:              c.ID,
				Name:            c.Name,
				JoinIn:          c.JoinedAt,
				NumberOfQuizzes: c.NumberOfQuizzes,
				Role:            c.Role,
				MemberRole:      c.MemberRole,
				MemberCount:     c.MemberCount,
			}
			ProfileRes.Communities = append(ProfileRes.Communities, community)
		}
	}

	// Fetch user attempts with quiz details
	attempts, err := s.quizRepo.FindAttemptsByUserID(ctx, userID)
	if err == nil {
		for _, a := range attempts {
			attempt := dto_user.Attempt{
				Quiz: dto_user.Quiz{
					ID:             a.Quiz.ID,
					Title:          a.Quiz.Title,
					QuestionsCount: a.Quiz.QuestionsCount,
				},
				Score:            a.Score,
				TimeTakenMinutes: a.TimeTakenMinutes,
				AttemptNumber:    a.AttemptNumber,
				Percentage:       int(a.Percentage),
				CompletedAt:      a.CompletedAt,
			}
			ProfileRes.Attempts = append(ProfileRes.Attempts, attempt)
		}
	}

	return &ProfileRes, nil
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
