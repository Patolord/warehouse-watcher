'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Warehouse, TransactionWithWarehouseInfo } from './types';
import dynamic from 'next/dynamic';
import { mapConfig, createIcon } from './mapConfig';
import { Warehouse as WarehouseIcon } from 'lucide-react';

interface WorldMapProps {
    locations: Warehouse[];
    transactions: TransactionWithWarehouseInfo[];
}

const WorldMap: React.FC<WorldMapProps> = ({ locations, transactions }) => {
    const mapRef = useRef<L.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const initMap = async () => {
                const L = (await import('leaflet')).default;
                await import('leaflet-polylinedecorator');
                const { createMarkers, fitMapToMarkers, createTransactionPaths, injectAnimationCSS } = await import('./mapMarkers');

                injectAnimationCSS(); // Inject the CSS for animation

                if (!mapRef.current) {
                    const map = L.map('map', mapConfig.initialView);
                    L.tileLayer(mapConfig.tileLayer.url, {
                        attribution: mapConfig.tileLayer.attribution
                    }).addTo(map);
                    mapRef.current = map;

                    // Apply grayscale filter
                    const mapContainer = map.getContainer();
                    mapContainer.style.filter = mapConfig.mapFilter;
                }

                const map = mapRef.current;
                if (map) {
                    map.eachLayer((layer) => {
                        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                            layer.remove();
                        }
                    });

                    const markers = createMarkers(locations, map, createIcon);
                    createTransactionPaths(transactions, map);
                    fitMapToMarkers(map, locations);

                    // Ensure the map fits its container after any size changes
                    setTimeout(() => {
                        map.invalidateSize();
                    }, 0);

                    setMapLoaded(true);
                } else {
                    console.error('Map failed to initialize');
                }
            };

            initMap();
        }
    }, [locations, transactions]);

    return <div id="map" className="h-full w-full rounded-lg overflow-hidden" />;
};

// Dynamically import the component with SSR disabled
export default dynamic(() => Promise.resolve(WorldMap), {
    ssr: false
});