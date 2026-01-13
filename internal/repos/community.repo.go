package repos

import (
	"context"
	"ecoquiz/internal/models"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CommunityRepo interface {
	Create(ctx context.Context, comm *models.Community) error
	FindByID(ctx context.Context, id string) (*models.Community, error)
	FindAll(ctx context.Context) ([]*models.Community, error)
	FindByCreatorID(ctx context.Context, creatorID string) ([]models.Community, error)
	DeleteCommunityByID(ctx context.Context, commID string) error
	UpdateCommunity(ctx context.Context, comm *models.Community) error

	AddMember(ctx context.Context, commID, userID, role string) error
	RemoveMember(ctx context.Context, commID, userID string) error
	UpdateMemberRole(ctx context.Context, commID, userID, role string) error

	FindMembersByUserID(ctx context.Context, userID string) ([]models.Community, error)
	FindMembersByRoles(ctx context.Context, commID string, roles []string) ([]models.User, error)
}

type communityRepo struct {
	db *pgxpool.Pool
}

// Constructor
func NewCommunityRepo(db *pgxpool.Pool) CommunityRepo {
	return &communityRepo{
		db: db,
	}
}

///////////////////////////////////////////////////////////
// Community CRUD
///////////////////////////////////////////////////////////

func (r *communityRepo) Create(ctx context.Context, comm *models.Community) error {
	query := `
		INSERT INTO communities (name, description, banner, creator_id, allow_public_quiz_submission)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at, updated_at
	`

	return r.db.QueryRow(
		ctx,
		query,
		comm.Name,
		comm.Description,
		comm.Banner,
		comm.CreatorID,
		comm.AllowPublicQuizSubmission,
	).Scan(&comm.ID, &comm.CreatedAt, &comm.UpdatedAt)
}
func (r *communityRepo) FindAll(ctx context.Context) ([]*models.Community, error) {
	query := `
	  SELECT 
	    id, 
	    name, 
	    description, 
	    banner, 
	    creator_id, 
	    allow_public_quiz_submission,
	    created_at, 
	    updated_at  
	  FROM communities;
	`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, errors.New("failed to get all communities: " + err.Error())
	}
	defer rows.Close()

	var communities []*models.Community

	for rows.Next() {
		comm := &models.Community{}
		if err := rows.Scan(
			&comm.ID,
			&comm.Name,
			&comm.Description,
			&comm.Banner,
			&comm.CreatorID,
			&comm.AllowPublicQuizSubmission,
			&comm.CreatedAt,
			&comm.UpdatedAt,
		); err != nil {
			return nil, errors.New("failed to scan community: " + err.Error())
		}

		communities = append(communities, comm)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.New("rows iteration error: " + err.Error())
	}

	return communities, nil
}

func (r *communityRepo) FindByID(ctx context.Context, id string) (*models.Community, error) {
	query := `
		SELECT id, name, description, banner, creator_id,
		       allow_public_quiz_submission, created_at, updated_at
		FROM communities
		WHERE id = $1
	`

	var comm models.Community
	err := r.db.QueryRow(ctx, query, id).Scan(
		&comm.ID,
		&comm.Name,
		&comm.Description,
		&comm.Banner,
		&comm.CreatorID,
		&comm.AllowPublicQuizSubmission,
		&comm.CreatedAt,
		&comm.UpdatedAt,
	)

	if err == pgx.ErrNoRows {
		return nil, errors.New("community not found")
	}

	return &comm, err
}

func (r *communityRepo) FindByCreatorID(ctx context.Context, creatorID string) ([]models.Community, error) {
	query := `
		SELECT id, name, description, banner, creator_id,
		       allow_public_quiz_submission, created_at, updated_at
		FROM communities
		WHERE creator_id = $1
	`

	rows, err := r.db.Query(ctx, query, creatorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var communities []models.Community
	for rows.Next() {
		var comm models.Community
		if err := rows.Scan(
			&comm.ID,
			&comm.Name,
			&comm.Description,
			&comm.Banner,
			&comm.CreatorID,
			&comm.AllowPublicQuizSubmission,
			&comm.CreatedAt,
			&comm.UpdatedAt,
		); err != nil {
			return nil, err
		}
		communities = append(communities, comm)
	}

	return communities, nil
}

func (r *communityRepo) UpdateCommunity(ctx context.Context, comm *models.Community) error {
	query := `
		UPDATE communities
		SET name = $1,
		    description = $2,
		    banner = $3,
		    allow_public_quiz_submission = $4,
		    updated_at = NOW()
		WHERE id = $5
	`

	_, err := r.db.Exec(
		ctx,
		query,
		comm.Name,
		comm.Description,
		comm.Banner,
		comm.AllowPublicQuizSubmission,
		comm.ID,
	)

	return err
}

func (r *communityRepo) DeleteCommunityByID(ctx context.Context, commID string) error {
	query := `DELETE FROM communities WHERE id = $1`
	_, err := r.db.Exec(ctx, query, commID)
	return err
}

///////////////////////////////////////////////////////////
// Community Members
///////////////////////////////////////////////////////////

func (r *communityRepo) AddMember(ctx context.Context, commID, userID, role string) error {
	query := `
		INSERT INTO community_members (community_id, user_id, role)
		VALUES ($1, $2, $3)
		ON CONFLICT (community_id, user_id) DO NOTHING
	`

	_, err := r.db.Exec(ctx, query, commID, userID, role)
	return err
}

func (r *communityRepo) RemoveMember(ctx context.Context, commID, userID string) error {
	query := `
		DELETE FROM community_members
		WHERE community_id = $1 AND user_id = $2
	`

	_, err := r.db.Exec(ctx, query, commID, userID)
	return err
}

func (r *communityRepo) UpdateMemberRole(ctx context.Context, commID, userID, role string) error {
	query := `
		UPDATE community_members
		SET role = $1
		WHERE community_id = $2 AND user_id = $3
	`

	_, err := r.db.Exec(ctx, query, role, commID, userID)
	return err
}

///////////////////////////////////////////////////////////
// Queries
///////////////////////////////////////////////////////////

// for returning the user profile and get all communties

func (r *communityRepo) FindMembersByUserID(ctx context.Context, userID string) ([]models.Community, error) {
	query := `
		SELECT c.id, c.name, c.description, c.banner,
		       c.creator_id, c.allow_public_quiz_submission,
		       c.created_at, c.updated_at
		FROM communities c
		JOIN community_members cm ON cm.community_id = c.id
		WHERE cm.user_id = $1
	`

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var communities []models.Community
	for rows.Next() {
		var comm models.Community
		if err := rows.Scan(
			&comm.ID,
			&comm.Name,
			&comm.Description,
			&comm.Banner,
			&comm.CreatorID,
			&comm.AllowPublicQuizSubmission,
			&comm.CreatedAt,
			&comm.UpdatedAt,
		); err != nil {
			return nil, err
		}
		communities = append(communities, comm)
	}

	return communities, nil
}

func (r *communityRepo) FindMembersByRoles(ctx context.Context, commID string, roles []string) ([]models.User, error) {
	query := `
		SELECT u.id, u.username, u.email, u.created_at
		FROM users u
		JOIN community_members cm ON cm.user_id = u.id
		WHERE cm.community_id = $1
		  AND cm.role = ANY($2)
	`

	rows, err := r.db.Query(ctx, query, commID, roles)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		if err := rows.Scan(
			&user.ID,
			&user.Username,
			&user.Email,
			&user.CreatedAt,
		); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}
