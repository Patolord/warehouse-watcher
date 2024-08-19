import L from "leaflet";
import { Warehouse } from "./types";

export const addFitToMarkersControl = (
  map: L.Map,
  locations: Warehouse[]
): L.Control => {
  const FitToMarkersControl = L.Control.extend({
    options: {
      position: "topright",
    },

    onAdd: function (map: L.Map) {
      const container = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-control-custom"
      );
      container.style.backgroundColor = "white";
      container.style.width = "30px";
      container.style.height = "30px";
      container.innerHTML =
        '<span style="font-size: 20px; line-height: 30px; display: block; text-align: center;">📍</span>';
      container.title = "Fit to all markers";

      container.onclick = function () {
        fitToMarkers(map, locations);
      };

      return container;
    },
  });
  const control = new FitToMarkersControl();
  map.addControl(control);
  return control;
};

const fitToMarkers = (map: L.Map, locations: Warehouse[]): void => {
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

export const addZoomControls = (map: L.Map): void => {
  L.control
    .zoom({
      position: "topright",
    })
    .addTo(map);
};

export const addScaleControl = (map: L.Map): void => {
  L.control
    .scale({
      imperial: false,
      position: "bottomright",
    })
    .addTo(map);
};

export const addLayerControl = (
  map: L.Map,
  baseLayer: L.TileLayer,
  userWarehouseLayer: L.LayerGroup,
  otherWarehouseLayer: L.LayerGroup,
  transactionLayer: L.LayerGroup
): L.Control.Layers => {
  const overlayMaps = {
    "User Warehouses": userWarehouseLayer,
    "Other Warehouses": otherWarehouseLayer,
    Transactions: transactionLayer,
  };

  const control = L.control.layers({ "Base Map": baseLayer }, overlayMaps, {
    position: "topright",
  });
  control.addTo(map);
  return control;
};

export const addLegendControl = (map: L.Map): void => {
  const LegendControl = L.Control.extend({
    options: {
      position: "bottomright",
    },

    onAdd: function (map: L.Map) {
      const container = L.DomUtil.create("div", "info legend");
      container.innerHTML = `
        <h4>Legend</h4>
        <div><span style="background-color: #4CAF50; width: 10px; height: 10px; display: inline-block;"></span> User Warehouse</div>
        <div><span style="background-color: #FF5722; width: 10px; height: 10px; display: inline-block;"></span> Other Warehouse</div>
        <div><span style="background-color: #2196F3; width: 10px; height: 10px; display: inline-block;"></span> Transaction</div>
      `;
      return container;
    },
  });

  map.addControl(new LegendControl());
};
