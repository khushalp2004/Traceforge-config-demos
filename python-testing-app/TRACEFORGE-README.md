# TraceForge SDK Configuration

TraceForge has been initialized in your project! A `.env` file was created or updated with your API key and Ingest URL.

## Step 1: Install Dependencies
Run the following command to install the required packages:
```bash
pip install usetraceforge python-dotenv
```

## Step 2: Initialize TraceForge
Add this as early as possible in your application lifecycle (e.g., `settings.py` or `main.py`):

```python
import traceforge
from dotenv import load_dotenv

load_dotenv() # Load variables from .env

# Automatically reads TRACEFORGE_API_KEY from .env
traceforge.init()
```

### For Django Applications
Add the middleware to the **END** of your `MIDDLEWARE` list in `settings.py`:
```python
MIDDLEWARE = [
    # ... your other middlewares
    'traceforge.integrations.django.TraceForgeMiddleware',
]
```

### For FastAPI Applications
Register the exception handler immediately after creating your app instance:
```python
from fastapi import FastAPI
from traceforge.integrations import fastapi
import traceforge

app = FastAPI()
fastapi.init(app)
```

> **⚠️ Using pydantic-settings?**
> If your application uses `pydantic-settings` to load environment variables, Pydantic might throw a `ValidationError` (Extra inputs are not permitted) because the TraceForge CLI automatically added keys to your `.env` file.
> 
> To fix this, simply add the keys to your Settings class and set `extra="ignore"`:
> ```python
> from pydantic_settings import BaseSettings, SettingsConfigDict
>
> class Settings(BaseSettings):
>     # ... your existing variables
>     TRACEFORGE_API_KEY: str | None = None
>     TRACEFORGE_INGEST_URL: str | None = None
> 
>     model_config = SettingsConfigDict(env_file=".env", extra="ignore")
> ```

*(You can safely delete this file once you have finished configuring TraceForge!)*
