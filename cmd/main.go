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
	communityRepo := repos.NewCommunityRepo(pool)
	quizRepo := repos.NewQuizRepo(pool)
	questionRepo := repos.NewQuestionRepo(pool)
	optionRepo := repos.NewOptionRepo(pool)
	commentRepo := repos.NewCommentRepo(pool)

	authService := services.NewAuthService(userRepo, cfg.JwtSecret)
	userService := services.NewUserService(userRepo)
	oauthCfg := utils.GoogleConfig(cfg.GoogleClientID, cfg.GoogleClientSecret, cfg.GoogleRedirectURL)
	communityService := services.NewCommunityService(communityRepo, userRepo)
	quizService := services.NewQuizService(quizRepo, questionRepo, optionRepo, userRepo, communityRepo)
	commentService := services.NewCommentService(commentRepo, questionRepo)

	authHandler := handlers.NewAuthHandler(*authService, oauthCfg, cfg.ClientURL)
	userHandler := handlers.NewUserHandler(*userService)
	communityHandler := handlers.NewCommunityHandler(*communityService)
	quizHandler := handlers.NewQuizHandler(*quizService)
	commentHandler := handlers.NewCommentHandler(*commentService)
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowCredentials: true,
		AllowMethods:     []string{"GET", "POST", "DELETE", "PUT"},
	}))
	r.Static("/api/uploads", "./uploads")

	routes.SetupRoutes(
		r,
		authHandler,
		userHandler,
		communityHandler,
		quizHandler,
		commentHandler,
		cfg.JwtSecret,
	)

	r.Run(":" + cfg.Port)
}
