package services

import (
	"context"
	dto_community "ecoquiz/internal/dto/community"
	"ecoquiz/internal/repos"
	"errors"

	"github.com/jackc/pgx/v5"
)

type CommunityService struct {
	communityRepo repos.CommunityRepo
	userRepo      repos.UserRepo
}

func NewCommunityService(communityRepo repos.CommunityRepo, userRepo repos.UserRepo) *CommunityService {
	return &CommunityService{
		communityRepo: communityRepo,
		userRepo:      userRepo,
	}
}

func (s *CommunityService) CreateCommunity(ctx context.Context, req *dto_community.CreateCommunityReq, userID string) (string, error) {
	_, err := s.userRepo.FindByID(ctx, userID)
	if err == pgx.ErrNoRows {
		return "", errors.New("the user is not exist")
	}
	if err != nil {
		return "", errors.New("Failed to get user")
	}
	comm := dto_community.MapperCreateCommunityReq(req)
	comm.CreatorID = userID
	if err := s.communityRepo.Create(ctx, comm); err != nil {
		return "", errors.New("Failed to Create new Community")
	}

	if err := s.communityRepo.AddMember(ctx, comm.ID, userID, "creator"); err != nil {
		return "", errors.New("Failed to add user as member to community" + err.Error())
	}
	return comm.ID, nil
}
