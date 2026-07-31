"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Check, Clock } from "lucide-react";
import { getAllSupplyRequests, fulfillSupplyRequest } from "@/app/actions/admin";

type RequestType = {
  id: string;
  agentName: string;
  itemType: string;
  quantity: number;
  status: string;
  requestedAt: string;
};

export default function AdminSupplyPage() {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSupplyRequests().then((data) => {
      setRequests(data);
      setLoading(false);
    });
  }, []);

  const handleFulfill = async (id: string) => {
    // Optimistic UI update
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: "fulfilled" } : req
    ));
    await fulfillSupplyRequest(id);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading supply requests...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Supply Management</h1>
        <p className="text-gray-500 mt-2">Manage and fulfill agent requests for office inventory.</p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-lg">Agent Requests</CardTitle>
          <CardDescription>Review pending requests and mark them as fulfilled.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Request ID</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="pl-6 font-medium text-slate-500 text-sm">{req.id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{req.agentName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-slate-400" />
                      {req.itemType}
                    </div>
                  </TableCell>
                  <TableCell>{req.quantity}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{new Date(req.requestedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {req.status === 'fulfilled' ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        <Check className="h-3 w-3 mr-1" /> Fulfilled
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Clock className="h-3 w-3 mr-1" /> Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    {req.status === 'requested' && (
                      <Button size="sm" onClick={() => handleFulfill(req.id)} className="bg-brand-green hover:bg-emerald-700 text-white">
                        Mark Fulfilled
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
