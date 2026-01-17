package handlers

import (
	dto_community "ecoquiz/internal/dto/community"
	"ecoquiz/internal/services"
	"ecoquiz/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CommunityHandler struct {
	communityService services.CommunityService
}

func NewCommunityHandler(communityService services.CommunityService) *CommunityHandler {
	return &CommunityHandler{
		communityService: communityService,
	}
}

func (h *CommunityHandler) CreateCommunity(c *gin.Context) {
	userID := c.GetString("userID")
	var req dto_community.CreateCommunityReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failds is required" + err.Error()})
		return
	}

	commID, err := h.communityService.CreateCommunity(c.Request.Context(), &req, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"community_id": commID})
}

func (h *CommunityHandler) GetAllCommunities(c *gin.Context) {
	userID := c.GetString("userID")
	res, err := h.communityService.GetAllCommunities(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch communities: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *CommunityHandler) GetCommunityByID(c *gin.Context) {
	commID := c.Param("id")
	if commID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "community id is required",
		})
		return
	}

	userID := c.GetString("userID")
	res, err := h.communityService.GetCommunityByID(
		c.Request.Context(),
		commID,
		userID,
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *CommunityHandler) JoinCommunity(c *gin.Context) {
	commID := c.Param("id")
	if commID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "community id is required",
		})
		return
	}
	userID := c.GetString("userID")

	status, err := h.communityService.JoinCommunity(c.Request.Context(), userID, commID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": status})
}

func (h *CommunityHandler) PromoteMember(c *gin.Context) {
	commID := c.Param("id")
	targetUserID := c.Param("userId")
	requesterID := c.GetString("userID")

	if commID == "" || targetUserID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "community id and target user id are required"})
		return
	}

	if err := h.communityService.UpdateMemberRole(c.Request.Context(), requesterID, commID, targetUserID, "admin"); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "member promoted to admin"})
}

func (h *CommunityHandler) DemoteMember(c *gin.Context) {
	commID := c.Param("id")
	targetUserID := c.Param("userId")
	requesterID := c.GetString("userID")

	if commID == "" || targetUserID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "community id and target user id are required"})
		return
	}

	if err := h.communityService.UpdateMemberRole(c.Request.Context(), requesterID, commID, targetUserID, "member"); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "member demoted to member"})
}

func (h *CommunityHandler) UploadBanner(c *gin.Context) {
	file, err := c.FormFile("banner")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "banner image is required"})
		return
	}

	url, err := utils.SaveImage(file, "banner")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save image: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": url})
}
