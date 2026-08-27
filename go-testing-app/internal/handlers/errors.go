package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"go-testing-app/internal/cache"
	"go-testing-app/internal/database"

	"github.com/gin-gonic/gin"
)

type User struct {
	Name string
}

func NilPointer(c *gin.Context) {
	var user *User
	fmt.Println(user.Name) // This will panic
	c.JSON(http.StatusOK, gin.H{"message": "This will never be reached"})
}


func SliceIndex(c *gin.Context) {
	numbers := []int{}
	fmt.Println(numbers[5]) // This will panic
	c.JSON(http.StatusOK, gin.H{"message": "This will never be reached"})
}

func MapKeyError(c *gin.Context) {
	data := make(map[string]string)
	
	val := data["missing_key"]
	val2, ok := data["missing_key"]

	c.JSON(http.StatusOK, gin.H{
		"zero_value": val,
		"comma_ok_idiom": map[string]interface{}{
			"value": val2,
			"ok": ok,
		},
		"message": "In Go, accessing a missing map key returns the zero value of the value type. Use the comma-ok idiom to check if a key exists.",
	})

}

func JSONDecodeError(c *gin.Context) {
	badJSON := `{"name": "test", ` // malformed JSON
	var result map[string]interface{}
	err := json.Unmarshal([]byte(badJSON), &result)
	
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, result)
}

func DatabaseFailure(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database unavailable"})
		return
	}
	
	err := database.DB.Exec("SELECT * FROM nonexistent_table").Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Database error: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Database is connected"})
}

func RedisFailure(c *gin.Context) {
	if cache.Client == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cache unavailable"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Millisecond)
	defer cancel()

	_, err := cache.Client.Ping(ctx).Result()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cache connection failed: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cache is working"})
}

func MissingEnvVar(c *gin.Context) {
	val := os.Getenv("NON_EXISTENT_VAR")
	if val == "" {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "missing required configuration NON_EXISTENT_VAR",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{"value": val})
}

func FileSystemError(c *gin.Context) {
	_, err := os.Open("/nonexistent_file.txt")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "File opened successfully"})
}

func ContextTimeout(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 100*time.Millisecond)
	defer cancel()

	select {
	case <-time.After(200 * time.Millisecond):
		c.JSON(http.StatusOK, gin.H{"message": "Operation completed"})
	case <-ctx.Done():
		c.JSON(http.StatusRequestTimeout, gin.H{
			"error": "Context timeout: " + ctx.Err().Error(),
		})
	}
}
