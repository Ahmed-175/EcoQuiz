package routes

import (
	"ecoquiz/internal/handlers"
	middleware "ecoquiz/internal/middlewares"

	"github.com/gin-gonic/gin"
)

func CommentRoutes(rg *gin.RouterGroup, commentHandler *handlers.CommentHandler, secretJWT string) {
	questions := rg.Group("/questions")
	questions.Use(middleware.JWTAuth(secretJWT))
	{
		questions.POST("/:id/comments", commentHandler.CreateComment)
	}

	comments := rg.Group("/comments")
	comments.Use(middleware.JWTAuth(secretJWT))
	{
		comments.DELETE("/:id", commentHandler.DeleteComment)
	}
}
