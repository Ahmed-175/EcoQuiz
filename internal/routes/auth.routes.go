package routes

import (
	"ecoquiz/internal/handlers"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(rg *gin.RouterGroup, authHandler *handlers.AuthHandler) {
	auth := rg.Group("/auth")
	{
		auth.GET("/google", authHandler.GoogleLogin)
		auth.GET("/google/callback", authHandler.GoogleCallback)
	}
}
