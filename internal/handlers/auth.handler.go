package handlers

import (
	"ecoquiz/internal/services"
	"ecoquiz/internal/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/oauth2"
)

type AuthHandler struct {
	authService services.AuthService
	oauthCfg    *oauth2.Config
	clientURL   string
}

func NewAuthHandler(authService services.AuthService, oauthCfg *oauth2.Config, clientURL string) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		oauthCfg:    oauthCfg,
		clientURL:   clientURL,
	}
}

func (h *AuthHandler) GoogleLogin(c *gin.Context) {
	url := h.oauthCfg.AuthCodeURL("state")
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (h *AuthHandler) GoogleCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code not provided"})
		return
	}

	oauthToken, err := utils.ExchangeCode(c.Request.Context(), h.oauthCfg, code)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "oauth failed: " + err.Error()})
		return
	}

	idToken, ok := oauthToken.Extra("id_token").(string)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id_token not found"})
		return
	}

	token, _, err := new(jwt.Parser).ParseUnverified(idToken, jwt.MapClaims{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id token"})
		return
	}

	claims := token.Claims.(jwt.MapClaims)

	jwtToken, err := h.authService.GoogleHandle(c.Request.Context(), claims)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.SetCookie(
		"access_token",
		jwtToken,
		3600*24,
		"/",
		"",
		false,
		true,
	)
	redirectURL := fmt.Sprintf("%s/home", h.clientURL)
	c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}
