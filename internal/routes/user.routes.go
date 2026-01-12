package routes

import (
	"ecoquiz/internal/handlers"
	middleware "ecoquiz/internal/middlewares"

	"github.com/gin-gonic/gin"
)

func UserRoutes(rg *gin.RouterGroup, userHandler *handlers.UserHandler, jwtSecret string) {
	users := rg.Group("/users")
	users.Use(middleware.JWTAuth(jwtSecret))
	{
		users.GET("/me", userHandler.Profile)
		users.PUT("/me", userHandler.UpdateUser)
		users.PUT("/me/avatar", userHandler.UpdateAvatar)
		users.PUT("/me/banner", userHandler.UpdateBanner)
	}
}
