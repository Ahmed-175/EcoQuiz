package middleware

import (
	sharedErrors "ecoquiz/internal/shared/errors"
	goErrors "errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Next()

		if len(c.Errors) == 0 {
			return
		}
		err := c.Errors.Last().Err

		var appErr *sharedErrors.AppError

		if goErrors.As(err, &appErr) {
			c.JSON(appErr.StatusCode, gin.H{
				"error": gin.H{
					"code":    appErr.Code,
					"message": appErr.Message,
				},
			})
			return
		}
		internal := sharedErrors.Internal()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    internal.Code,
				"message": internal.Message,
			},
		})
	}
}
