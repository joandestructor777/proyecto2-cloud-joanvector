import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "JoanVector - AI Security Guardrail"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SERVER_HOST: str = os.getenv("SERVER_HOST", "0.0.0.0")
    SERVER_PORT: int = int(os.getenv("SERVER_PORT", os.getenv("PORT", "8000")))
    CORS_ORIGINS: List[str] = ["*"]
    
    DEFAULT_CLIENT_IP: str = "127.0.0.1"
    DEFAULT_RISK_THRESHOLD: int = 40
    CRITICAL_RISK_THRESHOLD: int = 70
    BLOCK_ON_CRITICAL: bool = True

settings = Settings()
