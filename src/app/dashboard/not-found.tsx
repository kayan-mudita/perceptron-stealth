import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center max-w-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/10">
          <span className="text-2xl font-bold text-purple-400">404</span>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-white">Page not found</h2>
        <p className="mb-6 text-sm text-gray-400">
          The page you are looking for does not exist or has been moved. Please check the URL or
          navigate back to the dashboard.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
