"""
Seed script to populate the database with sample data
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import date, timedelta
from decimal import Decimal
from sqlalchemy.orm import sessionmaker
from app.database import engine, Base
from app.models.contract import Category, Contract, ContractStatus

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_categories():
    """Create sample categories"""
    db = SessionLocal()
    
    categories = [
        {
            "name": "Software Licensing",
            "description": "Software licenses and subscriptions"
        },
        {
            "name": "IT Services",
            "description": "Information technology support and consulting"
        },
        {
            "name": "Cloud Services",
            "description": "Cloud computing and hosting services"
        },
        {
            "name": "Security Services",
            "description": "Cybersecurity and data protection services"
        },
        {
            "name": "Hardware Procurement",
            "description": "Computer equipment and hardware purchases"
        },
        {
            "name": "Professional Services",
            "description": "Consulting and professional advisory services"
        }
    ]
    
    db_categories = []
    for cat_data in categories:
        # Check if category already exists
        existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
        if not existing:
            category = Category(**cat_data)
            db.add(category)
            db_categories.append(category)
        else:
            db_categories.append(existing)
    
    db.commit()
    db.refresh(db_categories[0])  # Refresh to get IDs
    print(f"Created {len([c for c in db_categories if c.id])} categories")
    
    db.close()
    return db_categories

def seed_contracts(categories):
    """Create sample contracts"""
    db = SessionLocal()
    
    contracts_data = [
        {
            "contract_number": "SW-2024-001",
            "supplier": "Microsoft Corporation",
            "description": "Office 365 Enterprise subscription for 500 users including Teams, SharePoint, and Exchange Online",
            "category_id": categories[0].id,  # Software Licensing
            "responsible": "john.doe@company.com",
            "status": ContractStatus.ACTIVE,
            "value": Decimal("125000.00"),
            "start_date": date(2024, 1, 1),
            "end_date": date(2024, 12, 31)
        },
        {
            "contract_number": "IT-2024-002",
            "supplier": "TechSupport Pro LLC",
            "description": "24/7 IT support and helpdesk services for desktop and server infrastructure",
            "category_id": categories[1].id,  # IT Services
            "responsible": "jane.smith@company.com",
            "status": ContractStatus.ACTIVE,
            "value": Decimal("180000.00"),
            "start_date": date(2024, 2, 1),
            "end_date": date(2025, 1, 31)
        },
        {
            "contract_number": "CL-2024-003",
            "supplier": "Amazon Web Services",
            "description": "Cloud hosting and compute services including EC2, S3, and RDS database services",
            "category_id": categories[2].id,  # Cloud Services
            "responsible": "mike.wilson@company.com",
            "status": ContractStatus.ACTIVE,
            "value": Decimal("95000.00"),
            "start_date": date(2024, 1, 15),
            "end_date": date(2024, 12, 14)
        },
        {
            "contract_number": "SEC-2024-004",
            "supplier": "CyberGuard Security",
            "description": "Endpoint security management and threat detection for all company devices",
            "category_id": categories[3].id,  # Security Services
            "responsible": "sarah.johnson@company.com",
            "status": ContractStatus.ACTIVE,
            "value": Decimal("75000.00"),
            "start_date": date(2024, 3, 1),
            "end_date": date(2025, 2, 28)
        },
        {
            "contract_number": "HW-2024-005",
            "supplier": "Dell Technologies",
            "description": "Procurement of 100 laptops and 50 desktop computers for new office expansion",
            "category_id": categories[4].id,  # Hardware Procurement
            "responsible": "robert.brown@company.com",
            "status": ContractStatus.TERMINATED,
            "value": Decimal("250000.00"),
            "start_date": date(2024, 1, 10),
            "end_date": date(2024, 6, 10)
        },
        {
            "contract_number": "PS-2024-006",
            "supplier": "McKinsey & Company",
            "description": "Digital transformation consulting and strategy development for Q2-Q4 initiatives",
            "category_id": categories[5].id,  # Professional Services
            "responsible": "lisa.davis@company.com",
            "status": ContractStatus.ACTIVE,
            "value": Decimal("450000.00"),
            "start_date": date(2024, 4, 1),
            "end_date": date(2024, 12, 31)
        },
        {
            "contract_number": "SW-2024-007",
            "supplier": "Salesforce Inc",
            "description": "CRM platform subscription with Sales Cloud and Service Cloud for customer management",
            "category_id": categories[0].id,  # Software Licensing
            "responsible": "john.doe@company.com",
            "status": ContractStatus.ACTIVE,
            "value": Decimal("85000.00"),
            "start_date": date(2024, 2, 15),
            "end_date": date(2025, 2, 14)
        },
        {
            "contract_number": "CL-2024-008",
            "supplier": "Google Cloud Platform",
            "description": "Data analytics and machine learning services including BigQuery and AI/ML tools",
            "category_id": categories[2].id,  # Cloud Services
            "responsible": "mike.wilson@company.com",
            "status": ContractStatus.DRAFT,
            "value": Decimal("120000.00"),
            "start_date": date(2024, 6, 1),
            "end_date": date(2025, 5, 31)
        },
        {
            "contract_number": "IT-2023-009",
            "supplier": "Network Solutions Corp",
            "description": "Network infrastructure maintenance and monitoring services for data center",
            "category_id": categories[1].id,  # IT Services
            "responsible": "jane.smith@company.com",
            "status": ContractStatus.EXPIRED,
            "value": Decimal("65000.00"),
            "start_date": date(2023, 7, 1),
            "end_date": date(2024, 6, 30)
        },
        {
            "contract_number": "SEC-2024-010",
            "supplier": "Palo Alto Networks",
            "description": "Next-generation firewall and network security appliances with 3-year support",
            "category_id": categories[3].id,  # Security Services
            "responsible": "sarah.johnson@company.com",
            "status": ContractStatus.SUSPENDED,
            "value": Decimal("135000.00"),
            "start_date": date(2024, 5, 1),
            "end_date": date(2027, 4, 30)
        }
    ]
    
    created_count = 0
    for contract_data in contracts_data:
        # Check if contract already exists
        existing = db.query(Contract).filter(
            Contract.contract_number == contract_data["contract_number"]
        ).first()
        
        if not existing:
            contract = Contract(**contract_data)
            db.add(contract)
            created_count += 1
    
    db.commit()
    print(f"Created {created_count} contracts")
    
    db.close()

def main():
    """Main seeding function"""
    print("Seeding database with sample data...")
    
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    # Seed categories first
    categories = seed_categories()
    
    # Then seed contracts
    seed_contracts(categories)
    
    print("Database seeding completed successfully!")
    print("\nSample data includes:")
    print("- 6 contract categories (Software, IT Services, Cloud, Security, Hardware, Professional)")
    print("- 10 sample contracts with various statuses and realistic data")
    print("- Contracts spanning different time periods and values")
    print("\nYou can now start the API server and explore the data!")

if __name__ == "__main__":
    main()