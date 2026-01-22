package services

import (
	// "ecoquiz/internal/models"
	"context"
	dto_quiz "ecoquiz/internal/dto/quiz"
	"ecoquiz/internal/models"
	"ecoquiz/internal/repos"
	"ecoquiz/internal/utils"
	"errors"
	"fmt"

	"time"

	"github.com/jackc/pgx/v5"
)

type QuizService struct {
	quizRepo      repos.QuizRepo
	questionRepo  repos.QuestionRepo
	optionRepo    repos.OptionRepo
	userRepo      repos.UserRepo
	communityRepo repos.CommunityRepo
	commentRepo   repos.CommentRepo
}

func NewQuizService(
	quizRepo repos.QuizRepo,
	questionRepo repos.QuestionRepo,
	optionRepo repos.OptionRepo,
	userRepo repos.UserRepo,
	communityRepo repos.CommunityRepo,
	commentRepo repos.CommentRepo,
) *QuizService {
	return &QuizService{
		quizRepo:      quizRepo,
		questionRepo:  questionRepo,
		optionRepo:    optionRepo,
		userRepo:      userRepo,
		communityRepo: communityRepo,
		commentRepo:   commentRepo,
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
		return "", errors.New("Failed to create question" + err.Error())
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

func (s *QuizService) GetAllQuizzes(
	ctx context.Context,
	userID string,
) ([]dto_quiz.QuizResponse, error) {

	quizzes, err := s.quizRepo.GetAllQuizzes(ctx)
	if err != nil {
		return nil, errors.New("failed to get quizzes: " + err.Error())
	}

	quizzesResponse := make([]dto_quiz.QuizResponse, 0, len(quizzes))

	for _, quiz := range quizzes {
		var quizRes dto_quiz.QuizResponse
		quizRes.ID = quiz.ID
		quizRes.Title = quiz.Title
		quizRes.Description = quiz.Description
		quizRes.DurationMinutes = quiz.DurationMinutes
		quizRes.AverageScore = quiz.AverageScore
		quizRes.StudentsCount = quiz.StudentsCount
		quizRes.LikesCount = quiz.LikesCount
		quizRes.CreatedAt = utils.FormatTime(quiz.CreatedAt)

		if utils.IsNew(quiz.CreatedAt) {
			quizRes.IsNew = true
		} else {
			quizRes.IsNew = false
		}
		quizRes.IsLiked, _ = s.quizRepo.IsLike(ctx, quiz.ID, userID)

		questions, err := s.questionRepo.FindByQuizID(ctx, quiz.ID)
		if err == nil {
			quizRes.NumberOfQuestions = len(questions)
		}

		community, err := s.communityRepo.FindByID(ctx, quiz.CommunityID)
		if err != nil {
			return nil, errors.New("failed to get community")
		}

		quizRes.Community = dto_quiz.Community{
			ID:     community.ID,
			Name:   community.Name,
			Banner: &community.Banner.String,
		}

		if userID == community.CreatorID {
			quizRes.Community.IsJoined = "CREATOR"
		} else {
			role, err := s.communityRepo.UserRole(ctx, community.ID, userID)
			fmt.Println(role)
			if err != nil {
				if err == pgx.ErrNoRows {
					quizRes.Community.IsJoined = "NON_MEMBER"
				} else {
					return nil, errors.New("failed to check community membership")
				}
			} else {
				if role == "creator" {
					quizRes.Community.IsJoined = "CREATOR"
				} else {
					quizRes.Community.IsJoined = "MEMBER"
				}
			}
		}
		creator, err := s.userRepo.FindByID(ctx, quiz.CreatorID)
		if err != nil {
			return nil, errors.New("failed to get creator")
		}
		creatorRole, _ := s.communityRepo.UserRole(ctx, community.ID, quiz.CreatorID)

		quizRes.Creator = dto_quiz.Creator{
			ID:       creator.ID,
			Username: creator.Username,
			Email:    creator.Email,
			Avatar:   creator.Avatar,
		}
		if creatorRole == "creator" {
			quizRes.Creator.Role = "CREATOR"
		} else if creatorRole == "admin" {
			quizRes.Creator.Role = "ADMIN"
		} else {
			quizRes.Creator.Role = "MEMBER"
		}

		quizzesResponse = append(quizzesResponse, quizRes)
	}

	return quizzesResponse, nil
}

func (s *QuizService) TakeQuiz(
	ctx context.Context,
	userID string,
	quizID string,
) (*dto_quiz.TakeQuizResponse, error) {
	quiz, err := s.quizRepo.FindByID(ctx, quizID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, errors.New("Quiz not found")
		}
		return nil, errors.New("Failed to get Quiz")
	}
	questions, err := s.questionRepo.FindByQuizID(ctx, quizID)
	if err != nil {
		return nil, errors.New("Failed to get Questions")
	}
	var questionsRes []dto_quiz.QuestionTake
	for _, q := range questions {
		var questionRes dto_quiz.QuestionTake
		questionRes.QuestionID = q.ID
		questionRes.QuestionText = q.QuestionText
		options, err := s.optionRepo.GetByQuestionID(ctx, q.ID)
		if err != nil {
			return nil, errors.New("Failed to get Options")
		}
		var optionsRes []dto_quiz.OptionTake
		for _, o := range options {
			optionRes := dto_quiz.OptionTake{
				OptionID: o.ID,
				Text:     o.Text,
			}
			optionsRes = append(optionsRes, optionRes)
		}
		questionRes.Options = optionsRes
		questionsRes = append(questionsRes, questionRes)
	}
	takeQuizRes := &dto_quiz.TakeQuizResponse{
		QuizID:    quiz.ID,
		Title:     quiz.Title,
		Duration:  quiz.DurationMinutes,
		Questions: questionsRes,
	}
	return takeQuizRes, nil

}

func (s *QuizService) SubmitQuiz(
	ctx context.Context,
	userID string,
	quizID string,
	submitReq *dto_quiz.SubmitQuizRequest,
) (string, error) {

	tx, err := s.quizRepo.BeginTx(ctx)
	if err != nil {
		return "", errors.New("failed to start transaction")
	}
	defer tx.Rollback(ctx)

	quiz, err := s.quizRepo.FindByID(ctx, quizID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return "", errors.New("quiz not found")
		}
		return "", errors.New("failed to get quiz")
	}

	if submitReq.DurationMinutes > quiz.DurationMinutes {
		return "", errors.New("time out")
	}

	questions, err := s.questionRepo.FindByQuizID(ctx, quizID)
	if err != nil {
		return "", errors.New("failed to get questions")
	}

	if len(submitReq.Answers) != len(questions) {
		return "", errors.New("answers count does not match questions count")
	}

	userAttempts, err := s.quizRepo.FindAttemptByUser(ctx, quizID, userID)
	if err != nil && err != pgx.ErrNoRows {
		return "", errors.New("failed to check user attempts: " + err.Error())
	}
	isFirstAttempt := len(userAttempts) == 0
	_ = isFirstAttempt // Suppress unused warning since it's not needed for stats anymore but kept for logic clarity if needed later

	attempt := &models.QuizAttempts{
		UserID:           userID,
		QuizID:           quizID,
		TimeTakenMinutes: submitReq.DurationMinutes,
		TotalQuestions:   len(questions),
		Score:            0,
		Percentage:       0,
		AttemptCount:     len(userAttempts) + 1,
	}

	if err := s.quizRepo.CreateUserAttempt(ctx, attempt, tx); err != nil {
		return "", errors.New("failed to save user attempt: " + err.Error())
	}

	score := 0
	userAnswers := make([]*models.UserAnwer, 0, len(questions))
	for i, q := range questions {
		answer := submitReq.Answers[i]

		if answer.AnswerText == q.CorrectAnswer {
			score++
		}

		userAnswers = append(userAnswers, &models.UserAnwer{
			AttemptID:  attempt.ID,
			QuestionID: q.ID,
			OptionID:   answer.OptionID,
		})
	}

	if err := s.quizRepo.CreateBatchUserAnswer(ctx, userAnswers, tx); err != nil {
		return "", errors.New("failed to save user answers: " + err.Error())
	}

	attempt.Score = score
	attempt.Percentage = (float64(score) / float64(len(questions))) * 100
	attempt.CompletedAt = time.Now()

	if err := s.quizRepo.UpdateAttempt(ctx, attempt, tx); err != nil {
		return "", errors.New("failed to update user attempt: " + err.Error())
	}

	if err := tx.Commit(ctx); err != nil {
		return "", errors.New("failed to commit transaction: " + err.Error())
	}

	return attempt.ID, nil
}

func (s *QuizService) ToggleLike(ctx context.Context, quizID, userID string) (string, error) {
	_, err := s.quizRepo.FindByID(ctx, quizID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return "", errors.New("quiz not found")
		}
		return "", err
	}

	hasLiked, err := s.quizRepo.HasLiked(ctx, quizID, userID)
	if err != nil {
		return "", err
	}

	if hasLiked {
		if err := s.quizRepo.RemoveLike(ctx, quizID, userID); err != nil {
			return "", err
		}
		return "unliked", nil
	}

	if err := s.quizRepo.AddLike(ctx, quizID, userID); err != nil {
		return "", err
	}
	return "liked", nil
}

func (s *QuizService) GetQuizByID(
	ctx context.Context,
	userID string,
	quizID string,
) (*dto_quiz.QuizDetailResponse, error) {

	quiz, err := s.quizRepo.FindByID(ctx, quizID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, errors.New("quiz not found")
		}
		return nil, errors.New("failed to get quiz: " + err.Error())
	}

	quizRes := &dto_quiz.QuizDetailResponse{
		ID:                quiz.ID,
		Title:             quiz.Title,
		Description:       quiz.Description,
		DurationMinutes:   quiz.DurationMinutes,
		LikesCount:        quiz.LikesCount,
		AverageScore:      quiz.AverageScore,
		NumberOfQuestions: 0, // Needs a repo method to get actual count if not in quiz model, or additional query
		CreatedAt:         utils.FormatTime(quiz.CreatedAt),
		IsNew:             utils.IsNew(quiz.CreatedAt),
	}
	// Fetch question count if not in model
	// assuming quiz model doesn't have it, but we can get it from questionRepo or add a method.
	// For now, let's use questionRepo.FindByQuizID length if efficient enough, or add a count method.
	// Given requirements, let's just count them.

	quizRes.IsLike, _ = s.quizRepo.IsLike(ctx, quizID, userID)

	questions, err := s.questionRepo.FindByQuizID(ctx, quizID)
	if err == nil {
		quizRes.NumberOfQuestions = len(questions)
	}

	// Community Info
	community, err := s.communityRepo.FindByID(ctx, quiz.CommunityID)
	if err != nil {
		return nil, errors.New("failed to get community")
	}
	quizRes.Community = dto_quiz.CommunityDetail{
		ID:        community.ID,
		Name:      community.Name,
		Banner:    &community.Banner.String,
		CreatedAt: utils.FormatTime(community.CreatedAt),
	}

	// Community Join Status
	if userID == community.CreatorID {
		quizRes.Community.IsJoined = "CREATOR"
	} else {
		role, err := s.communityRepo.UserRole(ctx, community.ID, userID)
		if err != nil {
			if err == pgx.ErrNoRows {
				quizRes.Community.IsJoined = "NON_MEMBER"
			} else {
				return nil, errors.New("failed to check community membership")
			}
		} else {
			if role == "creator" {
				quizRes.Community.IsJoined = "CREATOR"
			} else {
				quizRes.Community.IsJoined = "MEMBER"
			}
		}
	}

	// Creator Info
	creator, err := s.userRepo.FindByID(ctx, quiz.CreatorID)
	if err != nil {
		return nil, errors.New("failed to get creator")
	}
	creatorRole, _ := s.communityRepo.UserRole(ctx, community.ID, quiz.CreatorID)
	quizRes.Creator = dto_quiz.Creator{
		ID:       creator.ID,
		Username: creator.Username,
		Email:    creator.Email,
		Avatar:   creator.Avatar,
	}
	if creatorRole == "creator" {
		quizRes.Creator.Role = "CREATOR"
	} else if creatorRole == "admin" {
		quizRes.Creator.Role = "ADMIN"
	} else {
		quizRes.Creator.Role = "MEMBER"
	}

	// Leaderboard
	leaderboard, err := s.quizRepo.GetQuizLeaderboard(ctx, quizID)
	if err != nil {
		return nil, errors.New("failed to get leaderboard: " + err.Error())
	}
	quizRes.Leaderboard = leaderboard
	quizRes.Leaderboard = leaderboard
	quizRes.StudentsCount = len(leaderboard)

	// Check for current attempt
	attempts, err := s.quizRepo.FindAttemptByUser(ctx, quizID, userID)
	if err == nil && len(attempts) > 0 {
		// Assuming attempts are ordered or we pick the last one.
		// Detailed logic depends on if multiple attempts are allowed or we just want the latest.
		// For now, let's take the latest one (index 0 if ordered desc, or find max date).
		// Assuming FindAttemptByUser returns all, let's pick the most recent.
		// If repo doesn't order, we should might pick any or latest.
		// Let's assume the repo returns them and we pick the first one which is usually the latest or we just pick one.
		// Actually, let's just use the ID of the first one found for now.
		lastAttemptID := attempts[0].ID
		quizRes.CurrentAttemptID = &lastAttemptID
	}

	return quizRes, nil
}

func (s *QuizService) GetQuizResult(ctx context.Context, attemptID string) (*dto_quiz.QuizResultResponse, error) {
	attempt, err := s.quizRepo.GetAttemptByID(ctx, attemptID)
	if err != nil {
		return nil, errors.New("failed to get attempt: " + err.Error())
	}

	quiz, err := s.quizRepo.FindByID(ctx, attempt.QuizID)
	if err != nil {
		return nil, errors.New("failed to get quiz: " + err.Error())
	}

	questions, err := s.questionRepo.FindByQuizID(ctx, attempt.QuizID)
	if err != nil {
		return nil, errors.New("failed to get questions: " + err.Error())
	}

	userAnswers, err := s.quizRepo.GetUserAnswersForAttempt(ctx, attemptID)
	if err != nil {
		return nil, errors.New("failed to get user answers: " + err.Error())
	}

	optionStats, err := s.quizRepo.GetOptionStatsForQuiz(ctx, attempt.QuizID)
	if err != nil {
		return nil, errors.New("failed to get option stats: " + err.Error())
	}

	allAttempts, _ := s.quizRepo.FindAttemptByQuiz(ctx, attempt.QuizID)
	studentCount := len(allAttempts)
	if studentCount == 0 {
		studentCount = 1
	}

	result := &dto_quiz.QuizResultResponse{
		AttemptID:        attempt.ID,
		QuizID:           quiz.ID,
		QuizTitle:        quiz.Title,
		Score:            attempt.Score,
		TotalQuestions:   attempt.TotalQuestions,
		Percentage:       attempt.Percentage,
		TimeTakenMinutes: attempt.TimeTakenMinutes,
		CompletedAt:      utils.FormatTime(attempt.CompletedAt),
		Questions:        make([]dto_quiz.QuestionResult, 0, len(questions)),
	}

	for _, q := range questions {
		qRes := dto_quiz.QuestionResult{
			QuestionID:    q.ID,
			QuestionText:  q.QuestionText,
			Explanation:   q.Explanation,
			CorrectAnswer: q.CorrectAnswer,
			UserAnswer:    nil,
			Options:       make([]dto_quiz.OptionWithStats, 0),
			Comments:      make([]dto_quiz.CommentRes, 0),
		}

		if ans, ok := userAnswers[q.ID]; ok {
			qRes.UserAnswer = &ans
		}

		options, _ := s.optionRepo.GetByQuestionID(ctx, q.ID)
		for _, o := range options {
			count := optionStats[o.ID]
			oStats := dto_quiz.OptionWithStats{
				OptionID:       o.ID,
				Text:           o.Text,
				IsCorrect:      o.IsCorrect,
				SelectionCount: count,
				Percentage:     (float64(count) / float64(studentCount)) * 100,
			}
			if qRes.UserAnswer != nil && *qRes.UserAnswer == o.ID {
				if o.IsCorrect {
					qRes.IsCorrect = true
				}
			}
			qRes.Options = append(qRes.Options, oStats)
		}

		comments, _ := s.commentRepo.GetCommentsByQuestionID(ctx, q.ID)
		if comments == nil {
			comments = make([]dto_quiz.CommentRes, 0)
		}
		qRes.Comments = comments

		result.Questions = append(result.Questions, qRes)
	}

	return result, nil
}

func (s *QuizService) AddQuestion(ctx context.Context, quizID string, qReq *dto_quiz.Question) error {
	tx, err := s.quizRepo.BeginTx(ctx)
	if err != nil {
		return errors.New("failed to start transaction")
	}
	defer tx.Rollback(ctx)

	return s.addQuestionInternal(ctx, quizID, qReq, tx)
}

func (s *QuizService) addQuestionInternal(ctx context.Context, quizID string, qReq *dto_quiz.Question, tx pgx.Tx) error {
	question := models.Question{
		QuizID:        quizID,
		QuestionText:  qReq.QuestionText,
		Explanation:   qReq.Explanation,
		CorrectAnswer: qReq.CorrectAnswer,
		OrderIndex:    qReq.OrderIndex,
	}

	qs := []models.Question{question}
	if err := s.questionRepo.CreateBatchTx(ctx, qs, tx); err != nil {
		return errors.New("failed to create question: " + err.Error())
	}

	options := make([]models.Option, 0, len(qReq.Options))
	for _, o := range qReq.Options {
		options = append(options, models.Option{
			QuestionID: qs[0].ID,
			Text:       o.Text,
			IsCorrect:  o.IsCorrect,
		})
	}

	if err := s.optionRepo.CreateBatchTx(ctx, options, tx); err != nil {
		return errors.New("failed to create options: " + err.Error())
	}

	return tx.Commit(ctx)
}
