package services

import (
	"context"
	dto_comment "ecoquiz/internal/dto/comment"
	"ecoquiz/internal/models"
	"ecoquiz/internal/repos"
	"errors"

	"github.com/jackc/pgx/v5"
)

type CommentService struct {
	commentRepo  repos.CommentRepo
	questionRepo repos.QuestionRepo
}

func NewCommentService(commentRepo repos.CommentRepo, questionRepo repos.QuestionRepo) *CommentService {
	return &CommentService{
		commentRepo:  commentRepo,
		questionRepo: questionRepo,
	}
}

func (s *CommentService) CreateComment(ctx context.Context, questionID, userID string, req *dto_comment.CreateCommentReq) (string, error) {
	// Check if question exists
	_, err := s.questionRepo.GetByID(ctx, questionID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return "", errors.New("question not found")
		}
		return "", errors.New("failed to get question")
	}

	comment := &models.QuestionComment{
		QuestionID:  questionID,
		UserID:      userID,
		CommentText: req.Text,
	}

	if err := s.commentRepo.Create(ctx, comment); err != nil {
		return "", errors.New("failed to create comment: " + err.Error())
	}
	return comment.ID, nil
}

func (s *CommentService) DeleteComment(ctx context.Context, commentID, userID string) error {
	comment, err := s.commentRepo.GetByID(ctx, commentID)
	if err != nil {
		return err
	}

	if comment.UserID != userID {
		return errors.New("unauthorized: you can only delete your own comments")
	}

	if err := s.commentRepo.Delete(ctx, commentID); err != nil {
		return errors.New("failed to delete comment: " + err.Error())
	}
	return nil
}
