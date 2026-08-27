package cache

import (
	"context"
	"fmt"
	"log"
	"time"

	"go-testing-app/internal/config"
	"go-testing-app/internal/logger"
	"github.com/redis/go-redis/v9"
)

var Client *redis.Client
var Ctx = context.Background()

func InitRedis(cfg *config.Config) {
	Client = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort),
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	// Test connection with a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	_, err := Client.Ping(ctx).Result()
	if err != nil {
		logger.Log.Warn("Failed to connect to Redis: " + err.Error())
		// Not returning fatal so app can run without redis (for Error Lab)
	} else {
		log.Println("Redis connected successfully")
	}
}
