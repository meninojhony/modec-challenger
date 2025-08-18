from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    project_name: str = "Contract Management API"
    api_v1_str: str = "/api/v1"
    database_url: str = "sqlite:///./contracts.db"
    debug: bool = True
    
    class Config:
        env_file = ".env"


settings = Settings()