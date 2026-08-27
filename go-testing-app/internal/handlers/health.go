package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "healthy",
	})
}

func MainDashboard(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"service":     "Go Testing App",
		"status":      "running",
		"environment": "development",
		"goVersion":   "1.24",
	})
}
