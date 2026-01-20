package handlers

import (
	dto_user "ecoquiz/internal/dto/user"

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
	res, err := h.userService.Profile(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"res": res})
}

func (h *UserHandler) GetUser(c *gin.Context) {
	userID := c.Param("userID")

	if userID == ""{
		c.JSON(http.StatusUnauthorized, gin.H{"errors": "User id is required"})
		return
	}
	res, err := h.userService.Profile(c.Request.Context(), userID)
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
func (h *UserHandler) UpdateAvatar(c *gin.Context) {
	userID := c.GetString("userID")

	file, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "avatar is required"})
		return
	}

	avatarURL, err := h.userService.UpdateAvatar(c.Request.Context(), userID, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"avatar": avatarURL,
	})
}

func (h *UserHandler) UpdateBanner(c *gin.Context) {
	userID := c.GetString("userID")
	file, err := c.FormFile("banner")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "banner is required"})
		return
	}
	bannerURL, err := h.userService.UpdateBanner(c.Request.Context(), userID, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"banner": bannerURL,
	})
}
