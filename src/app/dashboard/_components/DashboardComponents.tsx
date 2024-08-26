'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, DollarSign, TrendingUp, AlertTriangle, Plus, Search } from 'lucide-react'

// Sample data (replace with your actual data)
const stockLevels = [
    { name: 'Product A', stock: 120 },
    { name: 'Product B', stock: 80 },
    { name: 'Product C', stock: 200 },
    { name: 'Product D', stock: 150 },
    { name: 'Product E', stock: 100 },
]

const categoryDistribution = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Food', value: 200 },
    { name: 'Books', value: 100 },
]

const inventoryTrends = [
    { date: '2023-01', total: 1000 },
    { date: '2023-02', total: 1200 },
    { date: '2023-03', total: 1100 },
    { date: '2023-04', total: 1300 },
    { date: '2023-05', total: 1500 },
]

const recentActivities = [
    { id: 1, message: 'New shipment of Product A received', time: '2 hours ago' },
    { id: 2, message: 'Low stock alert for Product B', time: '4 hours ago' },
    { id: 3, message: 'Inventory count completed for Warehouse 2', time: '1 day ago' },
    { id: 4, message: 'New order #1234 processed', time: '1 day ago' },
    { id: 5, message: 'Product C restocked', time: '2 days ago' },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function DashboardDemo() {
    return (
        <div className="p-6 space-y-6 bg-background">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">+10% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$1,234,567</div>
                        <p className="text-xs text-muted-foreground">+5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Stock Turnover</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.5</div>
                        <p className="text-xs text-muted-foreground">-2% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">Action needed</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Inventory Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={inventoryTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="total" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {recentActivities.map((activity) => (
                                <li key={activity.id} className="flex items-start space-x-2">
                                    <div className="bg-primary rounded-full p-1">
                                        <Package className="h-4 w-4 text-primary-foreground" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{activity.message}</p>
                                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Stock Levels</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stockLevels}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="stock" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex space-x-2">
                            <Input placeholder="Search products..." />
                            <Button size="icon">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Product
                            </Button>
                            <Button variant="outline">Generate Report</Button>
                            <Button variant="outline">Adjust Stock</Button>
                            <Button variant="outline">Manage Orders</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}