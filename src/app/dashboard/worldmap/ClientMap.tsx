'use client';


import { useQuery } from 'convex/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { api } from '../../../../convex/_generated/api';

const MapComponent = dynamic(
    () => import('./Map'),
    {
        loading: () => <p>Loading map...</p>,
        ssr: false
    }
);

const ClientMap = () => {
    const warehousePositions = useQuery(api.warehouses.getAllWarehousePositions);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    if (warehousePositions === undefined) return <div>Loading...</div>;

    return (
        <div style={{ width: '100%' }}>
            <MapComponent markers={warehousePositions} height="70vh" />
        </div>
    );
};

export default ClientMap;