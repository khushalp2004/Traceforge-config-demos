package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"go-testing-app/internal/models"
	"go-testing-app/internal/database"
	"go-testing-app/internal/utils"
	"go-testing-app/internal/config"
	"go-testing-app/internal/logger"
	"go.uber.org/zap"
)

type RegisterReq struct {
	Username string `json:"username" binding:"required,min=3"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginReq struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Register(c *gin.Context) {
	var req RegisterReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := models.User{
		Username: req.Username,
		Email:    req.Email,
		// In a real app, hash the password!
		Password: req.Password,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created", "id": user.ID})
}

func Login(c *gin.Context, cfg *config.Config) {
	var req LoginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		logger.Log.Warn("Login failed: User not found", zap.String("username", req.Username))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// In a real app, compare hashed password!
	if user.Password != req.Password {
		logger.Log.Warn("Login failed: Incorrect password", zap.String("username", req.Username))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Username, cfg.JWTSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func Profile(c *gin.Context) {
	// userID and username are set by Auth middleware
	userID, _ := c.Get("userID")
	username, _ := c.Get("username")

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id": user.ID,
		"username": username,
		"email": user.Email,
		"created_at": user.CreatedAt,
	})
}
