package handlers

import (
	dto_community "ecoquiz/internal/dto/community"
	"ecoquiz/internal/services"
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

	res, err := h.communityService.GetAllCommunities(c.Request.Context())
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

	res, err := h.communityService.GetCommunityByID(
		c.Request.Context(),
		commID,
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
