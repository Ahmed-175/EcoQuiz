package routes

import (
	"ecoquiz/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine,
	authHandler *handlers.AuthHandler,
	userHandler *handlers.UserHandler,
	communityHandler *handlers.CommunityHandler,
	quizHandler *handlers.QuizHandler,
	jwtsecret string,
) {
	api := router.Group("/api")
	AuthRoutes(api, authHandler)
	UserRoutes(api, userHandler, jwtsecret)
	CommunityRoutes(api, communityHandler, jwtsecret)
	QuizRoutes(api, quizHandler, jwtsecret)
}
