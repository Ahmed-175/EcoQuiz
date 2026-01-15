package routes

import (
	"ecoquiz/internal/handlers"
	middleware "ecoquiz/internal/middlewares"

	"github.com/gin-gonic/gin"
)

func QuizRoutes(api *gin.RouterGroup, quizHandler *handlers.QuizHandler, jwtsecret string) {
	quizGroup := api.Group("/quizzes")
	quizGroup.Use(middleware.JWTAuth(jwtsecret))
	{
		quizGroup.POST("/", quizHandler.CreateQuiz)
		quizGroup.GET("/", quizHandler.GetAllQuizzes)
		quizGroup.GET("/:id", quizHandler.GetQuizByID)
		quizGroup.GET("/:id/take", quizHandler.TakeQuiz)
		quizGroup.POST("/:id/submit", quizHandler.SubmitQuiz)
		quizGroup.POST("/:id/like", quizHandler.ToggleLike)
	}
}
