from sqlalchemy.orm import Session
from typing import List, Optional, Tuple, Dict, Any
from fastapi import HTTPException, status
from ..repositories.contract import ContractRepository, CategoryRepository, ChangeHistoryRepository
from ..schemas.contract import (
    ContractCreate, ContractUpdate, ContractFilters, PaginationParams,
    Contract, Category, ChangeHistory, PaginatedResponse, CategoryCreate, CategoryUpdate
)
from ..models.contract import Contract as ContractModel
import math


class ContractService:
    def __init__(self, db: Session):
        self.db = db
        self.contract_repo = ContractRepository(db)
        self.category_repo = CategoryRepository(db)
        self.change_history_repo = ChangeHistoryRepository(db)

    def create_contract(self, contract_data: ContractCreate, created_by: str = "system") -> Contract:
        """Create a new contract with validation"""
        # Check if contract number already exists
        existing = self.contract_repo.get_by_contract_number(contract_data.contract_number)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Contract with number '{contract_data.contract_number}' already exists"
            )
        
        # Check if category exists
        category = self.category_repo.get_by_id(contract_data.category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with id {contract_data.category_id} does not exist"
            )
        
        # Create contract
        contract = self.contract_repo.create(contract_data)
        
        # Log creation in change history
        self.change_history_repo.create(
            contract_id=contract.id,
            changed_by=created_by,
            changes={"action": {"old": None, "new": "created"}}
        )
        
        return Contract.model_validate(contract)

    def get_contract(self, contract_id: str) -> Contract:
        """Get contract by ID"""
        contract = self.contract_repo.get_by_id(contract_id)
        if not contract:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Contract with id '{contract_id}' not found"
            )
        return Contract.model_validate(contract)

    def list_contracts(self, filters: ContractFilters, pagination: PaginationParams) -> PaginatedResponse:
        """List contracts with filtering and pagination"""
        contracts, total = self.contract_repo.get_multi(filters, pagination)
        
        # Calculate pagination info
        total_pages = math.ceil(total / pagination.page_size) if total > 0 else 0
        
        return PaginatedResponse(
            items=[Contract.model_validate(contract) for contract in contracts],
            total=total,
            page=pagination.page,
            page_size=pagination.page_size,
            pages=total_pages
        )

    def update_contract(self, contract_id: str, contract_data: ContractUpdate, updated_by: str = "system") -> Contract:
        """Update contract with change tracking"""
        # Get existing contract
        existing_contract = self.contract_repo.get_by_id(contract_id)
        if not existing_contract:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Contract with id '{contract_id}' not found"
            )
        
        # Check for contract number uniqueness if it's being updated
        update_data = contract_data.model_dump(exclude_unset=True)
        if "contract_number" in update_data:
            existing_by_number = self.contract_repo.get_by_contract_number(update_data["contract_number"])
            if existing_by_number and existing_by_number.id != contract_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Contract with number '{update_data['contract_number']}' already exists"
                )
        
        # Check category exists if it's being updated
        if "category_id" in update_data:
            category = self.category_repo.get_by_id(update_data["category_id"])
            if not category:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Category with id {update_data['category_id']} does not exist"
                )
        
        # Track changes for history
        changes = {}
        for field, new_value in update_data.items():
            old_value = getattr(existing_contract, field)
            if old_value != new_value:
                changes[field] = {"old": str(old_value), "new": str(new_value)}
        
        # Update contract
        updated_contract = self.contract_repo.update(contract_id, contract_data)
        
        # Log changes if any
        if changes:
            self.change_history_repo.create(
                contract_id=contract_id,
                changed_by=updated_by,
                changes=changes
            )
        
        return Contract.model_validate(updated_contract)

    def delete_contract(self, contract_id: str, deleted_by: str = "system") -> None:
        """Delete contract"""
        contract = self.contract_repo.get_by_id(contract_id)
        if not contract:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Contract with id '{contract_id}' not found"
            )
        
        # Log deletion before removing
        self.change_history_repo.create(
            contract_id=contract_id,
            changed_by=deleted_by,
            changes={"action": {"old": "active", "new": "deleted"}}
        )
        
        success = self.contract_repo.delete(contract_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete contract"
            )


class CategoryService:
    def __init__(self, db: Session):
        self.db = db
        self.category_repo = CategoryRepository(db)

    def create_category(self, category_data: CategoryCreate) -> Category:
        """Create a new category"""
        # Check if name already exists
        existing = self.category_repo.get_by_name(category_data.name)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Category with name '{category_data.name}' already exists"
            )
        
        category = self.category_repo.create(category_data.name, category_data.description)
        return Category.model_validate(category)

    def get_category(self, category_id: int) -> Category:
        """Get category by ID"""
        category = self.category_repo.get_by_id(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )
        return Category.model_validate(category)

    def get_all_categories(self) -> List[Category]:
        """Get all categories"""
        categories = self.category_repo.get_all()
        return [Category.model_validate(category) for category in categories]

    def update_category(self, category_id: int, category_data: CategoryUpdate) -> Category:
        """Update category"""
        category = self.category_repo.get_by_id(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )
        
        # Check name uniqueness if it's being updated
        update_data = category_data.model_dump(exclude_unset=True)
        if "name" in update_data:
            existing = self.category_repo.get_by_name(update_data["name"])
            if existing and existing.id != category_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Category with name '{update_data['name']}' already exists"
                )
        
        # Update fields
        for field, value in update_data.items():
            setattr(category, field, value)
        
        self.db.commit()
        self.db.refresh(category)
        return Category.model_validate(category)

    def delete_category(self, category_id: int) -> None:
        """Delete category"""
        category = self.category_repo.get_by_id(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )
        
        # Check if category has contracts
        from ..models.contract import Contract
        contracts_count = self.db.query(Contract).filter(Contract.category_id == category_id).count()
        if contracts_count > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot delete category. It has {contracts_count} associated contracts."
            )
        
        self.db.delete(category)
        self.db.commit()