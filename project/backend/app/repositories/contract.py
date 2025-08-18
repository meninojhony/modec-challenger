from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, desc, asc, func
from typing import List, Optional, Tuple, Dict, Any
from ..models.contract import Contract, Category, ChangeHistory, ContractStatus
from ..schemas.contract import ContractCreate, ContractUpdate, ContractFilters, PaginationParams
import math


class ContractRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, contract_data: ContractCreate) -> Contract:
        """Create a new contract"""
        db_contract = Contract(**contract_data.model_dump())
        self.db.add(db_contract)
        self.db.commit()
        self.db.refresh(db_contract)
        return self._get_with_category(db_contract.id)

    def get_by_id(self, contract_id: str) -> Optional[Contract]:
        """Get contract by ID with category"""
        return self._get_with_category(contract_id)

    def get_by_contract_number(self, contract_number: str) -> Optional[Contract]:
        """Get contract by contract number"""
        return (
            self.db.query(Contract)
            .options(joinedload(Contract.category))
            .filter(Contract.contract_number == contract_number)
            .first()
        )

    def update(self, contract_id: str, contract_data: ContractUpdate) -> Optional[Contract]:
        """Update contract"""
        db_contract = self.db.query(Contract).filter(Contract.id == contract_id).first()
        if not db_contract:
            return None
        
        update_data = contract_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_contract, field, value)
        
        self.db.commit()
        self.db.refresh(db_contract)
        return self._get_with_category(contract_id)

    def delete(self, contract_id: str) -> bool:
        """Delete contract"""
        db_contract = self.db.query(Contract).filter(Contract.id == contract_id).first()
        if not db_contract:
            return False
        
        self.db.delete(db_contract)
        self.db.commit()
        return True

    def get_multi(
        self,
        filters: ContractFilters,
        pagination: PaginationParams
    ) -> Tuple[List[Contract], int]:
        """Get contracts with filtering, search, and pagination"""
        query = self.db.query(Contract).options(joinedload(Contract.category))
        
        # Apply filters
        query = self._apply_filters(query, filters)
        
        # Get total count before pagination
        total = query.count()
        
        # Apply sorting
        query = self._apply_sorting(query, pagination.sort_by, pagination.sort_dir)
        
        # Apply pagination
        offset = (pagination.page - 1) * pagination.page_size
        query = query.offset(offset).limit(pagination.page_size)
        
        contracts = query.all()
        return contracts, total

    def _get_with_category(self, contract_id: str) -> Optional[Contract]:
        """Helper to get contract with category joined"""
        return (
            self.db.query(Contract)
            .options(joinedload(Contract.category))
            .filter(Contract.id == contract_id)
            .first()
        )

    def _apply_filters(self, query, filters: ContractFilters):
        """Apply filters to query"""
        conditions = []
        
        if filters.supplier:
            conditions.append(Contract.supplier.ilike(f"%{filters.supplier}%"))
        
        if filters.status:
            conditions.append(Contract.status == filters.status)
        
        if filters.category_id:
            conditions.append(Contract.category_id == filters.category_id)
        
        if filters.min_value is not None:
            conditions.append(Contract.value >= filters.min_value)
        
        if filters.max_value is not None:
            conditions.append(Contract.value <= filters.max_value)
        
        if filters.start_date_from:
            conditions.append(Contract.start_date >= filters.start_date_from)
        
        if filters.start_date_to:
            conditions.append(Contract.start_date <= filters.start_date_to)
        
        if filters.end_date_from:
            conditions.append(Contract.end_date >= filters.end_date_from)
        
        if filters.end_date_to:
            conditions.append(Contract.end_date <= filters.end_date_to)
        
        # Text search across multiple fields
        if filters.q:
            search_term = f"%{filters.q}%"
            search_conditions = [
                Contract.contract_number.ilike(search_term),
                Contract.supplier.ilike(search_term),
                Contract.description.ilike(search_term),
                Contract.responsible.ilike(search_term)
            ]
            conditions.append(or_(*search_conditions))
        
        if conditions:
            query = query.filter(and_(*conditions))
        
        return query

    def _apply_sorting(self, query, sort_by: str, sort_dir: str):
        """Apply sorting to query"""
        # Map sort fields to model attributes
        sort_fields = {
            "start_date": Contract.start_date,
            "end_date": Contract.end_date,
            "created_at": Contract.created_at,
            "updated_at": Contract.updated_at,
            "contract_number": Contract.contract_number,
            "supplier": Contract.supplier,
            "value": Contract.value,
            "status": Contract.status
        }
        
        sort_field = sort_fields.get(sort_by, Contract.start_date)
        
        if sort_dir == "desc":
            query = query.order_by(desc(sort_field), desc(Contract.id))
        else:
            query = query.order_by(asc(sort_field), asc(Contract.id))
        
        return query


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, name: str, description: Optional[str] = None) -> Category:
        """Create a new category"""
        db_category = Category(name=name, description=description)
        self.db.add(db_category)
        self.db.commit()
        self.db.refresh(db_category)
        return db_category

    def get_by_id(self, category_id: int) -> Optional[Category]:
        """Get category by ID"""
        return self.db.query(Category).filter(Category.id == category_id).first()

    def get_by_name(self, name: str) -> Optional[Category]:
        """Get category by name"""
        return self.db.query(Category).filter(Category.name == name).first()

    def get_all(self) -> List[Category]:
        """Get all categories"""
        return self.db.query(Category).order_by(Category.name).all()


class ChangeHistoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, contract_id: str, changed_by: str, changes: Dict[str, Dict[str, Any]]) -> ChangeHistory:
        """Create change history record"""
        db_change = ChangeHistory(
            contract_id=contract_id,
            changed_by=changed_by,
            changes=changes
        )
        self.db.add(db_change)
        self.db.commit()
        self.db.refresh(db_change)
        return db_change

    def get_by_contract_id(self, contract_id: str) -> List[ChangeHistory]:
        """Get change history for a contract"""
        return (
            self.db.query(ChangeHistory)
            .filter(ChangeHistory.contract_id == contract_id)
            .order_by(desc(ChangeHistory.changed_at))
            .all()
        )