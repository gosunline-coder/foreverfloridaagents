"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, FileText, Download, CheckCircle } from "lucide-react";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ackedDocs, setAckedDocs] = useState<string[]>(["doc-1"]);

  const handleAck = (id: string) => {
    if (!ackedDocs.includes(id)) setAckedDocs([...ackedDocs, id]);
  };

  const documents = [
    { id: "doc-1", title: "Independent Contractor Agreement", category: "Legal", updated: "2023-10-01", requiresAck: true },
    { id: "doc-2", title: "Forever Florida Office Policies v2", category: "Policy", updated: "2023-11-15", requiresAck: true },
    { id: "doc-3", title: "Exclusive Right of Sale Listing Agreement", category: "Forms", updated: "2023-01-20", requiresAck: false },
    { id: "doc-4", title: "Lead-Based Paint Disclosure", category: "Disclosures", updated: "2022-05-10", requiresAck: false },
    { id: "doc-5", title: "Wire Fraud Advisory", category: "Disclosures", updated: "2023-08-22", requiresAck: true },
  ];

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Document Library</h1>
        <p className="text-gray-500 mt-2">Search and download brokerage forms, policies, and disclosures.</p>
      </div>

      <div className="flex items-center space-x-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search documents..." 
            className="pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.length > 0 ? filteredDocs.map((doc) => {
              const isAcked = ackedDocs.includes(doc.id);
              return (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      {doc.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50">{doc.category}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">{doc.updated}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    {doc.requiresAck && !isAcked && (
                      <Button variant="default" size="sm" onClick={() => handleAck(doc.id)} className="bg-orange-500 hover:bg-orange-600">
                        Acknowledge
                      </Button>
                    )}
                    {doc.requiresAck && isAcked && (
                      <Button variant="outline" size="sm" disabled className="border-emerald-200 text-emerald-600 bg-emerald-50">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Acknowledged
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            }) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  No documents found matching "{searchQuery}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
