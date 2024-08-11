import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Warehouse } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';
import 'leaflet-polylinedecorator';

interface Warehouse {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount?: number;
  date?: string;
}

interface MapProps {
  warehouses: Warehouse[];
  transactions: Transaction[];
  height?: string;
}

const ChangeView = ({ warehouses }: { warehouses: Warehouse[] }) => {
  const map = useMap();
  useEffect(() => {
    if (warehouses.length > 0) {
      const bounds = L.latLngBounds(warehouses.map(w => [w.lat, w.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, warehouses]);

  return null;
};

const ArrowPolyline = ({
  positions,
  transaction,
  color,
  curveIntensity
}: {
  positions: L.LatLngExpression[],
  transaction: Transaction,
  color: string,
  curveIntensity: number
}) => {
  const map = useMap();
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    const [start, end] = positions;
    const startLatLng = L.latLng(start);
    const endLatLng = L.latLng(end);

    // Calculate the midpoint
    const midpointLat = (startLatLng.lat + endLatLng.lat) / 2;
    const midpointLng = (startLatLng.lng + endLatLng.lng) / 2;

    // Calculate the perpendicular offset for the control point
    const latDiff = endLatLng.lat - startLatLng.lat;
    const lngDiff = endLatLng.lng - startLatLng.lng;
    const perpLat = -lngDiff * curveIntensity;
    const perpLng = latDiff * curveIntensity;

    // Control point for the quadratic Bézier curve
    const controlPoint = L.latLng(midpointLat + perpLat, midpointLng + perpLng);

    // Generate points along the quadratic Bézier curve
    const curvePoints = [];
    for (let t = 0; t <= 1; t += 0.01) {
      const lat = (1 - t) * (1 - t) * startLatLng.lat + 2 * (1 - t) * t * controlPoint.lat + t * t * endLatLng.lat;
      const lng = (1 - t) * (1 - t) * startLatLng.lng + 2 * (1 - t) * t * controlPoint.lng + t * t * endLatLng.lng;
      curvePoints.push(L.latLng(lat, lng));
    }

    const arrow = L.polyline(curvePoints, {
      color: color,
      weight: 3,
      smoothFactor: 1
    });

    const arrowHead = L.polylineDecorator(arrow, {
      patterns: [
        {
          offset: '50%',
          repeat: 0,
          symbol: L.Symbol.arrowHead({
            pixelSize: 15,
            polygon: false,
            pathOptions: { color: color, fillOpacity: 1, weight: 2 }
          })
        }
      ]
    });

    arrow.addTo(map);
    arrowHead.addTo(map);

    arrow.on('click', () => {
      const popupContent = `
        <div>
          <h3>Transaction Details</h3>
          <p>From: ${transaction.from}</p>
          <p>To: ${transaction.to}</p>
          <p>Amount: ${transaction.amount || 'N/A'}</p>
          <p>Date: ${transaction.date || 'N/A'}</p>
        </div>
      `;
      L.popup()
        .setLatLng(controlPoint)
        .setContent(popupContent)
        .openOn(map);
    });

    polylineRef.current = arrow;

    return () => {
      map.removeLayer(arrow);
      map.removeLayer(arrowHead);
    };
  }, [map, positions, transaction, color, curveIntensity]);

  return null;
};

const MapComponent: React.FC<MapProps> = ({ warehouses, transactions, height = '70vh' }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
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

    L.Marker.prototype.options.icon = createCustomIcon();
  }, []);

  const mapStyle = {
    height: height,
    width: '100%',
    filter: 'grayscale(50%) contrast(85%)',
  };

  const center = warehouses.length > 0
    ? warehouses.reduce((acc, w) => [acc[0] + w.lat / warehouses.length, acc[1] + w.lng / warehouses.length], [0, 0])
    : [0, 0];

  const getWarehouseById = (id: string) => warehouses.find(w => w.id === id);

  // Group transactions by their from-to pairs
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const key = `${transaction.from}-${transaction.to}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  // Color palette for transaction lines
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#33FFF1', '#F1FF33'];

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
        {warehouses.map((warehouse) => (
          <Marker key={warehouse.id} position={[warehouse.lat, warehouse.lng]}>
            <Popup>{warehouse.name}</Popup>
          </Marker>
        ))}
        {Object.entries(groupedTransactions).map(([key, groupTransactions], groupIndex) => {
          const [fromId, toId] = key.split('-');
          const fromWarehouse = getWarehouseById(fromId);
          const toWarehouse = getWarehouseById(toId);
          if (fromWarehouse && toWarehouse) {
            return groupTransactions.map((transaction, index) => (
              <ArrowPolyline
                key={transaction.id}
                positions={[
                  [fromWarehouse.lat, fromWarehouse.lng],
                  [toWarehouse.lat, toWarehouse.lng]
                ]}
                transaction={transaction}
                color={colors[groupIndex % colors.length]}
                curveIntensity={0.5 + index * 0.2}
              />
            ));
          }
          return null;
        })}
        <ChangeView warehouses={warehouses} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;