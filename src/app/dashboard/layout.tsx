import SessionProvider from "@/components/SessionProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import OnboardingBanner from "@/components/dashboard/OnboardingBanner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        {/* Desktop: offset for sidebar. Mobile: full width with bottom padding for nav */}
        <div className="flex-1 lg:ml-64">
          <TopBar />
          {/* Item 8: Persistent onboarding banner if setup is incomplete */}
          <OnboardingBanner />
          <main className="p-4 sm:p-6 pb-24 lg:pb-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
