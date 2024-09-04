import L from "leaflet";

type LatLng = [number, number];

export const getPathKey = (from: LatLng, to: LatLng): string => {
  return `${from[0]},${from[1]}-${to[0]},${to[1]}`;
};

export const interpolatePoint = (
  start: L.LatLng,
  end: L.LatLng,
  fraction: number
): L.LatLng => {
  const lat = start.lat + (end.lat - start.lat) * fraction;
  const lng = start.lng + (end.lng - start.lng) * fraction;
  return L.latLng(lat, lng);
};

export const offsetPoint = (
  start: L.LatLng,
  end: L.LatLng,
  offsetFraction: number
): L.LatLng => {
  const lat = start.lat + (end.lat - start.lat) * offsetFraction;
  const lng = start.lng + (end.lng - start.lng) * offsetFraction;
  return L.latLng(lat, lng);
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
      cursor: pointer;
      transition: transform 0.1s ease-in-out;
    }
    .transaction-label:hover {
      transform: scale(1.1);
    }
    .transaction-label div {
      margin-top: -2px;
    }
  `;
  document.head.appendChild(style);
};
