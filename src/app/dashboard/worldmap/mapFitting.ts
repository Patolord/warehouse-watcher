import L from "leaflet";
import { Warehouse } from "./types";

export const fitMapToMarkers = (map: L.Map, locations: Warehouse[]): void => {
  const validLocations = locations.filter(
    (l): l is Warehouse & { latitude: number; longitude: number } =>
      typeof l.latitude === "number" && typeof l.longitude === "number"
  );

  if (validLocations.length > 0) {
    if (validLocations.length === 1) {
      // If there's only one location, center on it with a set zoom level
      map.setView([validLocations[0].latitude, validLocations[0].longitude], 10);
    } else {
      const bounds = L.latLngBounds(
        validLocations.map((l) => [l.latitude, l.longitude])
      );
      map.fitBounds(bounds);
    }
  }
};
