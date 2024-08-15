// mapMarkers.ts
import L from "leaflet";
import { Warehouse } from "./types";

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
