from fastapi import APIRouter
from app.api.v1.rules import router as rules_router

api_router = APIRouter()
api_router.include_router(rules_router)
