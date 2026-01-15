package handlers

import (
	dto_comment "ecoquiz/internal/dto/comment"
	"ecoquiz/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CommentHandler struct {
	commentService services.CommentService
}

func NewCommentHandler(commentService services.CommentService) *CommentHandler {
	return &CommentHandler{
		commentService: commentService,
	}
}

func (h *CommentHandler) CreateComment(c *gin.Context) {
	userID := c.GetString("userID")
	questionID := c.Param("id")

	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	if questionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "question id is required"})
		return
	}

	var req dto_comment.CreateCommentReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	id, err := h.commentService.CreateComment(c.Request.Context(), questionID, userID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": id})
}

func (h *CommentHandler) DeleteComment(c *gin.Context) {
	userID := c.GetString("userID")
	commentID := c.Param("id")

	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	if commentID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "comment id is required"})
		return
	}

	if err := h.commentService.DeleteComment(c.Request.Context(), commentID, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "comment deleted"})
}
