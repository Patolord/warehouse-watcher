import L from "leaflet";
import { interpolatePoint } from "./utils";

export const animateDot = (
  fromOffset: L.LatLng,
  toOffset: L.LatLng,
  thickness: number,
  map: L.Map
): void => {
  const dot = L.circleMarker(fromOffset, {
    radius: thickness / 2,
    color: "#ffffff",
    fillColor: "#ffffff",
    fillOpacity: 1,
  }).addTo(map);

  const startTime = performance.now();
  const duration = 2000; // Animation duration in milliseconds

  const animate = (timestamp: number) => {
    const elapsed = timestamp - startTime;
    const progress = (elapsed % duration) / duration;

    const currentPoint = interpolatePoint(fromOffset, toOffset, progress);
    dot.setLatLng(currentPoint);

    if (map.getBounds().contains(currentPoint)) {
      requestAnimationFrame(animate);
    } else {
      map.removeLayer(dot);
    }
  };

  requestAnimationFrame(animate);
};
