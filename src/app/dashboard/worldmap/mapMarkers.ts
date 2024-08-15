import L from "leaflet";
import { Warehouse, TransactionWithWarehouseInfo } from "./types";

export const createMarkers = (
  locations: Warehouse[],
  map: L.Map,
  createIcon: (location: Warehouse) => L.DivIcon
): L.Marker[] => {
  const markers = locations
    .map((location) => {
      if (location.latitude && location.longitude) {
        const icon = createIcon(location);
        return L.marker([location.latitude, location.longitude], { icon })
          .addTo(map)
          .bindPopup(createPopupContent(location));
      }
      return null;
    })
    .filter((marker): marker is L.Marker => marker !== null);

  return markers;
};

export const createPopupContent = (location: Warehouse): string => {
  return `
    <div>
      <h3>${location.name}</h3>
      ${location.address ? `<p>Address: ${location.address}</p>` : ""}
      <p>Coordinates: ${location.latitude}, ${location.longitude}</p>
    </div>
  `;
};

export const fitMapToMarkers = (map: L.Map, locations: Warehouse[]): void => {
  const validLocations = locations.filter(
    (l): l is Warehouse & { latitude: number; longitude: number } =>
      typeof l.latitude === "number" && typeof l.longitude === "number"
  );

  if (validLocations.length > 0) {
    const bounds = L.latLngBounds(
      validLocations.map((l) => [l.latitude, l.longitude])
    );
    map.fitBounds(bounds);
  }
};

type LatLng = [number, number];

const getPathKey = (from: LatLng, to: LatLng): string => {
  return `${from[0]},${from[1]}-${to[0]},${to[1]}`;
};

const interpolatePoint = (
  start: L.LatLng,
  end: L.LatLng,
  fraction: number
): L.LatLng => {
  const lat = start.lat + (end.lat - start.lat) * fraction;
  const lng = start.lng + (end.lng - start.lng) * fraction;
  return L.latLng(lat, lng);
};

const offsetPoint = (
  start: L.LatLng,
  end: L.LatLng,
  offsetFraction: number
): L.LatLng => {
  const lat = start.lat + (end.lat - start.lat) * offsetFraction;
  const lng = start.lng + (end.lng - start.lng) * offsetFraction;
  return L.latLng(lat, lng);
};

export const createTransactionPaths = (
  transactions: TransactionWithWarehouseInfo[],
  map: L.Map
): void => {
  const pathGroups: { [key: string]: TransactionWithWarehouseInfo[] } = {};

  // Group transactions by their start and end points
  transactions.forEach((transaction) => {
    if (transaction.from_warehouse && transaction.to_warehouse) {
      const from: LatLng = [
        transaction.from_warehouse.latitude!,
        transaction.from_warehouse.longitude!,
      ];
      const to: LatLng = [
        transaction.to_warehouse.latitude!,
        transaction.to_warehouse.longitude!,
      ];
      const key = getPathKey(from, to);
      if (!pathGroups[key]) {
        pathGroups[key] = [];
      }
      pathGroups[key].push(transaction);
    }
  });

  // Create a single path for each group
  Object.values(pathGroups).forEach((group) => {
    if (group.length > 0) {
      const firstTransaction = group[0];
      const from = L.latLng(
        firstTransaction.from_warehouse!.latitude!,
        firstTransaction.from_warehouse!.longitude!
      );
      const to = L.latLng(
        firstTransaction.to_warehouse!.latitude!,
        firstTransaction.to_warehouse!.longitude!
      );

      // Calculate offset points
      const offsetFraction = 0.5; // 5% offset from each end
      const fromOffset = offsetPoint(from, to, offsetFraction);
      const toOffset = offsetPoint(to, from, offsetFraction);

      // Calculate line thickness based on the number of transactions
      const minThickness = 2;
      const maxThickness = 20;
      const thickness = Math.min(
        minThickness + Math.log(group.length) * 3,
        maxThickness
      );

      const path = L.polyline([from, to], {
        color: "#3388ff",
        weight: thickness,
        opacity: 0.7,
      }).addTo(map);

      // Add arrow decorator
      const decorator = L.polylineDecorator(path, {
        patterns: [
          {
            offset: "85%",
            repeat: 0,
            symbol: L.Symbol.arrowHead({
              pixelSize: 15,
              polygon: true,
              pathOptions: {
                stroke: true,
                color: "#3388ff",
                fillColor: "#3388ff",
                fillOpacity: 0.8,
                weight: 2,
              },
            }),
          },
        ],
      }).addTo(map);

      // Add label with transaction count
      const midpoint = interpolatePoint(from, to, 0.5);
      const label = L.divIcon({
        className: "transaction-label",
        html: `<div>${group.length}</div>`,
        iconSize: [30, 30],
      });
      L.marker(midpoint, { icon: label }).addTo(map);

      // Create popup content
      const popupContent = `
        <div>
          <h3>Transactions: ${group.length}</h3>
          <p>From: ${firstTransaction.from_warehouse!.name}</p>
          <p>To: ${firstTransaction.to_warehouse!.name}</p>
          <ul>
            ${group.map((t) => `<li>${t.action_type}${t.description ? `: ${t.description}` : ""}</li>`).join("")}
          </ul>
        </div>
      `;

      path.bindPopup(popupContent);

      // Animate dots along the path
      const animateDot = (startTime: number) => {
        const dot = L.circleMarker(from, {
          radius: thickness / 2,
          color: "#ffffff",
          fillColor: "#ffffff",
          fillOpacity: 1,
        }).addTo(map);

        const animate = (timestamp: number) => {
          const elapsed = timestamp - startTime;
          const duration = 2000; // Animation duration in milliseconds
          const progress = (elapsed % duration) / duration;

          const currentPoint = interpolatePoint(fromOffset, toOffset, progress);
          dot.setLatLng(currentPoint);

          if (map.getBounds().contains(currentPoint)) {
            requestAnimationFrame((timestamp) => animate(timestamp));
          } else {
            map.removeLayer(dot);
          }
        };

        requestAnimationFrame((timestamp) => animate(timestamp));
      };

      // Start multiple dots with different delays
      for (let i = 0; i < 3; i++) {
        setTimeout(() => animateDot(performance.now()), i * 666);
      }
    }
  });
};

export const injectAnimationCSS = (): void => {
  const style = document.createElement("style");
  style.textContent = `
    .transaction-label {
      background-color: #3388ff;
      border: 2px solid white;
      border-radius: 50%;
      color: white;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
    .transaction-label div {
      margin-top: -2px;
    }
  `;
  document.head.appendChild(style);
};
