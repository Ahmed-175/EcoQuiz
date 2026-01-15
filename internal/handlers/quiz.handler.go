package handlers

import (
	dto_quiz "ecoquiz/internal/dto/quiz"
	"ecoquiz/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type QuizHandler struct {
	quizService services.QuizService
}

func NewQuizHandler(quizService services.QuizService) *QuizHandler {
	return &QuizHandler{
		quizService: quizService,
	}
}
func (h *QuizHandler) CreateQuiz(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unauthorized"})
		return
	}
	var quizRequest dto_quiz.CreateQuizRequest
	if err := c.ShouldBindJSON(&quizRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	quizId, err := h.quizService.CreateQuiz(c.Request.Context(), userID, &quizRequest)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"quiz_id": quizId})
}

func (h *QuizHandler) GetAllQuizzes(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unauthorized"})
		return
	}
	quizzes, err := h.quizService.GetAllQuizzes(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"quizzes": quizzes})
}

func (h *QuizHandler) TakeQuiz(c *gin.Context) {
	userID := c.GetString("userID")
	quizID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unauthorized"})
		return
	}
	if quizID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quiz ID is required"})
		return
	}
	quiz, err := h.quizService.TakeQuiz(c.Request.Context(), userID, quizID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"quiz": quiz})
}

func (h *QuizHandler) SubmitQuiz(c *gin.Context) {
	userID := c.GetString("userID")
	quizID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unauthorized"})
		return
	}
	if quizID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quiz ID is required"})
		return
	}
	var submitRequest dto_quiz.SubmitQuizRequest
	if err := c.ShouldBindJSON(&submitRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	result, err := h.quizService.SubmitQuiz(c.Request.Context(), userID, quizID, &submitRequest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"result": result})
}

func (h *QuizHandler) ToggleLike(c *gin.Context) {
	userID := c.GetString("userID")
	quizID := c.Param("id")

	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unauthorized"})
		return
	}
	if quizID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quiz ID is required"})
		return
	}

	status, err := h.quizService.ToggleLike(c.Request.Context(), quizID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": status})
}
