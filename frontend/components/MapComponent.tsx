'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Route {
  id: number;
  route_name: string;
  state: string;
  geojson_data: any;
  status: string;
}

interface MapComponentProps {
  routes: Route[];
  checkPoint?: { lat: number; lng: number } | null;
}

function MapUpdater({ routes }: { routes: Route[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (routes.length > 0) {
      const bounds = routes.map(route => {
        const coords = route.geojson_data.coordinates[0];
        return coords.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
      }).flat();
      
      if (bounds.length > 0) {
        map.fitBounds(bounds);
      }
    }
  }, [routes, map]);
  
  return null;
}

export default function MapComponent({ routes, checkPoint }: MapComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full flex items-center justify-center bg-gray-100">Loading map...</div>;
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <MapContainer
      center={[9.0820, 8.6753]} // Nigeria center
      zoom={6}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater routes={routes} />
      
      {routes.map((route, index) => {
        const coords = route.geojson_data.coordinates[0].map(
          (coord: number[]) => [coord[1], coord[0]] as [number, number]
        );
        
        return (
          <Polygon
            key={route.id}
            positions={coords}
            pathOptions={{
              color: colors[index % colors.length],
              fillColor: colors[index % colors.length],
              fillOpacity: 0.3,
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{route.route_name}</h3>
                <p className="text-sm text-gray-600">State: {route.state}</p>
                <p className="text-sm text-gray-600">Status: {route.status}</p>
              </div>
            </Popup>
          </Polygon>
        );
      })}
      
      {checkPoint && (
        <Marker position={[checkPoint.lat, checkPoint.lng]}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">Check Point</h3>
              <p className="text-sm">Lat: {checkPoint.lat.toFixed(4)}</p>
              <p className="text-sm">Lng: {checkPoint.lng.toFixed(4)}</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
