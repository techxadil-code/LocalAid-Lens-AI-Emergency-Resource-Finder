import { DashboardFeed } from "@/components/dashboard-feed";
import { NavBar } from "@/components/nav-bar";

export const metadata = {
  title: "Dashboard | Offbeat — Emergency Response",
  description: "Real-time volunteer dashboard for emergency response coordination. View, verify, and act on emergency requests.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Emergency Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time feed of emergency requests. Take charge and help save lives.
          </p>
        </div>
        <DashboardFeed />
      </main>
    </div>
  );
}
