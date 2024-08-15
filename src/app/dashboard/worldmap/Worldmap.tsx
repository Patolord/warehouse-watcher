'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet-polylinedecorator';
import { Warehouse, TransactionWithWarehouseInfo } from './types';
import { mapConfig, createIcon } from './mapConfig';
import { createMarkers } from './markerCreation';
import { fitMapToMarkers } from './mapFitting';
import { createTransactionPaths } from './pathCreation';
import { injectAnimationCSS } from './utils';
import {
    addFitToMarkersControl,
    addZoomControls,
    addScaleControl,
    addLayerControl,
    addLegendControl
} from './mapControls';

interface WorldMapProps {
    locations: Warehouse[];
    transactions: TransactionWithWarehouseInfo[];
}

const WorldMap: React.FC<WorldMapProps> = ({ locations, transactions }) => {
    const mapRef = useRef<L.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || mapLoaded) return;

        const initMap = () => {
            injectAnimationCSS();

            if (!mapRef.current) {
                const map = L.map('map', {
                    ...mapConfig.initialView,
                    zoomControl: false
                });
                const baseLayer = L.tileLayer(mapConfig.tileLayer.url, {
                    attribution: mapConfig.tileLayer.attribution
                }).addTo(map);
                mapRef.current = map;

                const mapContainer = map.getContainer();
                mapContainer.style.filter = mapConfig.mapFilter;

                const warehouseLayer = L.layerGroup().addTo(map);
                const transactionLayer = L.layerGroup().addTo(map);

                // Add controls
                addFitToMarkersControl(map, locations);
                addZoomControls(map);
                addScaleControl(map);
                addLayerControl(map, baseLayer, warehouseLayer, transactionLayer);
                addLegendControl(map);

                createMarkers(locations, map, createIcon).forEach(marker => warehouseLayer.addLayer(marker));

                const transactionLayers = createTransactionPaths(transactions, map);
                transactionLayers.forEach(layer => transactionLayer.addLayer(layer));

                fitMapToMarkers(map, locations);

                map.invalidateSize();

                setMapLoaded(true);
            }
        };

        initMap();
    }, [locations, transactions, mapLoaded]);

    return <div id="map" className="h-full w-full rounded-lg overflow-hidden" />;
};

export default dynamic(() => Promise.resolve(WorldMap), { ssr: false });