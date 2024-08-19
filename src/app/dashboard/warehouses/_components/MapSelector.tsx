import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';
import 'leaflet/dist/leaflet.css';

interface MapSelectorProps {
    latitude: number;
    longitude: number;
    onLocationChange: (lat: number, lng: number, address: string) => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({ latitude, longitude, onLocationChange }) => {
    const customIcon = L.divIcon({
        html: ReactDOMServer.renderToString(
            <MapPin size={32} color="#FF4500" fill="#FF4500" />
        ),
        className: 'custom-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            return data.display_name || '';
        } catch (error) {
            console.error("Error in reverse geocoding:", error);
            return '';
        }
    };

    const LocationMarker = () => {
        const map = useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                const address = await reverseGeocode(lat, lng);
                onLocationChange(lat, lng, address);
            },
        });

        const markerRef = useRef<L.Marker>(null);

        useEffect(() => {
            if (markerRef.current) {
                markerRef.current.setLatLng([latitude, longitude]);
            }
        }, [latitude, longitude]);

        return (
            <Marker
                position={[latitude, longitude]}
                icon={customIcon}
                ref={markerRef}
            />
        );
    };

    const MapController = () => {
        const map = useMap();
        useEffect(() => {
            map.setView([latitude, longitude], map.getZoom());
        }, [latitude, longitude]);
        return null;
    };

    return (
        <div className="map-container">
            <MapContainer
                center={[latitude, longitude]}
                zoom={20}
                style={{ height: '300px', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <LocationMarker />
                <MapController />
            </MapContainer>
            <style jsx global>{`
        .map-container .leaflet-tile-pane {
          filter: grayscale(100%);
        }
        .custom-icon {
          background: none;
          border: none;
        }
      `}</style>
        </div>
    );
};

export default MapSelector;