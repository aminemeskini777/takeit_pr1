import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function EmployeePage({ title, children }) {
  return (
    <div className="flex">
      <Sidebar role="employee" />
      <div className="flex-1 min-h-screen bg-slate-50">
        <Navbar title={title} />
        <div className="space-y-6 p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}