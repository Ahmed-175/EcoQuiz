package services

import (
	// "ecoquiz/internal/models"
	"context"
	dto_quiz "ecoquiz/internal/dto/quiz"
	"ecoquiz/internal/models"
	"ecoquiz/internal/repos"
	"errors"

	"github.com/jackc/pgx/v5"
)

type QuizService struct {
	quizRepo      repos.QuizRepo
	questionRepo  repos.QuestionRepo
	optionRepo    repos.OptionRepo
	communityRepo repos.CommunityRepo
	userRepo      repos.UserRepo
}

func NewQuizService(
	quizRepo repos.QuizRepo,
	questionRepo repos.QuestionRepo,
	optionRepo repos.OptionRepo,
	userRepo      repos.UserRepo,
	communityRepo repos.CommunityRepo,
) *QuizService {
	return &QuizService{
		quizRepo:      quizRepo,
		questionRepo:  questionRepo,
		optionRepo:    optionRepo,
		userRepo: userRepo,
		communityRepo: communityRepo,
	}
}

func (s *QuizService) CreateQuiz(
	ctx context.Context,
	userID string,
	quizReq *dto_quiz.CreateQuizRequest,
) (string, error) {
	_, err := s.userRepo.FindByID(ctx, userID)
	if err == pgx.ErrNoRows {
		return "", errors.New("Unauthorized user")
	}
	if err != nil {
		return "", errors.New("Failed to get User")
	}

	if _, err := s.communityRepo.FindByID(ctx, quizReq.CommunityID); err != nil {
		if err == pgx.ErrNoRows {
			return "", errors.New("Community not found")
		}
		return "", errors.New("Failed to get Community")
	}
	if len(quizReq.Questions) == 0 {
		return "", errors.New("Quiz must have at least one question")
	}

	tx, err := s.quizRepo.BeginTx(ctx)
	if err != nil {
		return "", errors.New("Failed to start transaction")
	}
	defer tx.Rollback(ctx)

	quiz := models.Quiz{
		CommunityID:     quizReq.CommunityID,
		CreatorID:       userID,
		Title:           quizReq.Title,
		Description:     quizReq.Description,
		DurationMinutes: quizReq.DurationMinutes,
		IsPublished:     quizReq.IsPublished,
	}

	if err := s.quizRepo.CreateTx(ctx, &quiz, tx); err != nil {
		return "", errors.New("Failed to create quiz")
	}
	var questions []models.Question
	for _, q := range quizReq.Questions {
		var question models.Question
		question.QuizID = quiz.ID
		question.QuestionText = q.QuestionText
		question.Explanation = q.Explanation
		question.CorrectAnswer = q.CorrectAnswer
		question.OrderIndex = q.OrderIndex
		questions = append(questions, question)
	}

	if err := s.questionRepo.CreateBatchTx(ctx, questions, tx); err != nil {
		return "", errors.New("Failed to create question")
	}

	for i, q := range quizReq.Questions {
		var options []models.Option
		for _, o := range q.Options {
			var option models.Option
			option.QuestionID = questions[i].ID
			option.Text = o.Text
			option.IsCorrect = o.IsCorrect
			options = append(options, option)
		}
		err := s.optionRepo.CreateBatchTx(ctx, options, tx)
		if err != nil {
			return "", errors.New("Failed to get created question")
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return "", errors.New("Failed to commit transaction")
	}
	return quiz.ID, nil
}
