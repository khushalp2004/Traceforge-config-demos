package routes

import (
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"go-testing-app/internal/config"
	"go-testing-app/internal/handlers"
	"go-testing-app/internal/middleware"
)

import tfgin "github.com/khushalp2004/TraceForge/packages/sdk-go/integrations/gin"

func SetupRouter(cfg *config.Config) *gin.Engine {
	r := gin.Default()
	
	// Global middlewares
	r.Use(middleware.RequestLogger())
	r.Use(middleware.Recovery())
	r.Use(tfgin.TraceForge())
	
	// Swagger endpoint
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.GET("/health", handlers.HealthCheck)
	r.GET("/", handlers.MainDashboard)

	// Error Laboratory
	errGroup := r.Group("/errors")
	{
		errGroup.GET("/nil-pointer", handlers.NilPointer)
		errGroup.GET("/slice", handlers.SliceIndex)
		errGroup.GET("/map", handlers.MapKeyError)
		errGroup.POST("/json", handlers.JSONDecodeError)
		errGroup.GET("/database", handlers.DatabaseFailure)
		errGroup.GET("/cache", handlers.RedisFailure)
		errGroup.GET("/env", handlers.MissingEnvVar)
		errGroup.GET("/file", handlers.FileSystemError)
		errGroup.GET("/context-timeout", handlers.ContextTimeout)
	}

	// Performance Laboratory
	perfGroup := r.Group("/performance")
	{
		perfGroup.GET("/cpu", handlers.CPUIntensive)
		perfGroup.GET("/memory", handlers.MemoryLeak)
		perfGroup.GET("/goroutine", handlers.GoroutineLeak)
		perfGroup.GET("/race", handlers.RaceCondition)
		perfGroup.GET("/deadlock", handlers.Deadlock)
		perfGroup.GET("/cancel", handlers.ContextCancellation)
	}

	// Authentication
	authGroup := r.Group("/auth")
	{
		authGroup.POST("/register", handlers.Register)
		authGroup.POST("/login", func(c *gin.Context) {
			handlers.Login(c, cfg)
		})
		authGroup.GET("/profile", middleware.Auth(cfg.JWTSecret), handlers.Profile)
	}

	// Users
	usersGroup := r.Group("/users")
	usersGroup.Use(middleware.Auth(cfg.JWTSecret))
	{
		usersGroup.GET("/:id", handlers.GetUser)
	}

	// Capture 404 Not Found globally
	r.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"error": "Route not found"})
	})

	return r
}
