import AgentClientLayout from "./AgentClientLayout";

export const dynamic = 'force-dynamic';

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return <AgentClientLayout>{children}</AgentClientLayout>;
}
