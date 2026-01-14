package repos

import (
	"context"
	"errors"

	"ecoquiz/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type OptionRepo interface {
	CreateBatchTx(ctx context.Context, options []models.Option, tx pgx.Tx) error
	GetByQuestionID(ctx context.Context, questionID string) ([]models.Option, error)
	Update(ctx context.Context, options []models.Option) error
	DeleteByQuestionID(ctx context.Context, questionID string) error
}

type optionRepo struct {
	db *pgxpool.Pool
}

func NewOptionRepo(db *pgxpool.Pool) OptionRepo {
	return &optionRepo{db: db}
}

func (r *optionRepo) CreateBatchTx(ctx context.Context, options []models.Option, tx pgx.Tx) error {
	if len(options) == 0 {
		return nil
	}

	query := `
		INSERT INTO options (
			question_id,
			text,
			is_correct
		)
		VALUES ($1, $2, $3)
	`

	batch := &pgx.Batch{}

	for _, opt := range options {
		batch.Queue(query,
			opt.QuestionID,
			opt.Text,
			opt.IsCorrect,
		)
	}

	br := tx.SendBatch(ctx, batch)
	defer br.Close()

	for range options {
		_, err := br.Exec()
		if err != nil {
			return err
		}
	}

	return nil
}

func (r *optionRepo) GetByQuestionID(ctx context.Context, questionID string) ([]models.Option, error) {
	query := `
		SELECT
			id,
			question_id,
			text,
			is_correct
		FROM options
		WHERE question_id = $1
	`

	rows, err := r.db.Query(ctx, query, questionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	options := make([]models.Option, 0)

	for rows.Next() {
		var opt models.Option

		err := rows.Scan(
			&opt.ID,
			&opt.QuestionID,
			&opt.Text,
			&opt.IsCorrect,
		)
		if err != nil {
			return nil, err
		}

		options = append(options, opt)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return options, nil
}

func (r *optionRepo) Update(ctx context.Context, options []models.Option) error {
	if len(options) == 0 {
		return nil
	}

	query := `
		UPDATE options
		SET
			text = $1,
			is_correct = $2
		WHERE id = $3
	`

	batch := &pgx.Batch{}

	batch.Len()

	for _, opt := range options {
		batch.Queue(query,
			opt.Text,
			opt.IsCorrect,
			opt.ID,
		)
	}

	br := r.db.SendBatch(ctx, batch)
	defer br.Close()

	for range options {
		ct, err := br.Exec()
		if err != nil {
			return err
		}

		if ct.RowsAffected() == 0 {
			return errors.New("option not found")
		}
	}

	return nil
}

func (r *optionRepo) DeleteByQuestionID(ctx context.Context, questionID string) error {
	query := `DELETE FROM options WHERE question_id = $1`

	_, err := r.db.Exec(ctx, query, questionID)
	return err
}
