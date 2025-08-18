"""
Database initialization script
Creates all tables and indexes for the contract management system
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, Index
from app.database import Base
from app.models.contract import Contract, Category, ChangeHistory, User
from app.config import settings


def create_indexes(engine):
    """Create additional indexes for performance"""
    with engine.connect() as conn:
        # Contract indexes for filtering and search
        Index('idx_contract_supplier_status', Contract.supplier, Contract.status).create(conn, checkfirst=True)
        Index('idx_contract_dates', Contract.start_date, Contract.end_date).create(conn, checkfirst=True)
        Index('idx_contract_value_status', Contract.value, Contract.status).create(conn, checkfirst=True)
        Index('idx_contract_search', Contract.contract_number, Contract.supplier, Contract.responsible).create(conn, checkfirst=True)
        
        # Change history indexes
        Index('idx_change_history_contract_date', ChangeHistory.contract_id, ChangeHistory.changed_at).create(conn, checkfirst=True)
        
        print("+ Additional indexes created successfully")


def init_database():
    """Initialize the database with tables and indexes"""
    print("Initializing database...")
    
    # Create engine
    engine = create_engine(settings.database_url)
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("+ Database tables created successfully")
    
    # Create additional indexes
    create_indexes(engine)
    
    print("+ Database initialization completed!")


if __name__ == "__main__":
    init_database()