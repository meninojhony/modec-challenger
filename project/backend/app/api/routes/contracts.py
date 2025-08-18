from fastapi import APIRouter, Depends, status
from typing import List

from ...schemas.contract import Category, CategoryCreate, CategoryUpdate
from ...services.contract import CategoryService
from ..dependencies import get_category_service, verify_delete_confirmation

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


@category_router.get("/{category_id}", response_model=Category)
async def get_category(
    category_id: int,
    category_service: CategoryService = Depends(get_category_service)
) -> Category:
    """
    Get a specific category by ID.
    
    - **category_id**: Unique category identifier
    """
    return category_service.get_category(category_id)


@category_router.put("/{category_id}", response_model=Category)
async def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    category_service: CategoryService = Depends(get_category_service)
) -> Category:
    """
    Update an existing category.
    
    - **category_id**: Unique category identifier
    - **name**: New category name (optional)
    - **description**: New category description (optional)
    """
    return category_service.update_category(category_id, category_data)


@category_router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: int,
    category_service: CategoryService = Depends(get_category_service),
    _: bool = Depends(verify_delete_confirmation)
):
    """
    Delete a category.
    
    - **category_id**: Unique category identifier
    - **confirmation**: Must be true to confirm deletion (add ?confirmation=true)
    
    Note: Cannot delete categories that have associated contracts.
    """
    category_service.delete_category(category_id)