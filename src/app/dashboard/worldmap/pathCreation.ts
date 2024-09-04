import L from "leaflet";
import { TransactionWithWarehouseInfo } from "./types";
import { getPathKey, interpolatePoint, offsetPoint } from "./utils";
import { animateDot } from "./animationHelpers";

export const createTransactionPaths = (
  transactions: TransactionWithWarehouseInfo[],
  map: L.Map,
  onTransactionsSelect: (transactions: TransactionWithWarehouseInfo[] | null) => void
): L.Layer[] => {
  const pathGroups: { [key: string]: TransactionWithWarehouseInfo[] } = {};
  const createdLayers: L.Layer[] = [];

  // Group transactions by their start and end points
  transactions.forEach((transaction) => {
    if (transaction.from_warehouse && transaction.to_warehouse) {
      const from: [number, number] = [
        transaction.from_warehouse.latitude!,
        transaction.from_warehouse.longitude!,
      ];
      const to: [number, number] = [
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
      const offsetFraction = 0.05; // 5% offset from each end
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
      });
      createdLayers.push(path);

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
      });
      createdLayers.push(decorator);

      // Update the label to include transaction count and handle click event
      const midpoint = interpolatePoint(from, to, 0.5);
      const label = L.marker(midpoint, {
        icon: L.divIcon({
          className: "transaction-label",
          html: `<div>${group.length}</div>`,
          iconSize: [30, 30],
        }),
      });
      label.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onTransactionsSelect(group);
      });
      createdLayers.push(label);

      // Animate dots along the path
      for (let i = 0; i < 3; i++) {
        setTimeout(
          () => animateDot(fromOffset, toOffset, thickness, map),
          i * 666
        );
      }
    }
  });

  return createdLayers;
};
