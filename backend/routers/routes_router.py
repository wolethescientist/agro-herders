"""Grazing routes endpoints"""
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models import RouteResponse, LocationCheckRequest
from auth import get_current_user
from database import execute_query, execute_one
from services.route_service import RouteService
import json

router = APIRouter(prefix="/routes", tags=["Routes"])
route_service = RouteService()

@router.get("/", response_model=List[RouteResponse])
async def get_routes(current_user: dict = Depends(get_current_user)):
    """
    Get all approved grazing routes
    """
    query = "SELECT * FROM routes WHERE status = 'active'"
    result = execute_query(query)
    
    # Convert JSONB to dict
    routes = []
    for row in result:
        route_dict = dict(row)
        if isinstance(route_dict['geojson_data'], str):
            route_dict['geojson_data'] = json.loads(route_dict['geojson_data'])
        routes.append(route_dict)
    
    return routes

@router.get("/{route_id}", response_model=RouteResponse)
async def get_route(route_id: int, current_user: dict = Depends(get_current_user)):
    """
    Get specific route details
    """
    query = "SELECT * FROM routes WHERE id = %s"
    result = execute_one(query, (route_id,))
    
    if not result:
        raise HTTPException(status_code=404, detail="Route not found")
    
    route_dict = dict(result)
    if isinstance(route_dict['geojson_data'], str):
        route_dict['geojson_data'] = json.loads(route_dict['geojson_data'])
    
    return route_dict

@router.post("/check-location", response_model=dict)
async def check_location(
    request: LocationCheckRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Check if a GPS location is within approved grazing routes
    """
    # Get all active routes
    query = "SELECT * FROM routes WHERE status = 'active'"
    routes_result = execute_query(query)
    
    if not routes_result:
        return {
            "authorized": False,
            "message": "No active routes found",
            "routes": []
        }
    
    # Convert to list of dicts with parsed GeoJSON
    routes = []
    for row in routes_result:
        route_dict = dict(row)
        if isinstance(route_dict['geojson_data'], str):
            route_dict['geojson_data'] = json.loads(route_dict['geojson_data'])
        routes.append(route_dict)
    
    # Check if location is in any route
    authorized_routes = route_service.find_authorized_routes(
        request.latitude,
        request.longitude,
        routes
    )
    
    if authorized_routes:
        return {
            "authorized": True,
            "message": f"Location is within {len(authorized_routes)} authorized route(s)",
            "routes": authorized_routes
        }
    else:
        return {
            "authorized": False,
            "message": "Location is outside all authorized grazing routes",
            "routes": []
        }
