from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.logger import logger
from app.core.exceptions import AppError
from sqlalchemy.exc import DatabaseError as SADatabaseError
import sys

import traceforge

async def app_error_handler(request: Request, exc: AppError):
    logger.error("app_error", error_code=exc.error_code, message=exc.message)
    traceforge.capture_exception(exc)
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": exc.message, "errorCode": exc.error_code}
    )

async def validation_error_handler(request: Request, exc: RequestValidationError):
    logger.warning("validation_error", details=exc.errors())
    traceforge.capture_exception(exc)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"success": False, "message": "Validation failed", "errorCode": "VALIDATION_ERROR", "details": exc.errors()}
    )


async def db_error_handler(request: Request, exc: SADatabaseError):
    logger.error("database_error", error=str(exc))
    traceforge.capture_exception(exc, tags={"framework": "fastapi"}, payload={"url": str(request.url), "method": request.method})
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "message": "Database unavailable", "errorCode": "DB_CONNECTION_ERROR"}
    )

async def global_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", error=str(exc), type=type(exc).__name__)
    traceforge.capture_exception(exc, tags={"framework": "fastapi"}, payload={"url": str(request.url), "method": request.method})
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "message": "Internal server error", "errorCode": "INTERNAL_ERROR"}
    )

def setup_exception_handlers(app):
    app.add_exception_handler(AppError, app_error_handler)
    app.add_exception_handler(RequestValidationError, validation_error_handler)
    app.add_exception_handler(SADatabaseError, db_error_handler)
    app.add_exception_handler(Exception, global_exception_handler)

def handle_sys_excepthook(exc_type, exc_value, exc_traceback):
    if issubclass(exc_type, KeyboardInterrupt):
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
        return
    logger.error("uncaught_exception", exc_info=(exc_type, exc_value, exc_traceback))

sys.excepthook = handle_sys_excepthook
