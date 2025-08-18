from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from decimal import Decimal
from ..models.contract import ContractStatus


# Base schemas
class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None


class Category(CategoryBase):
    id: int
    created_at: datetime
    
    model_config = {"from_attributes": True}


# Contract schemas
class ContractBase(BaseModel):
    contract_number: str = Field(..., max_length=100)
    supplier: str = Field(..., max_length=200)
    description: str
    category_id: int
    responsible: str = Field(..., max_length=200)
    status: ContractStatus = ContractStatus.DRAFT
    value: Decimal = Field(..., ge=0)
    start_date: date
    end_date: date
    
    @validator('end_date')
    def validate_end_date(cls, v, values):
        if 'start_date' in values and v <= values['start_date']:
            raise ValueError('end_date must be after start_date')
        return v


class ContractCreate(ContractBase):
    pass


class ContractUpdate(BaseModel):
    contract_number: Optional[str] = Field(None, max_length=100)
    supplier: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    category_id: Optional[int] = None
    responsible: Optional[str] = Field(None, max_length=200)
    status: Optional[ContractStatus] = None
    value: Optional[Decimal] = Field(None, ge=0)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    
    @validator('end_date')
    def validate_end_date(cls, v, values):
        if v and 'start_date' in values and values['start_date'] and v <= values['start_date']:
            raise ValueError('end_date must be after start_date')
        return v


class Contract(ContractBase):
    id: str
    created_at: datetime
    updated_at: datetime
    category: Category
    
    model_config = {"from_attributes": True}


# Change History schemas
class ChangeHistoryBase(BaseModel):
    contract_id: str
    changed_by: str = Field(..., max_length=200)
    changes: Dict[str, Dict[str, Any]]


class ChangeHistoryCreate(ChangeHistoryBase):
    pass


class ChangeHistory(ChangeHistoryBase):
    id: int
    changed_at: datetime
    
    model_config = {"from_attributes": True}


# Pagination and filtering schemas
class ContractFilters(BaseModel):
    supplier: Optional[str] = None
    status: Optional[ContractStatus] = None
    category_id: Optional[int] = None
    min_value: Optional[Decimal] = Field(None, ge=0)
    max_value: Optional[Decimal] = Field(None, ge=0)
    start_date_from: Optional[date] = None
    start_date_to: Optional[date] = None
    end_date_from: Optional[date] = None
    end_date_to: Optional[date] = None
    q: Optional[str] = None  # Text search
    
    @validator('max_value')
    def validate_value_range(cls, v, values):
        if v and 'min_value' in values and values['min_value'] and v < values['min_value']:
            raise ValueError('max_value must be greater than or equal to min_value')
        return v


class PaginationParams(BaseModel):
    page: int = Field(1, ge=1)
    page_size: int = Field(10, ge=1, le=10)
    sort_by: str = "start_date"
    sort_dir: str = Field("desc", pattern="^(asc|desc)$")


class PaginatedResponse(BaseModel):
    items: List[Contract]
    total: int
    page: int
    page_size: int
    pages: int