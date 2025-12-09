"""Grazing route validation service"""
from shapely.geometry import Point, shape
from typing import Optional, List

class RouteService:
    """Service for validating locations against approved grazing routes"""
    
    @staticmethod
    def is_point_in_route(latitude: float, longitude: float, geojson_data: dict) -> bool:
        """
        Check if a GPS coordinate is within a grazing route polygon
        
        Args:
            latitude: GPS latitude
            longitude: GPS longitude
            geojson_data: GeoJSON polygon data
            
        Returns:
            True if point is within the route, False otherwise
        """
        try:
            point = Point(longitude, latitude)
            polygon = shape(geojson_data)
            return polygon.contains(point)
        except Exception as e:
            print(f"Error checking point in route: {e}")
            return False
    
    @staticmethod
    def find_authorized_routes(latitude: float, longitude: float, 
                              all_routes: List[dict]) -> List[dict]:
        """
        Find all routes that contain the given GPS coordinate
        
        Args:
            latitude: GPS latitude
            longitude: GPS longitude
            all_routes: List of route dictionaries with geojson_data
            
        Returns:
            List of authorized routes
        """
        authorized = []
        for route in all_routes:
            if RouteService.is_point_in_route(latitude, longitude, route['geojson_data']):
                authorized.append(route)
        return authorized
