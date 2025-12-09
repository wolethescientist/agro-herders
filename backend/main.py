"""
Connexxion Agro-Herders Identity, Verification and Security
FastAPI Backend Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import (
    auth_router,
    herders_router,
    verification_router,
    routes_router,
    dashboard_router
)

# Initialize FastAPI app
app = FastAPI(
    title="Connexxion Agro-Herders API",
    description="Connexxion Agro-Herders Identity, Verification and Security Management System",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://agro-herders.vercel.app"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router)
app.include_router(herders_router.router)
app.include_router(verification_router.router)
app.include_router(routes_router.router)
app.include_router(dashboard_router.router)

@app.get("/")
async def root():
    """API health check"""
    return {
        "message": "Connexxion Agro-Herders API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "api": "operational",
        "database": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    from config import get_settings
    
    settings = get_settings()
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )
