class AppError(Exception):
    def __init__(self, message: str, error_code: str, status_code: int = 500):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        super().__init__(self.message)

class NotFoundError(AppError):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, "NOT_FOUND", 404)

class ValidationError(AppError):
    def __init__(self, message: str = "Validation failed"):
        super().__init__(message, "VALIDATION_ERROR", 422)

class AuthError(AppError):
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, "UNAUTHORIZED", 401)

class DatabaseError(AppError):
    def __init__(self, message: str = "Database error"):
        super().__init__(message, "DB_ERROR", 500)
