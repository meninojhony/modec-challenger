from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, JSON, Enum, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from ..database import Base


class ContractStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    TERMINATED = "terminated"
    EXPIRED = "expired"


class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    contracts = relationship("Contract", back_populates="category")


class Contract(Base):
    __tablename__ = "contracts"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    contract_number = Column(String(100), unique=True, nullable=False, index=True)
    supplier = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)
    responsible = Column(String(200), nullable=False, index=True)
    status = Column(Enum(ContractStatus), nullable=False, default=ContractStatus.DRAFT, index=True)
    value = Column(Numeric(15, 2), nullable=False, index=True)
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    category = relationship("Category", back_populates="contracts")
    change_history = relationship("ChangeHistory", back_populates="contract", cascade="all, delete-orphan")


class ChangeHistory(Base):
    __tablename__ = "change_history"
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(String(36), ForeignKey("contracts.id"), nullable=False, index=True)
    changed_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    changed_by = Column(String(200), nullable=False)
    changes = Column(JSON, nullable=False)  # {"field": {"old": "value", "new": "value"}}
    
    # Relationships
    contract = relationship("Contract", back_populates="change_history")


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())