package middleware

import (
	"time"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"github.com/gin-gonic/gin"
	"go-testing-app/internal/logger"
)

func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		
		// Generate Correlation ID
		correlationID := uuid.New().String()
		c.Set("CorrelationID", correlationID)
		c.Writer.Header().Set("X-Correlation-ID", correlationID)

		// Process request
		c.Next()

		duration := time.Since(start)
		statusCode := c.Writer.Status()

		logFields := []zap.Field{
			zap.String("correlation_id", correlationID),
			zap.String("method", c.Request.Method),
			zap.String("path", c.Request.URL.Path),
			zap.Int("status", statusCode),
			zap.Duration("duration", duration),
			zap.String("ip", c.ClientIP()),
		}

		if statusCode >= 500 {
			logger.Log.Error("Server error", logFields...)
		} else if statusCode >= 400 {
			logger.Log.Warn("Client error", logFields...)
		} else {
			logger.Log.Info("Request processed", logFields...)
		}
	}
}
