"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, Plus, Pencil } from "lucide-react";
import { getInventorySummary } from "@/app/actions/catalog";

export default function InventoryManagementPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInventorySummary().then((data) => {
      setInventory(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading inventory catalog...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Inventory Catalog</h1>
          <p className="text-gray-500 mt-2">Manage items available for agents to request.</p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>

      <Card className="shadow-sm border-white/10">
        <CardHeader className="bg-white/5 border-b">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-lg">Catalog Items</CardTitle>
          </div>
          <CardDescription>View limits, stock levels, and costs for the brokerage inventory.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Item Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Max / Agent</TableHead>
                <TableHead>Total Stock</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-6 font-medium">{item.item}</TableCell>
                  <TableCell>
                    {item.isReturnable ? (
                      <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-2 py-1 text-xs font-medium text-brand-blue ring-1 ring-inset ring-blue-700/10">Returnable Asset</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-slate-500/10">Consumable</span>
                    )}
                  </TableCell>
                  <TableCell>{item.cost === 0 ? "Free" : `$${item.cost.toFixed(2)}`}</TableCell>
                  <TableCell>{item.maxPerAgent}</TableCell>
                  <TableCell>{item.total}</TableCell>
                  <TableCell>
                    <span className={item.available < (item.total * 0.1) ? 'text-red-500 font-bold' : ''}>
                      {item.available}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="outline" size="sm" disabled>
                      <Pencil className="h-3 w-3 mr-1" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="text-sm text-gray-500 mt-4 text-center">
        *Note: The catalog data structure is now real and connected to the database. The Edit/Add UI forms can be built out next.
      </div>
    </div>
  );
}
