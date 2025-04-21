
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

interface PatientLocationMapProps {
  coordinates: { lat: number; lng: number };
  className?: string;
}

const PatientLocationMap: React.FC<PatientLocationMapProps> = ({ coordinates, className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  // Function to initialize the map
  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coordinates.lng, coordinates.lat],
      zoom: 13
    });
    
    // Create a custom marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'flex items-center justify-center';
    markerElement.innerHTML = `<div class="text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </div>`;
    
    // Add marker to the map
    marker.current = new mapboxgl.Marker(markerElement)
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map.current);
      
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  };

  useEffect(() => {
    // Setup a temporary input for Mapbox token
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
    }
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, coordinates.lat, coordinates.lng]);

  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('mapboxToken') as string;
    
    if (token) {
      localStorage.setItem('mapbox_token', token);
      setMapboxToken(token);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {!mapboxToken ? (
        <div className="border border-border rounded-md p-4 bg-background">
          <p className="text-sm mb-2">
            Please enter your Mapbox public token to view the map. You can get one from{' '}
            <a 
              href="https://www.mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              mapbox.com
            </a>
          </p>
          <form onSubmit={handleTokenSubmit} className="flex gap-2">
            <input
              type="text"
              name="mapboxToken"
              placeholder="Enter Mapbox public token"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            >
              Save
            </button>
          </form>
        </div>
      ) : (
        <div ref={mapContainer} className="h-full w-full rounded-md overflow-hidden" />
      )}
    </div>
  );
};

export default PatientLocationMap;
