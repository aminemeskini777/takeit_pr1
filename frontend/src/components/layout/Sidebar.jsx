/* eslint-disable no-unused-vars */
import {
  Award,
  BarChart3,
  Briefcase,
  ClipboardList,
  Gauge,
  LogOut,
  Settings,
  Shield,
  Users,
  UserRound,
  PlusCircle,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "@/lib/utils";

const employeeItems = [
  ["Dashboard", "/dashboard", Gauge],
  ["Vue unifiee taches", "/tasks", ClipboardList],
  ["Mes badges", "/badges", Award],
  ["Mon profil", "/profile", UserRound],
];

const managerItems = [
  ["Dashboard equipe", "/manager/dashboard", Gauge],
  ["Vue unifiee taches", "/manager/tasks", ClipboardList],
  ["Gestion Taches", "/manager/tasks/create", PlusCircle],
  ["Gestion Badges", "/manager/badges", Award],
  ["Gestion Utilisateurs", "/manager/users", Users],
  ["Configuration JIRA", "/manager/jira", Shield],
  ["Rapports", "/manager/reports", BarChart3],
  ["Equipes", "/manager/teams", Briefcase],
];

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const links = role === "manager" ? managerItems : employeeItems;

  async function onLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5">
      <div className="flex h-full flex-col justify-between">
      <div>
        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-orange-600">
            <Shield size={18} />
            <span className="text-lg font-bold tracking-tight">TAKEIT</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Workspace management</p>
        </div>

        <div className="mb-3 px-2 text-xs uppercase tracking-wider text-slate-400">
          {role === "manager" ? "Manager" : "Employe"}
        </div>

        <nav className="space-y-1.5">
         
          {links.map(([label, to, Icon]) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-orange-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                )}
              >
                <Icon
                  size={18}
                  className={cn("transition-colors", active ? "text-white" : "text-slate-500 group-hover:text-slate-700")}
                />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1.5 border-t border-slate-200 pt-4">
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-700"
        >
          <Settings size={18} />
          Parametres
        </Link>

        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut size={18} />
          Deconnexion
        </button>
      </div>
      </div>
    </aside>
  );
}


