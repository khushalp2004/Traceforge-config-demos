package handlers

import (
	"context"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

func CPUIntensive(c *gin.Context) {
	// Simulate heavy CPU work
	result := 0
	for i := 0; i < 100000000; i++ {
		result += i
	}
	c.JSON(http.StatusOK, gin.H{"result": result})
}

func MemoryLeak(c *gin.Context) {
	// Create a package-level or closure leak
	// This is a simplified demo
	leakySlice := make([]byte, 10<<20) // 10 MB per request
	globalLeak = append(globalLeak, leakySlice)
	c.JSON(http.StatusOK, gin.H{"message": "Memory leaked", "size_mb": len(globalLeak) * 10})
}

var globalLeak [][]byte

func GoroutineLeak(c *gin.Context) {
	// Start a goroutine that never finishes
	go func() {
		ch := make(chan int)
		<-ch // Blocks forever
	}()
	c.JSON(http.StatusOK, gin.H{"message": "Goroutine leaked"})
}

var counter int

func RaceCondition(c *gin.Context) {
	// Start multiple goroutines incrementing the counter without sync
	var wg sync.WaitGroup
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			counter++
		}()
	}
	wg.Wait()
	c.JSON(http.StatusOK, gin.H{"counter": counter, "message": "Run tests with -race to see the warning"})
}

func Deadlock(c *gin.Context) {
	ch := make(chan int)
	ch <- 1 // Blocks because there is no receiver
	c.JSON(http.StatusOK, gin.H{"message": "This will not be reached due to deadlock"})
}

func ContextCancellation(c *gin.Context) {
	ctx, cancel := context.WithCancel(context.Background())
	
	go func() {
		time.Sleep(100 * time.Millisecond)
		cancel()
	}()

	select {
	case <-time.After(1 * time.Second):
		c.JSON(http.StatusOK, gin.H{"message": "Completed"})
	case <-ctx.Done():
		c.JSON(http.StatusOK, gin.H{"message": "Cancelled gracefully"})
	}
}
