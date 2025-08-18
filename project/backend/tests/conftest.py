"""
Test configuration and fixtures
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import get_db, Base
from app.models.contract import Category, Contract, ContractStatus
from app.schemas.contract import ContractCreate
from datetime import date
from decimal import Decimal


# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test"""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def client():
    """Create a test client"""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def sample_category(db_session):
    """Create a sample category for testing"""
    category = Category(
        name="Software Licensing",
        description="Software licenses and subscriptions"
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)
    return category


@pytest.fixture
def sample_contract_data(sample_category):
    """Sample contract data for testing"""
    return {
        "contract_number": "TEST-2024-001",
        "supplier": "Test Supplier Inc",
        "description": "Test contract description",
        "category_id": sample_category.id,
        "responsible": "test.user",
        "status": "active",
        "value": "50000.00",
        "start_date": "2024-01-01",
        "end_date": "2024-12-31"
    }


@pytest.fixture
def sample_contract(db_session, sample_category):
    """Create a sample contract in the database"""
    contract = Contract(
        contract_number="TEST-2024-001",
        supplier="Test Supplier Inc",
        description="Test contract description",
        category_id=sample_category.id,
        responsible="test.user",
        status=ContractStatus.ACTIVE,
        value=Decimal("50000.00"),
        start_date=date(2024, 1, 1),
        end_date=date(2024, 12, 31)
    )
    db_session.add(contract)
    db_session.commit()
    db_session.refresh(contract)
    return contract


@pytest.fixture
def multiple_contracts(db_session, sample_category):
    """Create multiple contracts for testing filtering and pagination"""
    contracts = []
    
    contract_data = [
        {
            "contract_number": "TEST-2024-001",
            "supplier": "Microsoft Corporation",
            "status": ContractStatus.ACTIVE,
            "value": Decimal("100000.00"),
            "start_date": date(2024, 1, 1),
            "end_date": date(2024, 12, 31)
        },
        {
            "contract_number": "TEST-2024-002", 
            "supplier": "Google LLC",
            "status": ContractStatus.DRAFT,
            "value": Decimal("75000.00"),
            "start_date": date(2024, 6, 1),
            "end_date": date(2025, 5, 31)
        },
        {
            "contract_number": "TEST-2024-003",
            "supplier": "Amazon Web Services", 
            "status": ContractStatus.EXPIRED,
            "value": Decimal("50000.00"),
            "start_date": date(2023, 1, 1),
            "end_date": date(2023, 12, 31)
        }
    ]
    
    for data in contract_data:
        contract = Contract(
            description="Test description",
            category_id=sample_category.id,
            responsible="test.user",
            **data
        )
        db_session.add(contract)
        contracts.append(contract)
    
    db_session.commit()
    for contract in contracts:
        db_session.refresh(contract)
    
    return contracts