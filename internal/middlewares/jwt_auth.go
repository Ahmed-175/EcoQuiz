package middleware

import (

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type JwtClaims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

func JWTAuth(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {

		tokenString, err := c.Cookie("access_token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "access token not found",
			})
			return
		}

		token, err := jwt.Parse(
			tokenString,
			func(token *jwt.Token) (interface{}, error) {
				return []byte(secret), nil
			},
		)

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "invalid token",
			})
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		userID := claims["sub"].(string)
		email := claims["em"].(string)

		c.Set("userID", userID)
		c.Set("email", email)


		c.Next()
	}
}
