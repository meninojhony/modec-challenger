from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import ValidationError
import logging

logger = logging.getLogger(__name__)


class ContractException(Exception):
    """Base exception for contract-related errors"""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class ContractNotFoundError(ContractException):
    """Raised when contract is not found"""
    def __init__(self, contract_id: str):
        super().__init__(f"Contract with id '{contract_id}' not found", 404)


class ContractAlreadyExistsError(ContractException):
    """Raised when contract already exists"""
    def __init__(self, contract_number: str):
        super().__init__(f"Contract with number '{contract_number}' already exists", 409)


async def contract_exception_handler(request: Request, exc: ContractException):
    """Handle contract-specific exceptions"""
    logger.error(f"Contract exception: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.__class__.__name__,
                "message": exc.message
            }
        }
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with consistent format"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": "HTTPException",
                "message": exc.detail
            }
        }
    )


async def validation_exception_handler(request: Request, exc: ValidationError):
    """Handle validation errors with detailed messages"""
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "ValidationError",
                "message": "Validation failed",
                "details": exc.errors()
            }
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "InternalServerError",
                "message": "An unexpected error occurred"
            }
        }
    )