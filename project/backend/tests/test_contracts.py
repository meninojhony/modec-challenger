"""
Unit tests for contract-related functionality
"""
import pytest
from app.services.contract import ContractService, CategoryService
from app.schemas.contract import ContractCreate, CategoryCreate
from fastapi import HTTPException
from datetime import date
from decimal import Decimal


class TestContractService:
    """Test contract service functionality"""
    
    def test_create_contract_success(self, db_session, sample_category):
        """Test successful contract creation"""
        service = ContractService(db_session)
        
        contract_data = ContractCreate(
            contract_number="TEST-001",
            supplier="Test Supplier",
            description="Test contract",
            category_id=sample_category.id,
            responsible="test.user",
            status="active",
            value=Decimal("10000.00"),
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31)
        )
        
        contract = service.create_contract(contract_data)
        
        assert contract.contract_number == "TEST-001"
        assert contract.supplier == "Test Supplier"
        assert contract.category.name == sample_category.name
        assert contract.id is not None

    def test_create_contract_duplicate_number(self, db_session, sample_contract):
        """Test contract creation with duplicate contract number"""
        service = ContractService(db_session)
        
        contract_data = ContractCreate(
            contract_number=sample_contract.contract_number,  # Duplicate
            supplier="Another Supplier",
            description="Another contract",
            category_id=sample_contract.category_id,
            responsible="test.user",
            status="active",
            value=Decimal("20000.00"),
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31)
        )
        
        with pytest.raises(HTTPException) as exc_info:
            service.create_contract(contract_data)
        
        assert exc_info.value.status_code == 409
        assert "already exists" in str(exc_info.value.detail)

    def test_create_contract_invalid_category(self, db_session):
        """Test contract creation with invalid category"""
        service = ContractService(db_session)
        
        contract_data = ContractCreate(
            contract_number="TEST-002",
            supplier="Test Supplier",
            description="Test contract",
            category_id=999,  # Non-existent category
            responsible="test.user",
            status="active",
            value=Decimal("10000.00"),
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31)
        )
        
        with pytest.raises(HTTPException) as exc_info:
            service.create_contract(contract_data)
        
        assert exc_info.value.status_code == 400
        assert "does not exist" in str(exc_info.value.detail)

    def test_get_contract_success(self, db_session, sample_contract):
        """Test successful contract retrieval"""
        service = ContractService(db_session)
        
        contract = service.get_contract(sample_contract.id)
        
        assert contract.id == sample_contract.id
        assert contract.contract_number == sample_contract.contract_number

    def test_get_contract_not_found(self, db_session):
        """Test contract retrieval with invalid ID"""
        service = ContractService(db_session)
        
        with pytest.raises(HTTPException) as exc_info:
            service.get_contract("non-existent-id")
        
        assert exc_info.value.status_code == 404


class TestCategoryService:
    """Test category service functionality"""
    
    def test_create_category_success(self, db_session):
        """Test successful category creation"""
        service = CategoryService(db_session)
        
        category_data = CategoryCreate(
            name="Test Category",
            description="Test description"
        )
        
        category = service.create_category(category_data)
        
        assert category.name == "Test Category"
        assert category.description == "Test description"
        assert category.id is not None

    def test_create_category_duplicate_name(self, db_session, sample_category):
        """Test category creation with duplicate name"""
        service = CategoryService(db_session)
        
        category_data = CategoryCreate(
            name=sample_category.name,  # Duplicate name
            description="Different description"
        )
        
        with pytest.raises(HTTPException) as exc_info:
            service.create_category(category_data)
        
        assert exc_info.value.status_code == 409
        assert "already exists" in str(exc_info.value.detail)

    def test_get_all_categories(self, db_session, sample_category):
        """Test retrieving all categories"""
        service = CategoryService(db_session)
        
        categories = service.get_all_categories()
        
        assert len(categories) >= 1
        assert any(cat.name == sample_category.name for cat in categories)

    def test_delete_category_with_contracts(self, db_session, sample_contract):
        """Test deleting category that has associated contracts"""
        service = CategoryService(db_session)
        
        with pytest.raises(HTTPException) as exc_info:
            service.delete_category(sample_contract.category_id)
        
        assert exc_info.value.status_code == 400
        assert "associated contracts" in str(exc_info.value.detail)