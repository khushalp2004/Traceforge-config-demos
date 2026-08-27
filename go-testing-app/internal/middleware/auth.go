package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"go-testing-app/internal/utils"
	"go-testing-app/internal/logger"
	"go.uber.org/zap"
)

func Auth(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			logger.Log.Warn("Authentication failed: Missing token", zap.String("path", c.Request.URL.Path))
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing JWT"})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			logger.Log.Warn("Authentication failed: Invalid format", zap.String("path", c.Request.URL.Path))
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid JWT format"})
			return
		}

		tokenString := parts[1]
		claims, err := utils.VerifyToken(tokenString, jwtSecret)
		if err != nil {
			logger.Log.Warn("Authentication failed: Invalid/Expired token", zap.Error(err))
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired JWT"})
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("username", claims.Username)
		c.Next()
	}
}
