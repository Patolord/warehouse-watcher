import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Warehouse } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

interface MapProps {
  markers: Array<{
    lat: number;
    lng: number;
    popup?: string;
  }>;
  height?: string;
}

// This component will handle fitting bounds
const ChangeView = ({ markers }: { markers: MapProps['markers'] }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, markers]);

  return null;
};

const MapComponent: React.FC<MapProps> = ({ markers, height = '70vh' }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Create a custom icon using Lucide Warehouse
    const createCustomIcon = (color: string = '#000000') => {
      const iconHtml = ReactDOMServer.renderToString(
        <Warehouse color={color} size={32} />
      );

      return L.divIcon({
        html: iconHtml,
        className: 'custom-warehouse-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    };

    // Set the custom icon as default
    L.Marker.prototype.options.icon = createCustomIcon();
  }, []);

  const mapStyle = {
    height: height,
    width: '100%',
    filter: 'grayscale(100%) contrast(85%)',
  };

  // Calculate the center of all markers
  const center = markers.length > 0
    ? markers.reduce((acc, marker) => [acc[0] + marker.lat / markers.length, acc[1] + marker.lng / markers.length], [0, 0])
    : [0, 0];

  return (
    <div style={{ width: '100%', height: height }}>
      <MapContainer
        center={center as [number, number]}
        zoom={2}
        style={mapStyle}
        scrollWheelZoom={false}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            {marker.popup && <Popup>{marker.popup}</Popup>}
          </Marker>
        ))}
        <ChangeView markers={markers} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;