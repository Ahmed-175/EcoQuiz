package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port               string
	DatabaseURL        string
	GoogleClientID     string
	GoogleClientSecret string
	GoogleRedirectURL  string
	JwtSecret          string
	ClientURL          string
}

func Load() *Config {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("failed to loading the .env file")
	}
	return &Config{
		Port:               Getenv("PORT", "8080"),
		DatabaseURL:        Getenv("DATABASE_URL", "postgres://postgres:ahmed@localhost:5432/eco-quiz?sslmode=disable"),
		GoogleClientID:     Getenv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret: Getenv("GOOGLE_CLIENT_SECRET", ""),
		GoogleRedirectURL:  Getenv("GOOGLE_REDIRECT_URL", ""),
		JwtSecret:          Getenv("JWTSecret", "your-jwt-secrect"),
		ClientURL:          Getenv("CLIENT_URL", "http://localhost:5173"),
	}
}

func Getenv(key, defaultValue string) string {
	if os.Getenv(key) == "" {
		return defaultValue
	}
	return os.Getenv(key)
}
