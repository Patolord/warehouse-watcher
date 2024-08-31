"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

export function QuickActions() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Search products..."
            className="border-[#0066cc]"
          />
          <Button size="icon" className="bg-[#0066cc] hover:bg-[#0052a3]">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button className="bg-[#0066cc] hover:bg-[#0052a3]">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
          <Button
            variant="outline"
            className="border-[#0066cc] text-[#0066cc] hover:bg-[#e6f2ff]"
          >
            Generate Report
          </Button>
          <Button
            variant="outline"
            className="border-[#0066cc] text-[#0066cc] hover:bg-[#e6f2ff]"
          >
            Adjust Stock
          </Button>
          <Button
            variant="outline"
            className="border-[#0066cc] text-[#0066cc] hover:bg-[#e6f2ff]"
          >
            Manage Orders
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
