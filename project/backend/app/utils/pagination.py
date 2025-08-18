"""
Pagination utilities
"""
from typing import List, TypeVar, Generic
from pydantic import BaseModel
import math

T = TypeVar('T')


class PaginationMeta(BaseModel):
    """Pagination metadata"""
    page: int
    page_size: int
    total: int
    pages: int
    has_next: bool
    has_prev: bool


class PaginatedResult(BaseModel, Generic[T]):
    """Generic paginated result"""
    items: List[T]
    meta: PaginationMeta


def paginate(
    items: List[T],
    page: int,
    page_size: int,
    total: int
) -> PaginatedResult[T]:
    """Create paginated result from items and metadata"""
    pages = math.ceil(total / page_size) if total > 0 else 1
    
    meta = PaginationMeta(
        page=page,
        page_size=page_size,
        total=total,
        pages=pages,
        has_next=page < pages,
        has_prev=page > 1
    )
    
    return PaginatedResult(items=items, meta=meta)