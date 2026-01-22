package repos

import (
	"context"
	"errors"
	"time"

	dto_community "ecoquiz/internal/dto/community"
	dto_quiz "ecoquiz/internal/dto/quiz"
	"ecoquiz/internal/models"
	"ecoquiz/internal/utils"

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

	CreateBatchUserAnswer(ctx context.Context, answer []*models.UserAnwer, tx pgx.Tx) error
	CreateUserAttempt(ctx context.Context, attempt *models.QuizAttempts, tx pgx.Tx) error

	UpdateAttempt(ctx context.Context, attempt *models.QuizAttempts, tx pgx.Tx) error
	FindAttemptByUser(ctx context.Context, quizID string, userID string) ([]*models.QuizAttempts, error)
	FindAttemptByQuiz(ctx context.Context, quizID string) ([]*models.QuizAttempts, error)

	AddLike(ctx context.Context, quizID, userID string) error
	RemoveLike(ctx context.Context, quizID, userID string) error
	HasLiked(ctx context.Context, quizID, userID string) (bool, error)
	FindQuizzesByCommunityIDWithCount(ctx context.Context, communityID string) ([]dto_community.Quiz, error)
	GetQuizLeaderboard(ctx context.Context, quizID string) ([]dto_quiz.LeaderboardEntry, error)
	IsLike(ctx context.Context, quizID, userId string) (bool, error)
	FindAttemptsByUserID(ctx context.Context, userID string) ([]dto_quiz.UserAttemptWithQuiz, error)
	GetUserAnswersForAttempt(ctx context.Context, attemptID string) (map[string]string, error)
	GetOptionStatsForQuiz(ctx context.Context, quizID string) (map[string]int, error)
	GetAttemptByID(ctx context.Context, attemptID string) (*models.QuizAttempts, error)
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
			is_published)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at
	`

	err := tx.QueryRow(ctx, query,
		quiz.CommunityID,
		quiz.CreatorID,
		quiz.Title,
		quiz.Description,
		quiz.DurationMinutes,
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
		(SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = quizzes.id AND attempt_number = 1) as students_count,
		COALESCE((SELECT AVG(percentage) FROM quiz_attempts WHERE quiz_id = quizzes.id AND attempt_number = 1), 0) as average_score,
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
			(SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = $1 AND attempt_number = 1) as students_count,
			COALESCE((SELECT AVG(percentage) FROM quiz_attempts WHERE quiz_id = $1 AND attempt_number = 1), 0) as average_score,
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
		&quiz.StudentsCount,
		&quiz.AverageScore,
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
			(SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = quizzes.id AND attempt_number = 1) as students_count,
			COALESCE((SELECT AVG(percentage) FROM quiz_attempts WHERE quiz_id = quizzes.id AND attempt_number = 1), 0) as average_score,
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
			&quiz.StudentsCount,
			&quiz.AverageScore,
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

func (r *quizRepo) CreateBatchUserAnswer(
	ctx context.Context,
	answers []*models.UserAnwer,
	tx pgx.Tx,
) error {

	query := `
		INSERT INTO user_answers (attempt_id, question_id, option_id)
		VALUES ($1, $2, $3)
	`

	batch := &pgx.Batch{}

	for _, a := range answers {
		batch.Queue(
			query,
			a.AttemptID,
			a.QuestionID,
			a.OptionID,
		)
	}

	br := tx.SendBatch(ctx, batch)
	defer br.Close()

	for range answers {
		if _, err := br.Exec(); err != nil {
			return err
		}
	}

	return nil
}

func (r *quizRepo) CreateUserAttempt(ctx context.Context, attempt *models.QuizAttempts, tx pgx.Tx) error {
	query := `
		INSERT INTO quiz_attempts (
			quiz_id,
			user_id,
			score,
			total_questions,
			percentage,
			time_taken_minutes,
			attempt_number)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`
	err := tx.QueryRow(ctx, query,
		attempt.QuizID,
		attempt.UserID,
		attempt.Score,
		attempt.TotalQuestions,
		attempt.Percentage,
		attempt.TimeTakenMinutes,
		attempt.AttemptCount,
	).Scan(&attempt.ID)
	return err
}

func (r *quizRepo) FindAttemptByUser(
	ctx context.Context,
	quizID string,
	userID string,
) ([]*models.QuizAttempts, error) {

	query := `
		SELECT 
			id,
			quiz_id,
			user_id,
			score,
			total_questions,
			percentage,
			time_taken_minutes,
			completed_at
		FROM quiz_attempts
		WHERE quiz_id = $1 AND user_id = $2 ORDER BY completed_at
	`

	rows, err := r.db.Query(ctx, query, quizID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	quizAttempts := make([]*models.QuizAttempts, 0)

	for rows.Next() {
		attempt := &models.QuizAttempts{}

		if err := rows.Scan(
			&attempt.ID,
			&attempt.QuizID,
			&attempt.UserID,
			&attempt.Score,
			&attempt.TotalQuestions,
			&attempt.Percentage,
			&attempt.TimeTakenMinutes,
			&attempt.CompletedAt,
		); err != nil {
			return nil, err
		}

		quizAttempts = append(quizAttempts, attempt)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return quizAttempts, nil
}

func (r *quizRepo) FindAttemptByQuiz(
	ctx context.Context,
	quizID string,
) ([]*models.QuizAttempts, error) {

	query := `
		SELECT
			id,
			quiz_id,
			user_id,
			score,
			total_questions,
			percentage,
			time_taken_minutes,
			attempt_number,
			completed_at
		FROM quiz_attempts
		WHERE quiz_id = $1 AND attempt_number = 1
		ORDER BY completed_at DESC
	`

	rows, err := r.db.Query(ctx, query, quizID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	attempts := make([]*models.QuizAttempts, 0)

	for rows.Next() {
		attempt := &models.QuizAttempts{}

		if err := rows.Scan(
			&attempt.ID,
			&attempt.QuizID,
			&attempt.UserID,
			&attempt.Score,
			&attempt.TotalQuestions,
			&attempt.Percentage,
			&attempt.TimeTakenMinutes,
			&attempt.AttemptCount,
			&attempt.CompletedAt,
		); err != nil {
			return nil, err
		}

		attempts = append(attempts, attempt)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return attempts, nil
}

func (r *quizRepo) UpdateAttempt(ctx context.Context, attempt *models.QuizAttempts, tx pgx.Tx) error {
	query := `
		UPDATE quiz_attempts
		SET
			score = $1,
			total_questions = $2,
			percentage = $3,
			time_taken_minutes = $4,
			attempt_number = $5,
			completed_at = $6
		WHERE id = $7
	`
	// Changed from QueryRow to Exec because the UPDATE statement does not include a RETURNING clause.
	// Therefore, it does not return any rows to scan, checking RowsAffected ensure the update happened.
	cmdTag, err := tx.Exec(ctx, query,
		attempt.Score,
		attempt.TotalQuestions,
		attempt.Percentage,
		attempt.TimeTakenMinutes,
		attempt.AttemptCount,
		attempt.CompletedAt,
		attempt.ID,
	)
	if err != nil {
		return err
	}

	if cmdTag.RowsAffected() == 0 {
		return errors.New("quiz attempt not found")
	}

	return nil
}

func (r *quizRepo) AddLike(ctx context.Context, quizID, userID string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	queryLike := `INSERT INTO quiz_likes (quiz_id, user_id) VALUES ($1, $2)`
	if _, err := tx.Exec(ctx, queryLike, quizID, userID); err != nil {
		return err
	}

	queryCount := `UPDATE quizzes SET likes_count = likes_count + 1 WHERE id = $1`
	if _, err := tx.Exec(ctx, queryCount, quizID); err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (r *quizRepo) RemoveLike(ctx context.Context, quizID, userID string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	queryLike := `DELETE FROM quiz_likes WHERE quiz_id = $1 AND user_id = $2`
	cmdTag, err := tx.Exec(ctx, queryLike, quizID, userID)
	if err != nil {
		return err
	}
	if cmdTag.RowsAffected() == 0 {
		return errors.New("like not found")
	}

	queryCount := `UPDATE quizzes SET likes_count = likes_count - 1 WHERE id = $1`
	if _, err := tx.Exec(ctx, queryCount, quizID); err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (r *quizRepo) HasLiked(ctx context.Context, quizID, userID string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM quiz_likes WHERE quiz_id = $1 AND user_id = $2)`
	var exists bool
	err := r.db.QueryRow(ctx, query, quizID, userID).Scan(&exists)
	return exists, err
}

func (r *quizRepo) FindQuizzesByCommunityIDWithCount(ctx context.Context, communityID string) ([]dto_community.Quiz, error) {
	query := `
		SELECT
			q.id,
			q.title,
			q.description,
			q.duration_minutes,
			q.likes_count,
			q.created_at,
			(SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = q.id AND attempt_number = 1) as students_count,
			COALESCE((SELECT AVG(percentage) FROM quiz_attempts WHERE quiz_id = q.id AND attempt_number = 1), 0) as average_score,
			(SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) as number_of_questions,
			u.id,
			u.username,
			u.email,
			u.avatar,
			cm.role
		FROM quizzes q
		JOIN users u ON q.creator_id = u.id
		LEFT JOIN community_members cm ON cm.user_id = u.id AND cm.community_id = q.community_id
		WHERE q.community_id = $1 AND q.is_published = true
		ORDER BY q.created_at DESC
	`

	rows, err := r.db.Query(ctx, query, communityID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var quizzes []dto_community.Quiz
	for rows.Next() {
		var q dto_community.Quiz
		var createdAt time.Time
		q.Creator = dto_community.Creator{}
		var role *string // Update to handle potential NULL role

		err := rows.Scan(
			&q.ID,
			&q.Title,
			&q.Description,
			&q.DurationMinutes,
			&q.LikesCount,
			&createdAt,
			&q.StudentsCount,
			&q.AverageScore,
			&q.NumberOfQuestions,
			&q.Creator.ID,
			&q.Creator.Username,
			&q.Creator.Email,
			&q.Creator.Avatar,
			&role,
		)
		if err != nil {
			return nil, err
		}
		if role != nil {
			q.Creator.Role = *role
		} else {
			q.Creator.Role = "MEMBER" // Default fallback
		}

		q.CreatedAt = utils.FormatTime(createdAt)
		q.IsNew = utils.IsNew(createdAt)

		quizzes = append(quizzes, q)
	}
	return quizzes, nil
}

func (r *quizRepo) GetQuizLeaderboard(ctx context.Context, quizID string) ([]dto_quiz.LeaderboardEntry, error) {
	query := `
		SELECT
			qa.id,
			qa.time_taken_minutes,
			qa.score,
			qa.completed_at,
			u.id,
			u.username,
			u.email,
			u.avatar
		FROM quiz_attempts qa
		JOIN users u ON qa.user_id = u.id
		WHERE qa.quiz_id = $1 AND qa.attempt_number = 1
		ORDER BY qa.score DESC
	`

	rows, err := r.db.Query(ctx, query, quizID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var leaderboard []dto_quiz.LeaderboardEntry
	for rows.Next() {
		var entry dto_quiz.LeaderboardEntry
		var submittedAt time.Time
		if err := rows.Scan(
			&entry.AttemptID,
			&entry.TimeTakenMinutes,
			&entry.Score,
			&submittedAt,
			&entry.User.ID,
			&entry.User.Username,
			&entry.User.Email,
			&entry.User.Avatar,
		); err != nil {
			return nil, err
		}
		entry.SubmittedAt = utils.FormatTime(submittedAt)
		leaderboard = append(leaderboard, entry)
	}

	return leaderboard, nil
}

func (r *quizRepo) IsLike(ctx context.Context, quizID, userID string) (bool, error) {
	query := `
		SELECT COUNT(1)
		FROM quiz_likes
		WHERE quiz_id = $1 AND user_id = $2
	`

	var count int

	err := r.db.QueryRow(ctx, query, quizID, userID).Scan(&count)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

// FindAttemptsByUserID fetches all quiz attempts for a user with quiz details
func (r *quizRepo) FindAttemptsByUserID(ctx context.Context, userID string) ([]dto_quiz.UserAttemptWithQuiz, error) {
	query := `
		SELECT 
			qa.score,
			qa.time_taken_minutes,
			qa.attempt_number,
			qa.percentage,
			qa.completed_at,
			q.id,
			q.title,
			(SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) as questions_count
		FROM quiz_attempts qa
		JOIN quizzes q ON qa.quiz_id = q.id
		WHERE qa.user_id = $1
		ORDER BY qa.completed_at DESC
	`

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var attempts []dto_quiz.UserAttemptWithQuiz
	for rows.Next() {
		var a dto_quiz.UserAttemptWithQuiz
		var completedAt time.Time
		if err := rows.Scan(
			&a.Score,
			&a.TimeTakenMinutes,
			&a.AttemptNumber,
			&a.Percentage,
			&completedAt,
			&a.Quiz.ID,
			&a.Quiz.Title,
			&a.Quiz.QuestionsCount,
		); err != nil {
			return nil, err
		}
		a.CompletedAt = utils.FormatTime(completedAt)
		attempts = append(attempts, a)
	}

	return attempts, nil
}

func (r *quizRepo) GetUserAnswersForAttempt(ctx context.Context, attemptID string) (map[string]string, error) {
	query := `SELECT question_id, option_id FROM user_answers WHERE attempt_id = $1`
	rows, err := r.db.Query(ctx, query, attemptID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	answers := make(map[string]string)
	for rows.Next() {
		var qID, oID string
		if err := rows.Scan(&qID, &oID); err != nil {
			return nil, err
		}
		answers[qID] = oID
	}
	return answers, nil
}

func (r *quizRepo) GetOptionStatsForQuiz(ctx context.Context, quizID string) (map[string]int, error) {
	query := `
		SELECT ua.option_id, COUNT(*)
		FROM user_answers ua
		JOIN quiz_attempts qa ON ua.attempt_id = qa.id
		WHERE qa.quiz_id = $1
		GROUP BY ua.option_id
	`
	rows, err := r.db.Query(ctx, query, quizID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	stats := make(map[string]int)
	for rows.Next() {
		var oID string
		var count int
		if err := rows.Scan(&oID, &count); err != nil {
			return nil, err
		}
		stats[oID] = count
	}
	return stats, nil
}

func (r *quizRepo) GetAttemptByID(ctx context.Context, attemptID string) (*models.QuizAttempts, error) {
	query := `
		SELECT id, quiz_id, user_id, score, total_questions, percentage, time_taken_minutes, completed_at
		FROM quiz_attempts
		WHERE id = $1
	`
	var a models.QuizAttempts
	err := r.db.QueryRow(ctx, query, attemptID).Scan(
		&a.ID, &a.QuizID, &a.UserID, &a.Score, &a.TotalQuestions, &a.Percentage, &a.TimeTakenMinutes, &a.CompletedAt,
	)
	if err != nil {
		return nil, err
	}
	return &a, nil
}
