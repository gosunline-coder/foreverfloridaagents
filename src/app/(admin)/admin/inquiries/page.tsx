"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Building } from "lucide-react";

export default function InquiriesPage() {
  const inquiries = [
    { id: 1, name: "Alice Waters", email: "alice@example.com", phone: "(727) 555-9876", brokerage: "Sunshine Realty", message: "Looking for better support and splits.", date: "2023-10-26", status: "New" },
    { id: 2, name: "Bob Harris", email: "bob@example.com", phone: "(813) 555-4321", brokerage: "Gulf Coast Properties", message: "Interested in the tools you provide.", date: "2023-10-25", status: "Contacted" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Recruiting Inquiries</h1>
        <p className="text-gray-500 mt-2">Leads submitted from the public website's "Meet with Delia" form.</p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-lg">Recent Inquiries</CardTitle>
          <CardDescription>Follow up with prospective agents.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 w-[200px]">Prospect Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Current Brokerage</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inq) => (
                <TableRow key={inq.id}>
                  <TableCell className="pl-6 font-medium">{inq.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1 text-sm">
                      <span className="flex items-center text-slate-600"><Mail className="h-3 w-3 mr-1" /> {inq.email}</span>
                      <span className="flex items-center text-slate-600"><Phone className="h-3 w-3 mr-1" /> {inq.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center text-slate-700 text-sm">
                      <Building className="h-3 w-3 mr-1 text-slate-400" /> {inq.brokerage}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-slate-500 text-sm" title={inq.message}>
                    {inq.message}
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">{inq.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      inq.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }>
                      {inq.status}
                    </Badge>
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
