package utils

import (
	"time"

	"github.com/golang-jwt/jwt"
)

func GenerateToken(email, userId, secret string) (string, error) {
	claims := jwt.MapClaims{
		"sub": userId,
		"em":  email,
		"exp": time.Now().Add(7 * 24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(secret))

}
