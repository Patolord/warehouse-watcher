export interface Distribution {
    name: string;
    value: number;
}

export interface StockLevel {
    id: string;
    name: string;
    quantity: number;
}

export interface Trend {
    date: string;
    count: number;
}

export interface Activity {
    id: string;
    actionType: string;
    details: any;
    time: string;

}

export interface Stats {
    totalMaterials: number;
    totalWarehouses: number;
    totalTransactions: number;
    totalUsers: number;
}