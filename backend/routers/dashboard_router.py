"""Dashboard statistics endpoints"""
from fastapi import APIRouter, Depends
from models import DashboardStats
from auth import get_current_user
from database import execute_query, execute_one

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    """
    Get dashboard statistics for security command center
    """
    from database import get_db_connection
    
    # Use single database connection for all queries
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            # Count herders
            cursor.execute("SELECT COUNT(*) as count FROM herders")
            total_herders = cursor.fetchone()["count"]
            
            # Count livestock
            cursor.execute("SELECT COUNT(*) as count FROM livestock")
            total_livestock = cursor.fetchone()["count"]
            
            # Count active routes
            cursor.execute("SELECT COUNT(*) as count FROM routes WHERE status = 'active'")
            active_routes = cursor.fetchone()["count"]
            
            # Get recent verifications
            cursor.execute("""
                SELECT v.*, h.full_name as herder_name, u.full_name as officer_name
                FROM verifications v
                LEFT JOIN herders h ON v.herder_id = h.id
                LEFT JOIN users u ON v.officer_id = u.id
                ORDER BY v.created_at DESC
                LIMIT 10
            """)
            verifications_result = cursor.fetchall()
    
    # Format verifications
    recent_verifications = []
    for v in verifications_result:
        recent_verifications.append({
            "id": v["id"],
            "verification_type": v["verification_type"],
            "result": v["result"],
            "risk_level": v["risk_level"],
            "created_at": v["created_at"].isoformat() if v["created_at"] else None,
            "herders": {"full_name": v["herder_name"]} if v["herder_name"] else None,
            "users": {"full_name": v["officer_name"]} if v["officer_name"] else None
        })
    
    return DashboardStats(
        total_herders=total_herders,
        total_livestock=total_livestock,
        recent_verifications=recent_verifications,
        active_routes=active_routes
    )
