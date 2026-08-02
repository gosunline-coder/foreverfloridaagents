"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Building, X, Clock, Briefcase, Plus } from "lucide-react";
import { updateInquiryStatus, addInquiryNote } from "@/app/actions/admin";

type InquiryNote = {
  id: string;
  text: string;
  createdAt: string;
};

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  currentBrokerage: string | null;
  message: string;
  status: string;
  notes: InquiryNote[];
  submittedAt: string;
};

export default function InquiriesClient({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");

  const handleRowClick = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setNewNoteText("");
  };

  const handleClose = () => {
    setSelectedInquiry(null);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedInquiry) return;
    
    // Optimistic update
    const updatedInq = { ...selectedInquiry, status: newStatus };
    setSelectedInquiry(updatedInq);
    setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? updatedInq : i));
    
    await updateInquiryStatus(selectedInquiry.id, newStatus);
  };

  const handleAddNote = async () => {
    if (!selectedInquiry || !newNoteText.trim()) return;
    setIsAddingNote(true);
    
    const result = await addInquiryNote(selectedInquiry.id, newNoteText.trim());
    if (result.success && result.note) {
      const updatedNotes = [result.note, ...selectedInquiry.notes];
      const updatedInq = { ...selectedInquiry, notes: updatedNotes };
      
      setSelectedInquiry(updatedInq);
      setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? updatedInq : i));
      setNewNoteText("");
    }
    
    setIsAddingNote(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-brand-blue/10 text-brand-blue border-brand-blue/30';
      case 'Contacted': return 'bg-amber-400/10 text-amber-400 border-amber-400/30';
      case 'Interviewing': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Hired': return 'bg-brand-green/10 text-brand-green border-brand-green/30';
      case 'Passed': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-white/10 text-white border-white/30';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Recruiting CRM</h1>
        <p className="text-slate-400 mt-2">Manage leads submitted from the public website's "Meet with Delia" form.</p>
      </div>

      <Card className="shadow-2xl bg-white/5 border-white/10 backdrop-blur-xl rounded-[1.5rem] overflow-hidden">
        <CardHeader className="bg-white/5 border-b border-white/10">
          <CardTitle className="text-xl font-bold text-white">Prospect Pipeline</CardTitle>
          <CardDescription className="text-slate-400">Click on any prospect to view details, add notes, and update status.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="pl-6 w-[200px] text-slate-300 font-semibold">Prospect Name</TableHead>
                <TableHead className="text-slate-300 font-semibold">Contact Info</TableHead>
                <TableHead className="text-slate-300 font-semibold">Current Brokerage</TableHead>
                <TableHead className="text-slate-300 font-semibold">Date</TableHead>
                <TableHead className="text-slate-300 font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    No inquiries found.
                  </TableCell>
                </TableRow>
              )}
              {inquiries.map((inq) => (
                <TableRow 
                  key={inq.id} 
                  onClick={() => handleRowClick(inq)}
                  className="cursor-pointer border-white/10 hover:bg-white/5 transition-colors"
                >
                  <TableCell className="pl-6 font-semibold text-white">{inq.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1 text-sm">
                      <span className="flex items-center text-slate-300"><Mail className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> {inq.email}</span>
                      <span className="flex items-center text-slate-300"><Phone className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> {inq.phone || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center text-slate-300 text-sm">
                      <Building className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> {inq.currentBrokerage || 'None / New Agent'}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {new Date(inq.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(inq.status)}>
                      {inq.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Slide-out Drawer */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-ocean-dark h-full shadow-2xl border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 shrink-0">
              <h2 className="text-xl font-bold text-white">Prospect Details</h2>
              <Button variant="ghost" size="icon" onClick={handleClose} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Drawer Content (Scrollable) */}
            <div className="p-6 space-y-8 flex-1 overflow-y-auto">
              {/* Profile Overview */}
              <div>
                <h3 className="text-3xl font-bold text-white mb-1">{selectedInquiry.name}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-400 mt-3">
                  <span className="flex items-center"><Mail className="h-4 w-4 mr-1.5 text-brand-blue" /> {selectedInquiry.email}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400 mt-2">
                  <span className="flex items-center"><Phone className="h-4 w-4 mr-1.5 text-brand-blue" /> {selectedInquiry.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400 mt-2">
                  <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1.5 text-brand-blue" /> {selectedInquiry.currentBrokerage || 'None'}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400 mt-2">
                  <span className="flex items-center"><Clock className="h-4 w-4 mr-1.5 text-brand-blue" /> {new Date(selectedInquiry.submittedAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Pipeline Status</h4>
                <select 
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white appearance-none focus:outline-none focus:border-brand-blue transition-colors cursor-pointer"
                >
                  <option value="New" className="bg-slate-900">New</option>
                  <option value="Contacted" className="bg-slate-900">Contacted</option>
                  <option value="Interviewing" className="bg-slate-900">Interviewing</option>
                  <option value="Hired" className="bg-slate-900">Hired</option>
                  <option value="Passed" className="bg-slate-900">Passed</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Original Message</h4>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-slate-300 text-sm italic leading-relaxed">
                  "{selectedInquiry.message}"
                </div>
              </div>

              {/* Private Notes History */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Activity & Notes</h4>
                
                {/* Add Note Form */}
                <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-3">
                  <textarea 
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Jot down a quick note..."
                    className="w-full min-h-[80px] bg-transparent text-white placeholder-slate-500 focus:outline-none resize-none text-sm"
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      size="sm"
                      onClick={handleAddNote} 
                      disabled={isAddingNote || !newNoteText.trim()}
                      className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-lg"
                    >
                      {isAddingNote ? "Adding..." : "Add Note"} <Plus className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Notes Feed */}
                <div className="space-y-4">
                  {selectedInquiry.notes.length === 0 ? (
                    <p className="text-slate-500 text-sm italic text-center py-4">No notes yet.</p>
                  ) : (
                    selectedInquiry.notes.map((note) => (
                      <div key={note.id} className="relative pl-4 border-l-2 border-white/10 pb-4 last:pb-0">
                        <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-brand-blue" />
                        <p className="text-xs text-slate-400 mb-1">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {note.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
