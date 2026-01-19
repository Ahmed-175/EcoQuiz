package services

import (
	"context"
	dto_community "ecoquiz/internal/dto/community"
	"ecoquiz/internal/repos"
	"ecoquiz/internal/utils"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
)

type CommunityService struct {
	communityRepo repos.CommunityRepo
	userRepo      repos.UserRepo
	quizRepo      repos.QuizRepo
}

func NewCommunityService(communityRepo repos.CommunityRepo, userRepo repos.UserRepo, quizRepo repos.QuizRepo) *CommunityService {
	return &CommunityService{
		communityRepo: communityRepo,
		userRepo:      userRepo,
		quizRepo:      quizRepo,
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

func (s *CommunityService) GetAllCommunities(ctx context.Context, userID string) (*dto_community.GetAllCommunitiesRes, error) {
	comms, err := s.communityRepo.FindAll(ctx)
	if err != nil {
		return nil, errors.New("failed to get communities: " + err.Error())
	}

	var commsList []dto_community.CommunityDetailRes
	for _, c := range comms {
		community := dto_community.CommunityDetailRes{
			ID:                        c.ID,
			Name:                      c.Name,
			Description:               c.Description.String,
			AllowPublicQuizSubmission: c.AllowPublicQuizSubmission,
			Banner:                    c.Banner.String,
			CreatedAt:                 utils.FormatTime(c.CreatedAt),
		}

		// Fetch Creator
		creator, err := s.userRepo.FindByID(ctx, c.CreatorID)
		if err == nil {
			community.Creator = dto_community.Creator{
				ID:       creator.ID,
				Username: creator.Username,
				Avatar:   creator.Avatar,
				Email:    creator.Email,
			}
		}

		// Fetch Counts
		memberCount, _ := s.communityRepo.CountMembers(ctx, c.ID)
		quizCount, _ := s.communityRepo.CountQuizzes(ctx, c.ID)
		community.NumberOfMembers = memberCount
		community.NumberOfQuizzes = quizCount

		// Fetch User Role
		community.MemberRole = "NON_MEMBER"

		fmt.Println("user id : " + userID)
		if userID != "" {
			role, err := s.communityRepo.UserRole(ctx, c.ID, userID)

			if err == nil {
				switch role {
				case "creator":
					community.MemberRole = "CREATOR"
				case "admin":
					community.MemberRole = "ADMIN"
				case "member":
					community.MemberRole = "MEMBER"
				}
			}
		}

		// Fetch Members
		members, err := s.communityRepo.FindMembersWithRole(ctx, c.ID)
		if err == nil {
			community.Members = members
		}

		commsList = append(commsList, community)
	}

	return &dto_community.GetAllCommunitiesRes{
		Communities: &commsList,
	}, nil
}

func (s *CommunityService) GetCommunityByID(
	ctx context.Context,
	commID string,
	userID string,
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

	// Fetch Creator Details
	creator, err := s.userRepo.FindByID(ctx, comm.CreatorID)
	if err == nil {
		res.Community.Creator = dto_community.Creator{
			ID:       creator.ID,
			Username: creator.Username,
			Avatar:   creator.Avatar,
			Email:    creator.Email,
		}
	}

	// Fetch Counts
	memberCount, _ := s.communityRepo.CountMembers(ctx, commID)
	res.Community.NumberOfMembers = memberCount

	quizCount, _ := s.communityRepo.CountQuizzes(ctx, commID)
	res.Community.NumberOfQuizzes = quizCount

	// Fetch User Role
	res.Community.MemberRole = "NON_MEMBER"
	if userID != "" {
		role, err := s.communityRepo.UserRole(ctx, commID, userID)
		if err == nil {
			switch role {
			case "creator":
				res.Community.MemberRole = "CREATOR"
			case "admin":
				res.Community.MemberRole = "ADMIN"
			case "member":
				res.Community.MemberRole = "MEMBER"
			default:
				res.Community.MemberRole = "NON_MEMBER"
			}
		}
	}

	members, err := s.communityRepo.FindMembersWithRole(ctx, commID)
	if err != nil {
		return nil, errors.New("failed to get community members")
	}
	res.Community.Members = members

	quizzes, err := s.quizRepo.FindQuizzesByCommunityIDWithCount(ctx, commID)
	for i , q := range quizzes {
		quizzes[i].IsLike, _ = s.quizRepo.IsLike(ctx, q.ID, userID)
	}
	if err != nil{
		return nil, errors.New("failed to get community quizzes")
	}
	if quizzes == nil {
		res.Quizzes = []dto_community.Quiz{}
	} else {
		res.Quizzes = quizzes
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

func (s *CommunityService) UpdateMemberRole(ctx context.Context, requesterID, commID, targetUserID, newRole string) error {
	comm, err := s.communityRepo.FindByID(ctx, commID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return errors.New("community does not exist")
		}
		return errors.New("failed to get community")
	}

	if comm.CreatorID != requesterID {
		return errors.New("unauthorized: only the creator can change member roles")
	}

	if targetUserID == comm.CreatorID {
		return errors.New("cannot change role of the creator")
	}

	// Verify target user is a member
	_, err = s.communityRepo.UserRole(ctx, commID, targetUserID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return errors.New("target user is not a member of this community")
		}
		return errors.New("failed to check target user membership")
	}

	if err := s.communityRepo.UpdateMemberRole(ctx, commID, targetUserID, newRole); err != nil {
		return errors.New("failed to update member role: " + err.Error())
	}

	return nil
}
