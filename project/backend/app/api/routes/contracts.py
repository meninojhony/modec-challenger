from fastapi import APIRouter, Depends, status
from typing import List

from ...schemas.contract import (
    Category, CategoryCreate, CategoryUpdate,
    Contract, ContractCreate, ContractUpdate, PaginatedResponse, ContractFilters, PaginationParams
)
from ...services.contract import CategoryService, ContractService
from ..dependencies import (
    get_category_service, get_contract_service, verify_delete_confirmation,
    get_pagination_params, get_contract_filters
)

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


# Contracts router
router = APIRouter(prefix="/contracts", tags=["contracts"])


@router.get("/", response_model=PaginatedResponse)
async def list_contracts(
    filters: ContractFilters = Depends(get_contract_filters),
    pagination: PaginationParams = Depends(get_pagination_params),
    contract_service: ContractService = Depends(get_contract_service)
) -> PaginatedResponse:
    """
    List contracts with filtering, search, and pagination.
    
    **Filters:**
    - **supplier**: Filter by supplier name (partial match)
    - **status**: Filter by contract status
    - **category_id**: Filter by category ID
    - **min_value/max_value**: Filter by value range
    - **start_date_from/start_date_to**: Filter by start date range
    - **end_date_from/end_date_to**: Filter by end date range
    - **q**: Text search across contract_number, supplier, description, responsible
    
    **Pagination:**
    - **page**: Page number (starts from 1)
    - **page_size**: Items per page (max 10)
    - **sort_by**: Field to sort by (start_date, end_date, created_at, etc.)
    - **sort_dir**: Sort direction (asc/desc)
    """
    return contract_service.list_contracts(filters, pagination)


@router.get("/{contract_id}", response_model=Contract)
async def get_contract(
    contract_id: str,
    contract_service: ContractService = Depends(get_contract_service)
) -> Contract:
    """
    Get a specific contract by ID.
    
    - **contract_id**: Unique contract identifier (UUID format)
    
    Returns detailed contract information including category details.
    """
    return contract_service.get_contract(contract_id)


@router.post("/", response_model=Contract, status_code=status.HTTP_201_CREATED)
async def create_contract(
    contract_data: ContractCreate,
    contract_service: ContractService = Depends(get_contract_service)
) -> Contract:
    """
    Create a new contract.
    
    - **contract_number**: Unique contract identifier
    - **supplier**: Contract supplier/vendor name
    - **description**: Contract description
    - **category_id**: ID of the contract category (must exist)
    - **responsible**: Person responsible for the contract
    - **status**: Contract status (draft, active, suspended, terminated, expired)
    - **value**: Contract value (must be non-negative)
    - **start_date**: Contract start date (YYYY-MM-DD)
    - **end_date**: Contract end date (must be after start_date)
    
    Returns the created contract with generated ID and timestamps.
    """
    return contract_service.create_contract(contract_data)


@router.put("/{contract_id}", response_model=Contract)
async def update_contract(
    contract_id: str,
    contract_data: ContractUpdate,
    contract_service: ContractService = Depends(get_contract_service)
) -> Contract:
    """
    Update an existing contract.
    
    - **contract_id**: Unique contract identifier (UUID format)
    - **contract_number**: New contract number (optional, must be unique if provided)
    - **supplier**: New supplier name (optional)
    - **description**: New description (optional)
    - **category_id**: New category ID (optional, must exist if provided)
    - **responsible**: New responsible person (optional)
    - **status**: New contract status (optional)
    - **value**: New contract value (optional, must be non-negative)
    - **start_date**: New start date (optional)
    - **end_date**: New end date (optional, must be after start_date)
    
    Only provided fields will be updated. Returns the updated contract with new timestamps.
    Creates a change history record for tracking modifications.
    """
    return contract_service.update_contract(contract_id, contract_data)


@router.delete("/{contract_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contract(
    contract_id: str,
    contract_service: ContractService = Depends(get_contract_service),
    _: bool = Depends(verify_delete_confirmation)
):
    """
    Delete a contract and its associated change history.
    
    - **contract_id**: Unique contract identifier (UUID format)
    - **confirmation**: Must be true to confirm deletion (add ?confirmation=true)
    
    This operation permanently removes the contract and all its change history.
    This action cannot be undone.
    
    **Warning**: This is a destructive operation that will permanently delete
    the contract and all associated data.
    """
    contract_service.delete_contract(contract_id)