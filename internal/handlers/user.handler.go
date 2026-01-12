package handlers

import (
	dto_user "ecoquiz/internal/dto/user"
	"ecoquiz/internal/models"
	"ecoquiz/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService services.UserService
}

func NewUserHandler(userService services.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}
func (h *UserHandler) Profile(c *gin.Context) {
	userID := c.GetString("userID")

	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"errors": "User id is required"})
		return
	}

	var user models.User

	err := h.userService.Profile(c.Request.Context(), userID, &user)

	res := dto_user.UserMapperResponse(&user)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"res": res})
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User Id is required"})
		return
	}

	var dtoUpdateUser dto_user.UpdateUserRequest

	if err := c.ShouldBindJSON(&dtoUpdateUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "the failds required"})
		return
	}

	err := h.userService.UpdateUser(c.Request.Context(), &dtoUpdateUser, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "faild to update the user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"msg": "success"})

}
