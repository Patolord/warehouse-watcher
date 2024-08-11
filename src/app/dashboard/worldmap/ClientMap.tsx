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

interface Warehouse {
    id: string;
    lat: number;
    lng: number;
    name: string;
}

interface Transaction {
    id: string;
    from: string;
    to: string;
    amount?: number;
    date?: string;
}

const ClientMap = () => {
    const warehouses = useQuery(api.warehouses.getAllWarehousePositions);
    const allTransactions = useQuery(api.transactions.getAllTransactions);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    if (warehouses === undefined || allTransactions === undefined) return <div>Loading...</div>;

    // Filter out any transactions with empty 'from' or 'to' fields
    const validTransactions = allTransactions.filter(
        (t): t is Transaction => t.from !== '' && t.to !== ''
    );

    return (
        <div style={{ width: '100%' }}>
            <MapComponent warehouses={warehouses} transactions={validTransactions} height="70vh" />
        </div>
    );
};

export default ClientMap;