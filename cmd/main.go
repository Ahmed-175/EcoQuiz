package main

import (
	"ecoquiz/internal/config"
	"ecoquiz/internal/db"
	"ecoquiz/internal/handlers"
	"ecoquiz/internal/repos"
	"ecoquiz/internal/routes"
	"ecoquiz/internal/services"
	"ecoquiz/internal/utils"
	"fmt"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()
	pool, err := db.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("failed to connect with Database")
	}
	defer pool.Close()
	fmt.Println("Database Connected!")

	userRepo := repos.NewUserRepo(pool)

	authService := services.NewAuthService(userRepo, cfg.JwtSecret)
	userService := services.NewUserService(userRepo)
	oauthCfg := utils.GoogleConfig(cfg.GoogleClientID, cfg.GoogleClientSecret, cfg.GoogleRedirectURL)

	authHandler := handlers.NewAuthHandler(*authService, oauthCfg, cfg.ClientURL)
	userHandler := handlers.NewUserHandler(*userService)
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowCredentials: true,
		AllowMethods:     []string{"GET", "POST", "DELETE", "PUT"},
	}))
	r.Static("/api/uploads", "./uploads")

	routes.SetupRoutes(r, authHandler, userHandler, cfg.JwtSecret)

	r.Run(":" + cfg.Port)
}
