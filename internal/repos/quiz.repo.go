package repos

import (
	"context"
	"errors"
	"time"

	"ecoquiz/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type QuizRepo interface {
	CreateTx(ctx context.Context, quiz *models.Quiz, tx pgx.Tx) error
	GetAllQuizzes(ctx context.Context) ([]models.Quiz, error)
	FindByID(ctx context.Context, id string) (*models.Quiz, error)
	Update(ctx context.Context, quiz *models.Quiz) error
	Delete(ctx context.Context, id string) error
	FindByCommunityID(ctx context.Context, communityID string) ([]*models.Quiz, error)
	BeginTx(ctx context.Context) (pgx.Tx, error)
}

type quizRepo struct {
	db *pgxpool.Pool
}

func NewQuizRepo(db *pgxpool.Pool) QuizRepo {
	return &quizRepo{db: db}
}
func (r *quizRepo) BeginTx(ctx context.Context) (pgx.Tx, error) {
	return r.db.BeginTx(ctx, pgx.TxOptions{})
}
func (r *quizRepo) CreateTx(ctx context.Context, quiz *models.Quiz, tx pgx.Tx) error {
	query := `
		INSERT INTO quizzes (
			community_id,
			creator_id,
			title,
			description,
			duration_minutes,
			likes_count,
			is_published
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at, updated_at
	`

	err := tx.QueryRow(ctx, query,
		quiz.CommunityID,
		quiz.CreatorID,
		quiz.Title,
		quiz.Description,
		quiz.DurationMinutes,
		quiz.LikesCount,
		quiz.IsPublished,
	).Scan(&quiz.ID, &quiz.CreatedAt, &quiz.UpdatedAt)

	return err
}

func (r *quizRepo) GetAllQuizzes(ctx context.Context) ([]models.Quiz, error) {
	query := `
	SELECT
		id,
		community_id,
		creator_id,
		"title",
		"description",
		duration_minutes,
		likes_count,
		students_count,
		average_score,
		is_published,
		created_at
	FROM quizzes
	WHERE is_published = true
	ORDER BY created_at DESC
`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var quizzes []models.Quiz

	for rows.Next() {
		var quiz models.Quiz

		err := rows.Scan(
			&quiz.ID,
			&quiz.CommunityID,
			&quiz.CreatorID,
			&quiz.Title,
			&quiz.Description,
			&quiz.DurationMinutes,
			&quiz.LikesCount,
			&quiz.StudentsCount,
			&quiz.AverageScore,
			&quiz.IsPublished,
			&quiz.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		quizzes = append(quizzes, quiz)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return quizzes, nil
}

func (r *quizRepo) FindByID(ctx context.Context, id string) (*models.Quiz, error) {
	query := `
		SELECT
			id,
			community_id,
			creator_id,
			title,
			description,
			duration_minutes,
			likes_count,
			is_published,
			created_at,
			updated_at
		FROM quizzes
		WHERE id = $1
	`

	var quiz models.Quiz

	err := r.db.QueryRow(ctx, query, id).Scan(
		&quiz.ID,
		&quiz.CommunityID,
		&quiz.CreatorID,
		&quiz.Title,
		&quiz.Description,
		&quiz.DurationMinutes,
		&quiz.LikesCount,
		&quiz.IsPublished,
		&quiz.CreatedAt,
		&quiz.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &quiz, nil
}

func (r *quizRepo) Update(ctx context.Context, quiz *models.Quiz) error {
	query := `
		UPDATE quizzes
		SET
			title = $1,
			description = $2,
			duration_minutes = $3,
			is_published = $4,
			updated_at = $5
		WHERE id = $6
	`

	cmdTag, err := r.db.Exec(ctx, query,
		quiz.Title,
		quiz.Description,
		quiz.DurationMinutes,
		quiz.IsPublished,
		time.Now(),
		quiz.ID,
	)

	if err != nil {
		return err
	}

	if cmdTag.RowsAffected() == 0 {
		return errors.New("quiz not found")
	}

	return nil
}

func (r *quizRepo) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM quizzes WHERE id = $1`

	cmdTag, err := r.db.Exec(ctx, query, id)
	if err != nil {
		return err
	}

	if cmdTag.RowsAffected() == 0 {
		return errors.New("quiz not found")
	}

	return nil
}

func (r *quizRepo) FindByCommunityID(ctx context.Context, communityID string) ([]*models.Quiz, error) {
	query := `
		SELECT
			id,
			community_id,
			creator_id,
			title,
			description,
			duration_minutes,
			likes_count,
			is_published,
			created_at,
			updated_at
		FROM quizzes
		WHERE community_id = $1
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(ctx, query, communityID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var quizzes []*models.Quiz

	for rows.Next() {
		var quiz models.Quiz

		err := rows.Scan(
			&quiz.ID,
			&quiz.CommunityID,
			&quiz.CreatorID,
			&quiz.Title,
			&quiz.Description,
			&quiz.DurationMinutes,
			&quiz.LikesCount,
			&quiz.IsPublished,
			&quiz.CreatedAt,
			&quiz.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		quizzes = append(quizzes, &quiz)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return quizzes, nil
}
