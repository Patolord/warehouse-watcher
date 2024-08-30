'use client'

import React from 'react';
import { useQuery } from 'convex/react';
import dynamic from 'next/dynamic';
import { Warehouse, TransactionWithWarehouseInfo } from './types';
import { api } from '../../../../../convex/_generated/api';

const DynamicWorldMap = dynamic(() => import('./Worldmap'), {
    ssr: false,
    loading: () => <p>Loading map...</p>
});

const WarehousePage: React.FC = () => {
    const userWarehouses = useQuery(api.warehouses.getWarehousesByUser)
    const allWarehouses = useQuery(api.warehouses.getWarehouses);
    const transactions = useQuery(api.transactions.getTransactionsWithLocations);


    if (userWarehouses === undefined || allWarehouses === undefined || transactions === undefined) {
        return <div className="h-full flex items-center justify-center">Loading data...</div>;
    }

    const otherWarehouses = allWarehouses.filter(warehouse =>
        !userWarehouses.some(userWarehouse => userWarehouse._id === warehouse._id)
    );

    return (
        <div className="h-full flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-4">Warehouse Locations and Transactions</h1>
            <div className="flex-1 bg-white rounded-lg border">
                <div className="h-full">
                    <DynamicWorldMap
                        userWarehouses={userWarehouses as Warehouse[]}
                        otherWarehouses={otherWarehouses}
                        transactions={transactions as TransactionWithWarehouseInfo[]}
                    />
                </div>
            </div>
        </div>
    );
};

export default WarehousePage;