'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet-polylinedecorator';
import { Warehouse, TransactionWithWarehouseInfo } from './types';
import { mapConfig, createIcon } from './mapConfig';
import { createMarkers } from './markerCreation';
import { createTransactionPaths } from './pathCreation';
import { injectAnimationCSS } from './utils';
import {
    addFitToMarkersControl,
    addZoomControls,
    addScaleControl,
    addLayerControl,
    addLegendControl
} from './mapControls';
import { fitMapToMarkers } from './mapFitting';

interface WorldMapProps {
    userWarehouses: Warehouse[];
    otherWarehouses: Warehouse[];
    transactions: TransactionWithWarehouseInfo[];
}

const WorldMap: React.FC<WorldMapProps> = ({ userWarehouses, otherWarehouses, transactions }) => {
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
        if (typeof window === 'undefined' || mapLoaded) return;

        const initMap = () => {
            injectAnimationCSS();

            if (!mapRef.current) {
                const map = L.map('map', {
                    ...mapConfig.initialView,
                    zoomControl: false
                });
                baseLayerRef.current = L.tileLayer(mapConfig.tileLayer.url, {
                    attribution: mapConfig.tileLayer.attribution
                }).addTo(map);
                mapRef.current = map;

                const mapContainer = map.getContainer();
                mapContainer.style.filter = mapConfig.mapFilter;

                userWarehouseLayerRef.current = L.layerGroup().addTo(map);
                otherWarehouseLayerRef.current = L.layerGroup().addTo(map);
                transactionLayerRef.current = L.layerGroup().addTo(map);

                // Add controls
                addZoomControls(map);
                addScaleControl(map);
                addLegendControl(map);

                map.invalidateSize();

                setMapLoaded(true);
            }
        };

        initMap();
    }, [mapLoaded]);

    useEffect(() => {
        if (!mapRef.current || !userWarehouseLayerRef.current || !otherWarehouseLayerRef.current || !transactionLayerRef.current || !baseLayerRef.current || !mapLoaded) return;

        const map = mapRef.current;

        // Clear existing layers
        userWarehouseLayerRef.current.clearLayers();
        otherWarehouseLayerRef.current.clearLayers();
        transactionLayerRef.current.clearLayers();

        // Add user warehouse markers
        createMarkers(userWarehouses, map, (location) => createIcon(location, 'user'))
            .forEach(marker => userWarehouseLayerRef.current!.addLayer(marker));

        // Add other warehouse markers
        createMarkers(otherWarehouses, map, (location) => createIcon(location, 'other'))
            .forEach(marker => otherWarehouseLayerRef.current!.addLayer(marker));

        // Add transaction paths
        const transactionLayers = createTransactionPaths(transactions, map);
        transactionLayers.forEach(layer => transactionLayerRef.current!.addLayer(layer));

        // Update "Fit to Markers" control
        if (fitToMarkersControlRef.current) {
            map.removeControl(fitToMarkersControlRef.current);
        }
        fitToMarkersControlRef.current = addFitToMarkersControl(map, [...userWarehouses, ...otherWarehouses]);

        // Update layer control
        if (layerControlRef.current) {
            map.removeControl(layerControlRef.current);
        }
        layerControlRef.current = addLayerControl(
            map,
            baseLayerRef.current,
            userWarehouseLayerRef.current,
            otherWarehouseLayerRef.current,
            transactionLayerRef.current
        );

        // Fit map to markers only on initial load
        if (!initialFitDoneRef.current) {
            fitMapToMarkers(map, [...userWarehouses, ...otherWarehouses]);
            initialFitDoneRef.current = true;
        }

    }, [userWarehouses, otherWarehouses, transactions, mapLoaded]);

    return <div id="map" className="h-full w-full rounded-lg overflow-hidden" />;
};

export default dynamic(() => Promise.resolve(WorldMap), { ssr: false });