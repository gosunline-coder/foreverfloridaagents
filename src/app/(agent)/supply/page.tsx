"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { getSupplyRequests, createSupplyRequest, getCatalog } from "@/app/actions/agent";

type SupplyRequest = {
  id: string;
  itemType: string;
  quantity: number;
  status: string;
  requestedAt: Date;
};

type CatalogItem = {
  id: string;
  name: string;
  cost: number;
  maxPerAgent: number;
  isReturnable: boolean;
};

export default function SupplyPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [newQty, setNewQty] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    if (user?.id) {
      const [reqData, catData] = await Promise.all([
        getSupplyRequests(user.id),
        getCatalog()
      ]);
      setRequests(reqData);
      setCatalog(catData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || !newQty || !user?.id) return;
    
    setSubmitting(true);
    const res = await createSupplyRequest(user.id, selectedItemId, parseInt(newQty));
    if (res.success) {
      setNewQty("");
      setSelectedItemId("");
      await fetchData();
    } else {
      alert(res.error || "Failed to submit request.");
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading supply requests...</div>;
  }

  const selectedItem = catalog.find(i => i.id === selectedItemId);

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
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  required
                >
                  <option value="" disabled>Select item...</option>
                  {catalog.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} {item.cost === 0 ? "(Free)" : `($${item.cost})`}
                    </option>
                  ))}
                </select>
              </div>

              {selectedItem && (
                <div className="p-3 bg-slate-50 border rounded-md text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Action:</span>
                    <span className="font-medium">
                      {selectedItem.isReturnable ? "Borrow (Free)" : "Purchase"}
                    </span>
                  </div>
                  {selectedItem.isReturnable && (
                    <div className="text-xs text-brand-blue pt-1">
                      This is a physical asset and remains brokerage property.
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max allowed:</span>
                    <span className="font-medium">{selectedItem.maxPerAgent}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input 
                  type="number" 
                  min="1" 
                  max={selectedItem?.maxPerAgent || 100}
                  required 
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  disabled={!selectedItem}
                />
              </div>
              <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90" disabled={submitting || !selectedItem}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>
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
                  <TableHead className="text-right pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="pl-6 font-medium">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-slate-400" />
                        {req.itemType}
                      </div>
                    </TableCell>
                    <TableCell>{req.quantity}</TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {new Date(req.requestedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right pr-6">
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
                {requests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                      You haven't made any supply requests yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
