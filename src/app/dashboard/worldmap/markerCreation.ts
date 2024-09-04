import L from "leaflet";
import { Warehouse } from "./types";

interface CustomMarkerOptions extends L.MarkerOptions {
  warehouses: Warehouse[];
}

export const createMarkers = (
  locations: Warehouse[],
  map: L.Map,
  createIcon: (location: Warehouse, count: number) => L.DivIcon,
  onWarehouseSelect: (warehouse: Warehouse) => void
): L.Marker[] => {
  const groupedLocations: { [key: string]: Warehouse[] } = {};

  // Group warehouses by their coordinates
  locations.forEach((location) => {
    if (location.latitude && location.longitude) {
      const key = `${location.latitude},${location.longitude}`;
      if (!groupedLocations[key]) {
        groupedLocations[key] = [];
      }
      groupedLocations[key].push(location);
    }
  });

  const markers = Object.values(groupedLocations).map((group) => {
    const firstWarehouse = group[0];
    const icon = createIcon(firstWarehouse, group.length);
    const marker = L.marker([firstWarehouse.latitude!, firstWarehouse.longitude!], {
      icon,
      warehouses: group
    } as CustomMarkerOptions);

    marker
      .addTo(map)
      .bindPopup(createPopupContent(group, onWarehouseSelect));

    return marker;
  });

  return markers;
};

export const createPopupContent = (
  warehouses: Warehouse[],
  onWarehouseSelect: (warehouse: Warehouse) => void
): L.Popup => {
  const container = L.DomUtil.create('div', 'warehouse-popup');

  warehouses.forEach((warehouse) => {
    const warehouseElement = L.DomUtil.create('div', 'warehouse-item', container);
    warehouseElement.innerHTML = `
      <h3>${warehouse.name}</h3>
      ${warehouse.address ? `<p>Address: ${warehouse.address}</p>` : ""}
      <p>Coordinates: ${warehouse.latitude}, ${warehouse.longitude}</p>
    `;

    const selectButton = L.DomUtil.create('button', 'select-warehouse-btn', warehouseElement);
    selectButton.innerText = 'Select';
    L.DomEvent.on(selectButton, 'click', () => {
      onWarehouseSelect(warehouse);
    });
  });

  return L.popup().setContent(container);
};
