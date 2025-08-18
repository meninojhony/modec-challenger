from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from .config import settings
from .database import create_tables
from .api.routes.contracts import router as contracts_router, category_router
from .api.exceptions import (
    ContractException, contract_exception_handler,
    http_exception_handler, validation_exception_handler,
    general_exception_handler
)

# Create FastAPI app
app = FastAPI(
    title=settings.project_name,
    description="A comprehensive API for managing service and vendor contracts",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(ContractException, contract_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(ValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Include routers
app.include_router(contracts_router, prefix=settings.api_v1_str)
app.include_router(category_router, prefix=settings.api_v1_str)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    create_tables()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Contract Management API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "service": settings.project_name,
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )