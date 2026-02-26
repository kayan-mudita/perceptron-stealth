import SessionProvider from "@/components/SessionProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <TopBar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
