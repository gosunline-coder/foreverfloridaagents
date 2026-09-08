const fs = require('fs');

const filePath = 'src/app/(admin)/admin/AgentRosterClient.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Imports
content = content.replace(
  'import { deleteAgent, verifyAgentLicense, updateAgentBasicInfo } from "@/app/actions/admin";',
  'import { archiveAgent, verifyAgentLicense, updateAgentBasicInfo } from "@/app/actions/admin";'
);

// 2. handleDeleteAgent -> handleArchiveAgent
content = content.replace(
  'const handleDeleteAgent = async (agentId: string) => {',
  'const handleArchiveAgent = async (agentId: string) => {'
);
content = content.replace(
  'const res = await deleteAgent(agentId);',
  'const res = await archiveAgent(agentId);'
);
content = content.replace(
  'alert(res.error || "Failed to delete agent");',
  'alert(res.error || "Failed to archive agent");'
);

// 3. Add toggle state
content = content.replace(
  'const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null);',
  'const [showArchived, setShowArchived] = useState(false);\n  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null);'
);

// 4. Update table header to include toggle
const oldHeader = `<CardHeader className="bg-muted border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg text-foreground">Agent Onboarding & Roster</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">Track onboarding progress and license numbers. Click any row for details.</CardDescription>
        </CardHeader>`;
const newHeader = `<CardHeader className="bg-muted border-b border-border flex flex-row items-center justify-between pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-blue" />
              <CardTitle className="text-lg text-foreground">Agent Onboarding & Roster</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground mt-1">Track onboarding progress and license numbers. Click any row for details.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
              Show Archived
            </label>
          </div>
        </CardHeader>`;
content = content.replace(oldHeader, newHeader);

// 5. Replace agents.map with visibleAgents.map
content = content.replace(
  '{agents.map((agent) => {',
  '{agents.filter(a => showArchived ? true : a.status !== "Departed").map((agent) => {'
);

// 6. Add "Departed" color
content = content.replace(
  'case "Invited": default: return "bg-cyan-400/10 text-cyan-400 border-cyan-400/30";',
  'case "Departed": return "bg-slate-400/10 text-slate-400 border-slate-400/30";\n      case "Invited": default: return "bg-cyan-400/10 text-cyan-400 border-cyan-400/30";'
);

// 7. Hide admin and delete sections for Departed agents, rename Delete to Archive
const deleteSectionRegex = /\{\/\* Admin Privileges Section \*\/\}([\s\S]*?)\{\/\* Delete Agent Section \*\/\}([\s\S]*?)<\/CardContent>/;

const replacementSections = `{/* Admin Privileges Section */}
              {selectedAgent.status !== "Departed" && (
              <div className="pt-6 mt-6 border-t border-border flex flex-col items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-brand-blue" /> Administrative Privileges
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Grant this user access to the Admin Portal to manage other agents and inventory.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-muted/50 p-4 rounded-lg border border-border w-full sm:justify-between overflow-hidden">
                  <div className="w-full sm:w-auto">
                    <p className="font-medium text-foreground">Admin Access</p>
                    <p className="text-xs text-muted-foreground">
                      Currently: {selectedAgent.role === 'admin' || selectedAgent.role === 'superadmin' ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <Button 
                    variant={selectedAgent.role === 'admin' || selectedAgent.role === 'superadmin' ? 'destructive' : 'default'} 
                    size="sm"
                    onClick={handleToggleAdmin}
                    disabled={isTogglingAdmin || selectedAgent.role === 'superadmin'}
                    className={\`w-full sm:w-auto shrink-0 \${selectedAgent.role === 'agent' ? "bg-brand-blue hover:bg-brand-blue/90" : ""}\`}
                  >
                    {isTogglingAdmin ? "Updating..." : (selectedAgent.role === 'admin' || selectedAgent.role === 'superadmin' ? "Revoke Access" : "Make Admin")}
                  </Button>
                </div>
              </div>
              )}

              {/* Archive Agent Section */}
              {selectedAgent.status !== "Departed" && (
              <div className="pt-6 mt-6 border-t border-red-100 flex flex-col items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-red-600 flex items-center gap-2">
                    <Trash2 className="h-4 w-4" /> Archive Agent
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Archiving an agent will mark them as departed and revoke their access. Their records will be retained.
                  </p>
                </div>
                
                <Button variant="destructive" disabled={isPending} onClick={() => setIsDeleteDialogOpen(true)}>
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                  {isPending ? "Archiving..." : "Archive Agent"}
                </Button>

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Archive Agent</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to archive <strong>{selectedAgent.name}</strong>? They will immediately lose access to the portal, but their historical records will be preserved.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isPending}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={() => handleArchiveAgent(selectedAgent.id)} disabled={isPending}>
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {isPending ? "Archiving..." : "Yes, archive agent"}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              )}
            </CardContent>`;

content = content.replace(deleteSectionRegex, replacementSections);

// Hide Edit button for Departed agents
content = content.replace(
  '<Button \n                          variant="ghost" \n                          size="icon" \n                          className="h-6 w-6 rounded-full hover:bg-muted-foreground/10"\n                          title="Edit Profile"\n                          onClick={() => {',
  '{selectedAgent.status !== "Departed" && (<Button \n                          variant="ghost" \n                          size="icon" \n                          className="h-6 w-6 rounded-full hover:bg-muted-foreground/10"\n                          title="Edit Profile"\n                          onClick={() => {'
);
content = content.replace(
  '<Edit2 className="h-3 w-3 text-muted-foreground" />\n                        </Button>',
  '<Edit2 className="h-3 w-3 text-muted-foreground" />\n                        </Button>)}'
);

fs.writeFileSync(filePath, content);
console.log("Updated AgentRosterClient.tsx");
