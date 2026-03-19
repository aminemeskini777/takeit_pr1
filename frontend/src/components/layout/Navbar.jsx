import { Bell, Menu, UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";

export default function Header({ title, notificationsPath }) {
  const { user } = useAuth();
  const profileName =
    user?.name ||
    user?.full_name ||
    user?.username ||
    user?.prenom ||
    user?.first_name ||
    user?.email ||
    "Profile";

  const safeNotificationsPath = notificationsPath || "/notifications";

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-slate-200 text-slate-600 hover:bg-slate-50"
            aria-label="menu"
          >
            <Menu size={18} />
          </Button>

          <div className="flex flex-col leading-tight">
            <h1 className="text-base font-semibold text-slate-900 md:text-lg">{title}</h1>
            <span className="hidden text-xs text-slate-500 md:block">
              Tableau de pilotage manager
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="relative h-9 w-9 border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <Link to={safeNotificationsPath} aria-label="notifications">
              <Bell size={18} />
              <span className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                3
              </span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-9 gap-2 rounded-full border-slate-200 bg-gradient-to-r from-orange-50 to-amber-50 text-slate-700 hover:bg-orange-100"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">
              <UserCircle2 size={18} />
            </span>
            <span className="hidden text-sm font-medium sm:block">{profileName}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

