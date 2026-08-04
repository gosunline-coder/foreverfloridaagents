import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AddAdminModal } from "./AddAdminModal";
import { AdminRosterClient } from "./AdminRosterClient";
import { getAdmins } from "@/app/actions/management";

export const dynamic = 'force-dynamic';

export default async function AdminManagementPage() {
  const admins = await getAdmins();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Admins</h1>
          <p className="text-muted-foreground mt-2">Add and oversee administrative accounts for the portal.</p>
        </div>
        <AddAdminModal />
      </div>

      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle>Administrative Roster</CardTitle>
          <CardDescription>Current administrators with access to this portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminRosterClient admins={admins} />
        </CardContent>
      </Card>
    </div>
  );
}
