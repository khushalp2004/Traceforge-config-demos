from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.logger import setup_logging, logger
from app.core.config import settings
from app.middleware.request_logger import RequestLoggerMiddleware
from app.middleware.error_handler import setup_exception_handlers
from app.api import dashboard, health, auth, users, errors, performance, educational
import traceforge
from dotenv import load_dotenv
from traceforge.integrations import fastapi

setup_logging()
load_dotenv() # Load variables from .env

# Automatically reads TRACEFORGE_API_KEY from .env
traceforge.init()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("startup", message="Starting up Python Testing App")
    yield
    logger.info("shutdown", message="Shutting down Python Testing App")

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)
fastapi.init(app)

# Middleware
app.add_middleware(RequestLoggerMiddleware)

# Exception Handlers
setup_exception_handlers(app)

# Routers
app.include_router(dashboard.router)
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(errors.router)
app.include_router(performance.router)
app.include_router(educational.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
