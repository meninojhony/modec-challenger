"""
Integration tests for the contract API endpoints
"""
import pytest
from fastapi import status


class TestContractAPI:
    """Test contract API endpoints"""
    
    def test_create_contract_success(self, client, sample_contract_data):
        """Test successful contract creation via API"""
        response = client.post("/api/v1/contracts/", json=sample_contract_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["contract_number"] == sample_contract_data["contract_number"]
        assert data["supplier"] == sample_contract_data["supplier"]
        assert data["status"] == sample_contract_data["status"]
        assert "id" in data
        assert "created_at" in data

    def test_create_contract_validation_error(self, client, sample_category):
        """Test contract creation with validation errors"""
        invalid_data = {
            "contract_number": "",  # Empty contract number
            "supplier": "Test Supplier",
            "description": "Test description",
            "category_id": sample_category.id,
            "responsible": "test.user",
            "status": "active",
            "value": "-1000.00",  # Negative value
            "start_date": "2024-12-31",
            "end_date": "2024-01-01"  # End before start
        }
        
        response = client.post("/api/v1/contracts/", json=invalid_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_get_contract_success(self, client, sample_contract):
        """Test successful contract retrieval via API"""
        response = client.get(f"/api/v1/contracts/{sample_contract.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == sample_contract.id
        assert data["contract_number"] == sample_contract.contract_number
        assert data["supplier"] == sample_contract.supplier
        assert "category" in data
    
    def test_get_contract_not_found(self, client):
        """Test contract retrieval with invalid ID"""
        response = client.get("/api/v1/contracts/non-existent-id")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "not found" in response.json()["error"]["message"]
    
    def test_list_contracts_success(self, client, multiple_contracts):
        """Test successful contract listing via API"""
        response = client.get("/api/v1/contracts/")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert "pages" in data
        assert len(data["items"]) == 3
        assert data["total"] == 3
    
    def test_list_contracts_with_filters(self, client, multiple_contracts):
        """Test contract listing with filters"""
        # Test supplier filter
        response = client.get("/api/v1/contracts/?supplier=Microsoft")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["items"]) == 1
        assert "Microsoft" in data["items"][0]["supplier"]

    def test_update_contract_success(self, client, sample_contract):
        """Test successful contract update via API"""
        update_data = {
            "supplier": "Updated Supplier Name",
            "status": "suspended"
        }
        
        response = client.put(f"/api/v1/contracts/{sample_contract.id}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["supplier"] == update_data["supplier"]
        assert data["status"] == update_data["status"]
        assert data["id"] == sample_contract.id

    def test_delete_contract_success(self, client, sample_contract):
        """Test successful contract deletion via API"""
        response = client.delete(f"/api/v1/contracts/{sample_contract.id}?confirmation=true")
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify contract is deleted
        get_response = client.get(f"/api/v1/contracts/{sample_contract.id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_contract_without_confirmation(self, client, sample_contract):
        """Test contract deletion without confirmation"""
        response = client.delete(f"/api/v1/contracts/{sample_contract.id}")
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "confirmation" in response.json()["error"]["message"]


class TestCategoryAPI:
    """Test category API endpoints"""
    
    def test_create_category_success(self, client):
        """Test successful category creation via API"""
        category_data = {
            "name": "Hardware",
            "description": "Hardware procurement contracts"
        }
        
        response = client.post("/api/v1/categories/", json=category_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == category_data["name"]
        assert data["description"] == category_data["description"]
        assert "id" in data
        assert "created_at" in data

    def test_list_categories_success(self, client, sample_category):
        """Test successful category listing via API"""
        response = client.get("/api/v1/categories/")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) >= 1
        assert any(cat["name"] == sample_category.name for cat in data)

    def test_get_category_success(self, client, sample_category):
        """Test successful category retrieval via API"""
        response = client.get(f"/api/v1/categories/{sample_category.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == sample_category.id
        assert data["name"] == sample_category.name

    def test_update_category_success(self, client, sample_category):
        """Test successful category update via API"""
        update_data = {
            "name": "Updated Category Name",
            "description": "Updated description"
        }
        
        response = client.put(f"/api/v1/categories/{sample_category.id}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == update_data["name"]
        assert data["description"] == update_data["description"]

    def test_delete_category_with_contracts(self, client, sample_contract):
        """Test category deletion when it has associated contracts"""
        category_id = sample_contract.category_id
        
        response = client.delete(f"/api/v1/categories/{category_id}?confirmation=true")
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "associated contracts" in response.json()["error"]["message"]