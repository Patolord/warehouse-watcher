'use client'

import React from 'react';
import { useQuery } from 'convex/react';

import dynamic from 'next/dynamic';
import { Warehouse, TransactionWithWarehouseInfo } from './types';
import { api } from '../../../../convex/_generated/api';

const DynamicWorldMap = dynamic(() => import('./Worldmap'), {
    ssr: false,
    loading: () => <p>Loading map...</p>
});

const WarehousePage: React.FC = () => {
    const warehouses = useQuery(api.warehouses.getWarehouses) as Warehouse[] | undefined;
    const transactions = useQuery(api.transactions.getTransactionsWithLocations) as TransactionWithWarehouseInfo[] | undefined;

    if (warehouses === undefined || transactions === undefined) {
        return <div className="h-full flex items-center justify-center">Loading data...</div>;
    }

    return (
        <div className="h-full flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-4">Warehouse Locations and Transactions</h1>
            <div className="flex-1 bg-white rounded-lg border">
                <div className="h-full">
                    <DynamicWorldMap locations={warehouses} transactions={transactions} />
                </div>
            </div>
        </div>
    );
};

export default WarehousePage;