package database

import (
	"log"

	"go-testing-app/internal/config"
	"go-testing-app/internal/logger"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB(cfg *config.Config) {
	db, err := gorm.Open(sqlite.Open("testing_app.db"), &gorm.Config{})
	if err != nil {
		logger.Log.Fatal("Failed to connect to database: " + err.Error())
	}

	DB = db
	log.Println("Database connected successfully (SQLite)")
}
