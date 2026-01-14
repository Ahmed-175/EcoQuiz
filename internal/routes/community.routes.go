package routes

import (
	"ecoquiz/internal/handlers"
	middleware "ecoquiz/internal/middlewares"

	"github.com/gin-gonic/gin"
)

func CommunityRoutes(rg *gin.RouterGroup, communityHandler *handlers.CommunityHandler, secretJWT string) {
	community := rg.Group("/communities")
	community.GET("/", communityHandler.GetAllCommunities)
	community.Use(middleware.JWTAuth(secretJWT))
	{
		community.POST("/", communityHandler.CreateCommunity)
		community.GET("/:id" ,communityHandler.GetCommunityByID)
	}
}
