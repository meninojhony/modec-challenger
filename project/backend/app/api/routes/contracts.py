from fastapi import APIRouter, Depends, status
from typing import List

from ...schemas.contract import Category, CategoryCreate
from ...services.contract import CategoryService
from ..dependencies import get_category_service

# Category router
category_router = APIRouter(prefix="/categories", tags=["categories"])


@category_router.get("/", response_model=List[Category])
async def list_categories(
    category_service: CategoryService = Depends(get_category_service)
) -> List[Category]:
    """
    Get all categories.
    
    Returns a list of all available contract categories.
    """
    return category_service.get_all_categories()


@category_router.post("/", response_model=Category, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    category_service: CategoryService = Depends(get_category_service)
) -> Category:
    """
    Create a new category.
    
    - **name**: Category name (must be unique)
    - **description**: Optional category description
    """
    return category_service.create_category(category_data)