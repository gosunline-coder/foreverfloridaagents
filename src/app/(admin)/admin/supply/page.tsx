"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Check, Clock, Undo2, MapPin } from "lucide-react";
import { getAllSupplyRequests, fulfillSupplyRequest, returnSupplyRequest } from "@/app/actions/admin";

type RequestType = {
  id: string;
  agentName: string;
  itemType: string;
  quantity: number;
  status: string;
  propertyAddress: string | null;
  isReturnable: boolean;
  requestedAt: string;
  returnedAt: string | null;
};

export default function AdminSupplyPage() {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getAllSupplyRequests();
    setRequests(data);
    setLoading(false);
  };

  const handleFulfill = async (id: string) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: "fulfilled" } : req));
    await fulfillSupplyRequest(id);
    await fetchData();
  };

  const handleReturn = async (id: string) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: "returned" } : req));
    await returnSupplyRequest(id);
    await fetchData();
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading supply requests...</div>;
  }

  const pendingRequests = requests.filter(r => r.status === 'requested');
  const activeBorrows = requests.filter(r => (r.status === 'fulfilled' || r.status === 'return_pending') && r.isReturnable);
  const history = requests.filter(r => r.status === 'returned' || (r.status === 'fulfilled' && !r.isReturnable));

  const renderTable = (data: RequestType[], showReturnBtn: boolean) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-6">Request ID</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Item & Location</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right pr-6">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((req) => (
          <TableRow key={req.id}>
            <TableCell className="pl-6 font-medium text-slate-400 text-sm">{req.id.slice(-6).toUpperCase()}</TableCell>
            <TableCell className="font-semibold text-white">{req.agentName}</TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-slate-400" />
                  {req.itemType}
                </div>
                {req.propertyAddress && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {req.propertyAddress}
                  </div>
                )}
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
            <TableCell>
              {req.status === 'requested' && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                  <Clock className="h-3 w-3 mr-1" /> Pending
                </Badge>
              )}
              {req.status === 'fulfilled' && req.isReturnable && (
                <Badge variant="outline" className="bg-brand-blue/10 text-brand-blue border-brand-blue/30">
                  Active Borrow
                </Badge>
              )}
              {req.status === 'return_pending' && req.isReturnable && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                  <Clock className="h-3 w-3 mr-1" /> Agent Dropped Off
                </Badge>
              )}
              {req.status === 'fulfilled' && !req.isReturnable && (
                <Badge variant="outline" className="bg-brand-green/10 text-brand-green border-brand-green/30">
                  <Check className="h-3 w-3 mr-1" /> Fulfilled
                </Badge>
              )}
              {req.status === 'returned' && (
                <Badge variant="outline" className="bg-white/5 text-slate-300 border-white/10">
                  Returned
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-right pr-6">
              {req.status === 'requested' && (
                <Button size="sm" onClick={() => handleFulfill(req.id)} className="bg-brand-green hover:bg-emerald-700 text-white">
                  Mark Fulfilled
                </Button>
              )}
              {showReturnBtn && (req.status === 'fulfilled' || req.status === 'return_pending') && req.isReturnable && (
                <Button 
                  size="sm" 
                  variant={req.status === 'return_pending' ? 'default' : 'outline'}
                  className={req.status === 'return_pending' ? "bg-amber-600 hover:bg-amber-700" : ""}
                  onClick={() => handleReturn(req.id)}
                >
                  <Undo2 className="h-3 w-3 mr-2" /> Confirm Return
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
        {data.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-slate-400">
              No requests found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto py-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Supply Management</h1>
        <p className="text-gray-500 mt-2">Track inventory requests, deployed assets, and returns.</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="pending">
            Pending <Badge className="ml-2 bg-slate-200 text-slate-200 hover:bg-slate-200">{pendingRequests.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="borrows">
            Active Borrows <Badge className="ml-2 bg-brand-blue/20 text-brand-blue hover:bg-brand-blue/20">{activeBorrows.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card className="shadow-sm border-white/10">
            <CardHeader className="bg-white/5 border-b">
              <CardTitle className="text-lg">Pending Requests</CardTitle>
              <CardDescription>Review and fulfill new requests for supplies or assets.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {renderTable(pendingRequests, false)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="borrows">
          <Card className="shadow-sm border-white/10">
            <CardHeader className="bg-white/5 border-b">
              <CardTitle className="text-lg">Active Borrows</CardTitle>
              <CardDescription>Track physical assets (like lockboxes) deployed in the field.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {renderTable(activeBorrows, true)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="shadow-sm border-white/10">
            <CardHeader className="bg-white/5 border-b">
              <CardTitle className="text-lg">Request History</CardTitle>
              <CardDescription>Log of completed consumable requests and returned assets.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {renderTable(history, false)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
