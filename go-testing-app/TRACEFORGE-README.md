# TraceForge SDK Configuration for Go

TraceForge has been initialized in your project! A `.env` file was created or updated with your API key and Ingest URL.

## Step 1: Install Dependency
Run the following command in your terminal:
```bash
go get github.com/khushalp2004/TraceForge/packages/sdk-go@latest
```

## Step 2: Initialize TraceForge
Add this to your `main.go` file as early as possible. (Make sure you load your `.env` file using something like `godotenv` first!)

```go
import "github.com/khushalp2004/TraceForge/packages/sdk-go"

func main() {
    // Load your .env file here (e.g. godotenv.Load())
    
    // Automatically reads TRACEFORGE_API_KEY and TRACEFORGE_INGEST_URL from the environment
    traceforge.Init()
    
    // ... rest of your code
}
```

## Step 3: Register Middleware
TraceForge provides a **Zero-Touch APM Middleware**! 

When you add this middleware, it will automatically wrap your HTTP responses. It requires **zero manual configuration in your handlers** to capture:
- Unhandled Panics (via standard `recover()`)
- Handled Errors (intercepts any HTTP 400-599 responses)
- Route Not Found (intercepts HTTP 404 responses)

### For Gin
```go
import tfgin "github.com/khushalp2004/TraceForge/packages/sdk-go/integrations/gin"

// Note: Ensure TraceForge is added AFTER global catch-alls like gin.Recovery()
router := gin.Default()
router.Use(tfgin.TraceForge())
```

### For Echo
```go
import tfecho "github.com/khushalp2004/TraceForge/packages/sdk-go/integrations/echo"

e := echo.New()
e.Use(tfecho.TraceForge())
```

### For net/http
```go
import tfhttp "github.com/khushalp2004/TraceForge/packages/sdk-go/integrations/nethttp"

mux := http.NewServeMux()
// ... register routes on mux ...

// Wrap your entire router
log.Fatal(http.ListenAndServe(":8080", tfhttp.TraceForge(mux)))
```

*(You can safely delete this file once you have finished configuring TraceForge!)*
