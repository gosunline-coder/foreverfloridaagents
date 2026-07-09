"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle2 } from "lucide-react";

export default function SupplyPage() {
  const [requests, setRequests] = useState([
    { id: "REQ-101", item: "Open House Directional Signs", qty: 5, date: "2023-10-15", status: "fulfilled" },
    { id: "REQ-102", item: "Bluetooth Lockbox", qty: 2, date: "2023-10-20", status: "requested" },
  ]);

  const [newItem, setNewItem] = useState("");
  const [newQty, setNewQty] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem || !newQty) return;
    
    setRequests([
      {
        id: `REQ-${Math.floor(Math.random() * 1000)}`,
        item: newItem,
        qty: parseInt(newQty),
        date: new Date().toISOString().split('T')[0],
        status: "requested"
      },
      ...requests
    ]);
    setNewItem("");
    setNewQty("");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Supply Requests</h1>
        <p className="text-gray-500 mt-2">Request lockboxes, signs, and apparel from the office inventory.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Request Form */}
        <Card className="md:col-span-1 shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg">New Request</CardTitle>
            <CardDescription>Submit a new item request.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Item Category</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  required
                >
                  <option value="" disabled>Select item...</option>
                  <option value="Yard Sign (For Sale)">Yard Sign (For Sale)</option>
                  <option value="Open House Directional Signs">Open House Directional Signs</option>
                  <option value="Bluetooth Lockbox">Bluetooth Lockbox</option>
                  <option value="Name Badge">Name Badge</option>
                  <option value="Business Cards (500ct)">Business Cards (500ct)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input 
                  type="number" 
                  min="1" 
                  max="100" 
                  required 
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">Submit Request</Button>
            </form>
          </CardContent>
        </Card>

        {/* Request History */}
        <Card className="md:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg">Your Requests</CardTitle>
            <CardDescription>Track the status of your supply requests.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="pl-6 font-medium">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-slate-400" />
                        {req.item}
                      </div>
                    </TableCell>
                    <TableCell>{req.qty}</TableCell>
                    <TableCell className="text-slate-500">{req.date}</TableCell>
                    <TableCell>
                      {req.status === 'fulfilled' ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Fulfilled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          <Clock className="h-3 w-3 mr-1" /> Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
