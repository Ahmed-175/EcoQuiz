package routes

import (
	"ecoquiz/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, 
	authHandler *handlers.AuthHandler,
	userHandler *handlers.UserHandler,
	jwtsecret string , 
	) {
	api := router.Group("/api")
	AuthRoutes(api, authHandler)
	UserRoutes(api ,userHandler , jwtsecret)
}
