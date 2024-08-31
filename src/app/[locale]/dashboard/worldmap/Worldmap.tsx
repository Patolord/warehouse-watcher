"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet-polylinedecorator";
import { Warehouse, TransactionWithWarehouseInfo } from "./types";
import { mapConfig } from "./mapConfig";
import { createTransactionPaths } from "./pathCreation";
import { injectAnimationCSS } from "./utils";
import {
  addFitToMarkersControl,
  addZoomControls,
  addScaleControl,
  addLayerControl,
} from "./mapControls";
import { fitMapToMarkers } from "./mapFitting";
import { Warehouse as WarehouseIcon, CircleDot } from "lucide-react";
import ReactDOMServer from "react-dom/server";

interface WorldMapProps {
  userWarehouses: Warehouse[];
  otherWarehouses: Warehouse[];
  transactions: TransactionWithWarehouseInfo[];
  onWarehouseSelect: (warehouse: Warehouse | null) => void;
  onTransactionsSelect: (
    transactions: TransactionWithWarehouseInfo[] | null
  ) => void;
  focusWarehouseId: string | null;
}

const WorldMap: React.FC<WorldMapProps> = ({
  userWarehouses,
  otherWarehouses,
  transactions,
  onWarehouseSelect,
  onTransactionsSelect,
  focusWarehouseId,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const userWarehouseLayerRef = useRef<L.LayerGroup | null>(null);
  const otherWarehouseLayerRef = useRef<L.LayerGroup | null>(null);
  const transactionLayerRef = useRef<L.LayerGroup | null>(null);
  const baseLayerRef = useRef<L.TileLayer | null>(null);
  const fitToMarkersControlRef = useRef<L.Control | null>(null);
  const layerControlRef = useRef<L.Control.Layers | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const initialFitDoneRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || mapLoaded) return;

    const initMap = () => {
      injectAnimationCSS();

      if (!mapRef.current) {
        const map = L.map("map", {
          ...mapConfig.initialView,
          zoomControl: false,
        });
        baseLayerRef.current = L.tileLayer(mapConfig.tileLayer.url, {
          attribution: mapConfig.tileLayer.attribution,
        }).addTo(map);
        mapRef.current = map;

        const mapContainer = map.getContainer();
        mapContainer.style.filter = mapConfig.mapFilter;

        userWarehouseLayerRef.current = L.layerGroup().addTo(map);
        otherWarehouseLayerRef.current = L.layerGroup().addTo(map);
        transactionLayerRef.current = L.layerGroup().addTo(map);

        addZoomControls(map);
        addScaleControl(map);
        // Remove this line:
        // addLegendControl(map);

        map.invalidateSize();

        setMapLoaded(true);
      }
    };

    initMap();
  }, [mapLoaded]);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const map = mapRef.current;

    userWarehouseLayerRef.current?.clearLayers();
    otherWarehouseLayerRef.current?.clearLayers();
    transactionLayerRef.current?.clearLayers();

    const createMarkerIcon = (isUserWarehouse: boolean) => {
      const color = isUserWarehouse ? "#4CAF50" : "#FF5722";
      return L.divIcon({
        html: ReactDOMServer.renderToString(
          <div
            className={`custom-div-icon ${
              isUserWarehouse ? "user-warehouse" : "other-warehouse"
            }`}
          >
            <WarehouseIcon color={color} size={20} />
          </div>
        ),
        className: "custom-div-icon",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
    };

    const addWarehouseMarkers = (
      warehouses: Warehouse[],
      isUserWarehouse: boolean
    ) => {
      warehouses.forEach((warehouse) => {
        if (warehouse.latitude && warehouse.longitude) {
          const marker = L.marker([warehouse.latitude, warehouse.longitude], {
            icon: createMarkerIcon(isUserWarehouse),
          });
          marker.on("click", () => onWarehouseSelect(warehouse));
          (isUserWarehouse
            ? userWarehouseLayerRef.current
            : otherWarehouseLayerRef.current
          )?.addLayer(marker);
        }
      });
    };

    addWarehouseMarkers(userWarehouses, true);
    addWarehouseMarkers(otherWarehouses, false);

    const transactionLayers = createTransactionPaths(
      transactions,
      map,
      onTransactionsSelect
    );
    transactionLayers.forEach((layer) => {
      transactionLayerRef.current?.addLayer(layer);
      if (layer instanceof L.Marker) {
        layer.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          // The onTransactionsSelect will be called within createTransactionPaths
        });
      }
    });

    if (fitToMarkersControlRef.current) {
      map.removeControl(fitToMarkersControlRef.current);
    }
    fitToMarkersControlRef.current = addFitToMarkersControl(
      map,
      userWarehouses
    );

    if (layerControlRef.current) {
      map.removeControl(layerControlRef.current);
    }
    layerControlRef.current = addLayerControl(
      map,
      baseLayerRef.current!,
      userWarehouseLayerRef.current!,
      otherWarehouseLayerRef.current!,
      transactionLayerRef.current!
    );

    if (!initialFitDoneRef.current) {
      if (focusWarehouseId) {
        const focusWarehouse = userWarehouses.find(
          (w) => w._id === focusWarehouseId
        );
        if (focusWarehouse?.latitude && focusWarehouse?.longitude) {
          map.setView([focusWarehouse.latitude, focusWarehouse.longitude], 10);
        } else {
          fitMapToMarkers(map, userWarehouses);
        }
      } else {
        fitMapToMarkers(map, userWarehouses);
      }
      initialFitDoneRef.current = true;
    }
  }, [
    userWarehouses,
    otherWarehouses,
    transactions,
    mapLoaded,
    onWarehouseSelect,
    onTransactionsSelect,
    focusWarehouseId,
  ]);

  return (
    <div className="relative h-full w-full">
      <div id="map" className="h-full w-full rounded-lg overflow-hidden" />
      <div className="absolute bottom-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-md">
        <h2 className="font-bold mb-2 text-lg">Map Information</h2>
        <div className="flex justify-between items-start">
          <div className="mr-8">
            <div className="flex items-center mb-1">
              <WarehouseIcon color="#4CAF50" size={16} className="mr-2" />
              <span className="text-sm">
                User Warehouse:{" "}
                <span className="font-semibold">{userWarehouses.length}</span>
              </span>
            </div>
            <div className="flex items-center mb-1">
              <WarehouseIcon color="#FF5722" size={16} className="mr-2" />
              <span className="text-sm">
                Other Warehouse:{" "}
                <span className="font-semibold">{otherWarehouses.length}</span>
              </span>
            </div>
            <div className="flex items-center">
              <CircleDot color="#3388ff" size={16} className="mr-2" />
              <span className="text-sm">
                Transaction:{" "}
                <span className="font-semibold">{transactions.length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(WorldMap), { ssr: false });
