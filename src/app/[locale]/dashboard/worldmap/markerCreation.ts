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
