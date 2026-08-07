import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

function DashboardLayout({ children }) {
  const location = useLocation();
  const isAICoach = location.pathname === "/ai-coach";

  if (isAICoach) {
    return (
      <div className="h-screen w-screen bg-[#ede9e0] lg:flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 lg:flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
