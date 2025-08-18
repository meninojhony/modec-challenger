from fastapi import Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from decimal import Decimal
from datetime import date

from ..database import get_db
from ..services.contract import ContractService, CategoryService
from ..schemas.contract import ContractFilters, PaginationParams
from ..models.contract import ContractStatus


def get_contract_service(db: Session = Depends(get_db)) -> ContractService:
    """Dependency to get contract service"""
    return ContractService(db)


def get_category_service(db: Session = Depends(get_db)) -> CategoryService:
    """Dependency to get category service"""
    return CategoryService(db)


def get_pagination_params(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=10, description="Items per page (max 10)"),
    sort_by: str = Query("start_date", description="Field to sort by"),
    sort_dir: str = Query("desc", pattern="^(asc|desc)$", description="Sort direction")
) -> PaginationParams:
    """Dependency to get pagination parameters"""
    return PaginationParams(
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_dir=sort_dir
    )


def get_contract_filters(
    supplier: Optional[str] = Query(None, description="Filter by supplier"),
    status: Optional[ContractStatus] = Query(None, description="Filter by status"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    min_value: Optional[Decimal] = Query(None, ge=0, description="Minimum contract value"),
    max_value: Optional[Decimal] = Query(None, ge=0, description="Maximum contract value"),
    start_date_from: Optional[date] = Query(None, description="Start date from (YYYY-MM-DD)"),
    start_date_to: Optional[date] = Query(None, description="Start date to (YYYY-MM-DD)"),
    end_date_from: Optional[date] = Query(None, description="End date from (YYYY-MM-DD)"),
    end_date_to: Optional[date] = Query(None, description="End date to (YYYY-MM-DD)"),
    q: Optional[str] = Query(None, description="Text search across contract fields")
) -> ContractFilters:
    """Dependency to get contract filters"""
    return ContractFilters(
        supplier=supplier,
        status=status,
        category_id=category_id,
        min_value=min_value,
        max_value=max_value,
        start_date_from=start_date_from,
        start_date_to=start_date_to,
        end_date_from=end_date_from,
        end_date_to=end_date_to,
        q=q
    )


def verify_delete_confirmation(
    confirmation: bool = Query(False, description="Must be true to confirm deletion")
) -> bool:
    """Dependency to verify delete confirmation"""
    if not confirmation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Delete confirmation required. Add ?confirmation=true to the request."
        )
    return confirmation