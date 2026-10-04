from fastapi import APIRouter
from app.api.v1.rules import router as rules_router
from app.api.v1.assistant import router as assistant_router
from app.api.v1.security import router as security_router

api_router = APIRouter()
api_router.include_router(rules_router)
api_router.include_router(assistant_router)
api_router.include_router(security_router)
