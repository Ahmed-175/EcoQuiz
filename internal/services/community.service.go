package services

import (
	"context"
	dto_community "ecoquiz/internal/dto/community"
	"ecoquiz/internal/repos"
	"ecoquiz/internal/utils"
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

func (s *CommunityService) GetAllCommunities(ctx context.Context) (*dto_community.GetAllCommunitiesRes, error) {
	comms, err := s.communityRepo.FindAll(ctx)
	if err != nil {
		return nil, errors.New("failed to get communities: " + err.Error())
	}
	return utils.TransformTime(comms), nil
}

func (s *CommunityService) GetCommunityByID(
	ctx context.Context,
	commID string,
) (*dto_community.GetCommunityByIDRes, error) {

	comm, err := s.communityRepo.FindByID(ctx, commID)
	if err == pgx.ErrNoRows {
		return nil, errors.New("community does not exist")
	}
	if err != nil {
		return nil, errors.New("failed to get community")
	}

	res := &dto_community.GetCommunityByIDRes{
		Community: *utils.TransformSingleCommunity(comm),
	}

	return res, nil
}

func (s *CommunityService) JoinCommunity(ctx context.Context, userID, commID string) (string, error) {
	comm, err := s.communityRepo.FindByID(ctx, commID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return "", errors.New("community does not exist")
		}
		return "", errors.New("failed to get community")
	}

	if comm.CreatorID == userID {
		return "", errors.New("creator cannot join or leave their own community")
	}

	_, err = s.communityRepo.UserRole(ctx, commID, userID)
	if err != nil {
		if err == pgx.ErrNoRows {
			if err := s.communityRepo.AddMember(ctx, commID, userID, "member"); err != nil {
				return "", errors.New("failed to join community: " + err.Error())
			}
			return "joined", nil
		}
		return "", errors.New("failed to check membership")
	}
	if err := s.communityRepo.RemoveMember(ctx, commID, userID); err != nil {
		return "", errors.New("failed to leave community: " + err.Error())
	}
	return "left", nil
}
