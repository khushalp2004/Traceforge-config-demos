package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"go-testing-app/internal/cache"
	"go-testing-app/internal/config"
	"go-testing-app/internal/database"
	"go-testing-app/internal/logger"
	"go-testing-app/internal/models"
	"go-testing-app/internal/routes"

	"github.com/joho/godotenv"
	"go.uber.org/zap"
)

import "github.com/khushalp2004/TraceForge/packages/sdk-go"

// @title Go Testing App API
// @version 1.0
// @description Production-style Go backend for learning debugging and incidents.
// @host localhost:8080
// @BasePath /
func main() {
	godotenv.Load()
	// Load Configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	traceforge.Init()

	// Initialize Logger
	logger.InitLogger(cfg.AppEnv)
	defer logger.Log.Sync()

	// Initialize DB
	database.InitDB(cfg)
	// Migrate models
	database.DB.AutoMigrate(&models.User{})

	// Initialize Redis
	cache.InitRedis(cfg)

	// Setup Router
	r := routes.SetupRouter(cfg)

	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: r,
	}

	// Initializing the server in a goroutine so that it won't block
	go func() {
		logger.Log.Info("Starting server", zap.String("port", cfg.Port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Log.Fatal("Listen and serve error: ", zap.Error(err))
		}
	}()

	// Wait for interrupt signal to gracefully shut down the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Log.Info("Shutting down server...")

	// The context is used to inform the server it has 5 seconds to finish
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		logger.Log.Fatal("Server forced to shutdown: ", zap.Error(err))
	}

	logger.Log.Info("Server exiting")
}
