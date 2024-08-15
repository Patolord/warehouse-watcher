// mapConfig.ts
import L from "leaflet";
import { Warehouse as WarehouseIcon } from "lucide-react";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Warehouse } from "./types";

export const mapConfig = {
  initialView: {
    center: [20, 0] as [number, number],
    zoom: 2,
  },
  tileLayer: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  // Apply a grayscale filter to the map
  mapFilter: "grayscale(50%)",
};

export const createIcon = (location: Warehouse): L.DivIcon => {
  const color = getMarkerColor(location);

  const iconHtml = ReactDOMServer.renderToString(
    React.createElement(WarehouseIcon, { color, size: 30 })
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-div-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

export const getMarkerColor = (location: Warehouse): string => {
  // You can implement logic here to return different colors based on location properties
  // For now, we'll use a default color
  return "#555555";
};
