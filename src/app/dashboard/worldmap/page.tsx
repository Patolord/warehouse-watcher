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

    const viewer = useQuery(api.users.viewer, {});
    if (!viewer) {
        <p>loading</p>
    }

    // Assume we have a way to get the current user's ID
    const currentUserId = viewer?._id; // Replace with actual user ID retrieval

    if (!currentUserId) {
        return <div className="h-full flex items-center justify-center">No user ID found
        </div>;
    }
    const userWarehouses = useQuery(api.warehouses.getWarehousesByUser, { userId: currentUserId }) as Warehouse[] | undefined;
    const allWarehouses = useQuery(api.warehouses.getWarehouses) as Warehouse[] | undefined;
    const transactions = useQuery(api.transactions.getTransactionsWithLocations) as TransactionWithWarehouseInfo[] | undefined;

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
                        userWarehouses={userWarehouses}
                        otherWarehouses={otherWarehouses}
                        transactions={transactions}
                    />
                </div>
            </div>
        </div>
    );
};

export default WarehousePage;