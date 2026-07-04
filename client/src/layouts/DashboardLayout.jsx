import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 lg:flex">
      <Sidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;
