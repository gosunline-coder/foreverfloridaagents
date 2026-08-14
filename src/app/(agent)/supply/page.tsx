"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { getSupplyRequests, createSupplyRequest, getCatalog, initiateReturn } from "@/app/actions/agent";

type SupplyRequest = {
  id: string;
  itemType: string;
  quantity: number;
  status: string;
  requestedAt: Date;
  returnedAt?: Date | null;
  propertyAddress?: string | null;
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
  const [propertyAddress, setPropertyAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    if (user?.id) {
      const [reqData, catData] = await Promise.all([
        getSupplyRequests(),
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
    try {
      const res = await createSupplyRequest(selectedItemId, parseInt(newQty), propertyAddress);
      if (res.success) {
        setNewQty("");
        setSelectedItemId("");
        setPropertyAddress("");
        await fetchData();
      } else {
        alert(res.error || "Failed to submit request.");
      }
    } catch (err: any) {
      alert("An error occurred: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturn = async (id: string) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'return_pending' } : req));
    await initiateReturn(id);
    await fetchData();
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading supply requests...</div>;
  }

  const selectedItem = catalog.find(i => i.id === selectedItemId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Supply Requests</h1>
        <p className="text-muted-foreground mt-2">Order yard signs, lockboxes, and business cards.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Request Form */}
        <Card className="bg-card border-border shadow-sm md:col-span-1">
          <CardHeader>
            <CardTitle className="text-foreground">Request New Supplies</CardTitle>
            <CardDescription>Select an item from the catalog.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Item Category</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue"
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
                <div className="p-3 bg-muted/50 border rounded-md text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Action:</span>
                    <span className="font-medium text-foreground">
                      {selectedItem.isReturnable ? "Borrow (Free)" : "Purchase"}
                    </span>
                  </div>
                  {selectedItem.isReturnable && (
                    <div className="text-xs text-brand-blue pt-1">
                      This is a physical asset and remains brokerage property.
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max allowed:</span>
                    <span className="font-medium text-foreground">{selectedItem.maxPerAgent}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input 
                  type="number" 
                  min="1" 
                  className="bg-background border-border text-foreground"
                  max={selectedItem?.maxPerAgent || 100}
                  required 
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  disabled={!selectedItem}
                />
              </div>

              {selectedItem?.isReturnable && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Property Address</label>
                  <Input 
                    type="text" 
                    placeholder="e.g. 123 Main St" 
                    className="bg-background border-border text-foreground"
                    required 
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Required for physical assets.</p>
                </div>
              )}

              <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90" disabled={submitting || !selectedItem}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Request History */}
        <Card className="bg-card border-border shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Your Request History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Item</TableHead>
                    <TableHead className="text-muted-foreground">Qty</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-right text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {requests.map((req) => {
                  const catalogItem = catalog.find(c => c.name === req.itemType);
                  return (
                  <TableRow key={req.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{req.itemType}</div>
                          {req.propertyAddress && (
                            <div className="text-xs text-muted-foreground font-normal mt-0.5">{req.propertyAddress}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{req.quantity}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-slate-400 text-sm">
                        <div>{new Date(req.requestedAt).toLocaleDateString()}</div>
                        {req.returnedAt && req.status === 'returned' && (
                          <div className="text-xs text-slate-400">
                            Returned: {new Date(req.returnedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end items-center gap-2">
                        {req.status === 'fulfilled' && catalogItem?.isReturnable && (
                          <Button size="sm" variant="outline" onClick={() => handleReturn(req.id)}>
                            Return Item
                          </Button>
                        )}
                        {req.status === 'fulfilled' ? (
                          <Badge variant="outline" className="bg-emerald-400/10 text-emerald-400 border-emerald-400/30">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Fulfilled
                          </Badge>
                        ) : req.status === 'return_pending' ? (
                          <Badge variant="outline" className="bg-yellow-400/10 text-yellow-400 border-yellow-400/30">
                            Return Pending Verif.
                          </Badge>
                        ) : req.status === 'returned' ? (
                          <Badge variant="outline" className="bg-slate-400/10 text-slate-400 border-slate-400/30">
                            Returned
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-400/10 text-yellow-400 border-yellow-400/30">
                            <Clock className="h-3 w-3 mr-1" /> Pending
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )})}
                {requests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-400">
                      You haven't made any supply requests yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
