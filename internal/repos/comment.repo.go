package repos

import (
	"context"
	dto_quiz "ecoquiz/internal/dto/quiz"
	"ecoquiz/internal/models"
	"ecoquiz/internal/utils"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CommentRepo interface {
	Create(ctx context.Context, comment *models.QuestionComment) error
	Delete(ctx context.Context, id string) error
	GetByID(ctx context.Context, id string) (*models.QuestionComment, error)
	GetCommentsByQuestionID(ctx context.Context, questionID string) ([]dto_quiz.CommentRes, error)
}

type commentRepo struct {
	db *pgxpool.Pool
}

func NewCommentRepo(db *pgxpool.Pool) CommentRepo {
	return &commentRepo{db: db}
}

func (r *commentRepo) Create(ctx context.Context, comment *models.QuestionComment) error {
	query := `
		INSERT INTO question_comments (question_id, user_id, comment_text)
		VALUES ($1, $2, $3)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRow(ctx, query,
		comment.QuestionID,
		comment.UserID,
		comment.CommentText,
	).Scan(&comment.ID, &comment.CreatedAt, &comment.UpdatedAt)
}

func (r *commentRepo) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM question_comments WHERE id = $1`
	cmdTag, err := r.db.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	if cmdTag.RowsAffected() == 0 {
		return errors.New("comment not found")
	}
	return nil
}

func (r *commentRepo) GetByID(ctx context.Context, id string) (*models.QuestionComment, error) {
	query := `
		SELECT id, question_id, user_id, comment_text, created_at, updated_at
		FROM question_comments
		WHERE id = $1
	`
	var comment models.QuestionComment
	err := r.db.QueryRow(ctx, query, id).Scan(
		&comment.ID,
		&comment.QuestionID,
		&comment.UserID,
		&comment.CommentText,
		&comment.CreatedAt,
		&comment.UpdatedAt,
	)
	if err == pgx.ErrNoRows {
		return nil, errors.New("comment not found")
	}
	return &comment, err
}

func (r *commentRepo) GetCommentsByQuestionID(ctx context.Context, questionID string) ([]dto_quiz.CommentRes, error) {
	query := `
		SELECT qc.id, qc.user_id, u.username, u.avatar, qc.comment_text, qc.created_at
		FROM question_comments qc
		JOIN users u ON qc.user_id = u.id
		WHERE qc.question_id = $1
		ORDER BY qc.created_at ASC
	`
	rows, err := r.db.Query(ctx, query, questionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []dto_quiz.CommentRes
	for rows.Next() {
		var c dto_quiz.CommentRes
		var createdAt time.Time
		if err := rows.Scan(&c.ID, &c.UserID, &c.Username, &c.Avatar, &c.CommentText, &createdAt); err != nil {
			return nil, err
		}
		c.CreatedAt = utils.FormatTime(createdAt)
		comments = append(comments, c)
	}
	return comments, nil
}
