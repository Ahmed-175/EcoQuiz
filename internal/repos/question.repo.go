package repos

import (
	"context"
	"errors"
	"time"

	"ecoquiz/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type QuestionRepo interface {
	Create(ctx context.Context, question *models.Question) error
	GetByID(ctx context.Context, id string) (*models.Question, error)
	Update(ctx context.Context, question *models.Question) error
	Delete(ctx context.Context, id string) error
	FindByQuizID(ctx context.Context, quizID string) ([]*models.Question, error)
}

type questionRepo struct {
	db *pgxpool.Pool
}

func NewQuestionRepo(db *pgxpool.Pool) QuestionRepo {
	return &questionRepo{db: db}
}

func (r *questionRepo) Create(ctx context.Context, question *models.Question) error {
	query := `
		INSERT INTO questions (
			quiz_id,
			question_text,
			explanation,
			correct_answer,
			order_index
		)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at, updated_at
	`

	err := r.db.QueryRow(ctx, query,
		question.QuizID,
		question.QuestionText,
		question.Explanation,
		question.CorrectAnswer,
		question.OrderIndex,
	).Scan(&question.ID, &question.CreatedAt, &question.UpdatedAt)

	return err
}

func (r *questionRepo) GetByID(ctx context.Context, id string) (*models.Question, error) {
	query := `
		SELECT
			id,
			quiz_id,
			question_text,
			explanation,
			correct_answer,
			order_index,
			created_at,
			updated_at
		FROM questions
		WHERE id = $1
	`

	var question models.Question

	err := r.db.QueryRow(ctx, query, id).Scan(
		&question.ID,
		&question.QuizID,
		&question.QuestionText,
		&question.Explanation,
		&question.CorrectAnswer,
		&question.OrderIndex,
		&question.CreatedAt,
		&question.UpdatedAt,
	)

	if err == pgx.ErrNoRows {
		return nil, errors.New("question not found")
	}

	if err != nil {
		return nil, err
	}

	return &question, nil
}

func (r *questionRepo) Update(ctx context.Context, question *models.Question) error {
	query := `
		UPDATE questions
		SET
			question_text = $1,
			explanation = $2,
			correct_answer = $3,
			order_index = $4,
			updated_at = $5
		WHERE id = $6
	`

	cmdTag, err := r.db.Exec(ctx, query,
		question.QuestionText,
		question.Explanation,
		question.CorrectAnswer,
		question.OrderIndex,
		time.Now(),
		question.ID,
	)

	if err != nil {
		return err
	}

	if cmdTag.RowsAffected() == 0 {
		return errors.New("question not found")
	}

	return nil
}

func (r *questionRepo) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM questions WHERE id = $1`

	cmdTag, err := r.db.Exec(ctx, query, id)
	if err != nil {
		return err
	}

	if cmdTag.RowsAffected() == 0 {
		return errors.New("question not found")
	}

	return nil
}

func (r *questionRepo) FindByQuizID(ctx context.Context, quizID string) ([]*models.Question, error) {
	query := `
		SELECT
			id,
			quiz_id,
			question_text,
			explanation,
			correct_answer,
			order_index,
			created_at,
			updated_at
		FROM questions
		WHERE quiz_id = $1
		ORDER BY order_index ASC
	`

	rows, err := r.db.Query(ctx, query, quizID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	questions := make([]*models.Question, 0)

	for rows.Next() {
		var question models.Question

		err := rows.Scan(
			&question.ID,
			&question.QuizID,
			&question.QuestionText,
			&question.Explanation,
			&question.CorrectAnswer,
			&question.OrderIndex,
			&question.CreatedAt,
			&question.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		questions = append(questions, &question)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return questions, nil
}
