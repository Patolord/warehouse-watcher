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
    const [isMapInitialized, setIsMapInitialized] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || isMapInitialized) return;

        const initializeMap = () => {
            injectAnimationCSS();

            const map = L.map('map', {
                ...mapConfig.initialView,
                zoomControl: false
            });

            const baseLayer = L.tileLayer(mapConfig.tileLayer.url, {
                attribution: mapConfig.tileLayer.attribution
            }).addTo(map);

            const warehouseLayer = L.layerGroup().addTo(map);
            const transactionLayer = L.layerGroup().addTo(map);

            map.getContainer().style.filter = mapConfig.mapFilter;

            addMapControls(map, baseLayer, warehouseLayer, transactionLayer);
            addMarkersAndPaths(map, warehouseLayer, transactionLayer);

            fitMapToMarkers(map, locations);
            map.invalidateSize();

            mapRef.current = map;
            setIsMapInitialized(true);
        };

        const addMapControls = (
            map: L.Map,
            baseLayer: L.TileLayer,
            warehouseLayer: L.LayerGroup,
            transactionLayer: L.LayerGroup
        ) => {
            addFitToMarkersControl(map, locations);
            addZoomControls(map);
            addScaleControl(map);
            addLayerControl(map, baseLayer, warehouseLayer, transactionLayer);
            addLegendControl(map);
        };

        const addMarkersAndPaths = (
            map: L.Map,
            warehouseLayer: L.LayerGroup,
            transactionLayer: L.LayerGroup
        ) => {
            const markers = createMarkers(locations, map, createIcon);
            markers.forEach(marker => warehouseLayer.addLayer(marker));

            const transactionPaths = createTransactionPaths(transactions, map);
            transactionPaths.forEach(path => transactionLayer.addLayer(path));
        };

        initializeMap();
    }, [locations, transactions, isMapInitialized]);

    return <div id="map" className="h-full w-full rounded-lg overflow-hidden" />;
};

export default dynamic(() => Promise.resolve(WorldMap), { ssr: false });