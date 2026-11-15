import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  LayoutDashboard,
  ChartNoAxesCombined,
  BrainCircuit,
  Radio,
  Layers3,
  FlaskConical,
  History,
  Monitor,
  Plug,
  ShieldCheck,
  Settings2,
  ChevronRight,
  Bell,
  Search,
  Menu,
  LogIn,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "./workspace";
import { supabase } from "@/integrations/supabase/client";
export const navigation = [
  { name: "Overview", path: "/overview", icon: LayoutDashboard },
  { name: "Markets", path: "/markets", icon: ChartNoAxesCombined },
  { name: "Intelligence", path: "/intelligence", icon: BrainCircuit },
  { name: "Signals", path: "/signals", icon: Radio },
  { name: "Strategies", path: "/strategies", icon: Layers3 },
  { name: "Learning Lab", path: "/learning-lab", icon: FlaskConical },
  { name: "Backtesting", path: "/backtesting", icon: History },
  { name: "MT4 Simulator", path: "/mt4-simulator", icon: Monitor },
  { name: "MT5 Integration", path: "/mt5-integration", icon: Plug },
  { name: "Risk Management", path: "/risk-management", icon: ShieldCheck },
  { name: "Settings", path: "/settings", icon: Settings2 },
] as const;
export function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path
            d="M3 28 13 7h8l-9 21M17 28l7-14 9 14M15 21h12"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M25 6h7M29 3v7" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      <div>
        <div className="brand-name">
          AFI<span className="text-primary">.</span>
        </div>
        <div className="brand-sub">Adaptive Financial Intelligence</div>
      </div>
    </div>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
   const { user, profile, cache } = useWorkspace();
   const navigate = useNavigate();
   const [signingOut, setSigningOut] = useState(false);
  const [open, setOpen] = useState(false);
  const [clock, setClock] = useState("— UTC");
  useEffect(() => {
    const update = () =>
      setClock(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " UTC",
      );
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  const current = navigation.find((n) => n.path === pathname)?.name ?? "Research workspace";
  return (
    <div className="terminal">
      <aside className={`sidebar ${open ? "open" : ""}`}>
         <Link to="/" aria-label="AFI home"><Brand /></Link>
        <div className="nav-label">WORKSPACE</div>
        <nav className="nav-list">
          {navigation.slice(0, 5).map((n) => (
            <Link
              key={n.path}
              to={n.path}
              className={`nav-item ${pathname === n.path ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <n.icon />
              {n.name}
              {n.name === "Signals" && <span className="nav-tag">0</span>}
            </Link>
          ))}
        </nav>
        <div className="nav-label">RESEARCH & DEVELOPMENT</div>
        <nav className="nav-list">
          {navigation.slice(5, 9).map((n) => (
            <Link
              key={n.path}
              to={n.path}
              className={`nav-item ${pathname === n.path ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <n.icon />
              {n.name}
              {n.name === "MT5 Integration" && <span className="nav-tag">SOON</span>}
            </Link>
          ))}
        </nav>
        <div className="nav-label">SYSTEM</div>
        <nav className="nav-list">
          {navigation.slice(9).map((n) => (
            <Link
              key={n.path}
              to={n.path}
              className={`nav-item ${pathname === n.path ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <n.icon />
              {n.name}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="mode-note">
            <strong>
              <ShieldCheck size={13} /> SIGNALS-ONLY MODE
            </strong>
            Research. Observe. Adapt.
            <br />
            Live trade execution is disabled.
          </div>
          <div className="user-row">
             <div className="avatar">{(profile.data?.display_name || "A").slice(0, 1).toUpperCase()}</div>
            <div className="min-w-0 flex-1">
               <div className="text-[11px]">{user ? <Link to="/account">{profile.data?.display_name || "My account"}</Link> : "Research workspace"}</div>
              <div className="mini-sub">{user ? "Authenticated" : "Not signed in"}</div>
            </div>
            {user ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sign out"
                title="Sign out"
                 disabled={signingOut}
                 onClick={async () => {
                   setSigningOut(true);
                   await cache.cancelQueries();
                   cache.clear();
                   const { error } = await supabase.auth.signOut();
                   setSigningOut(false);
                   if (!error) await navigate({ to: "/auth", replace: true });
                 }}
              >
                <LogOut />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/auth" aria-label="Sign in" title="Sign in">
                  <LogIn />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <Button
              className="mobile-menu"
              variant="ghost"
              size="icon"
              aria-label="Toggle navigation"
              onClick={() => setOpen(!open)}
            >
              <Menu />
            </Button>
            <div className="breadcrumb">
              <span className="topbar-label">Workspace</span>
              <ChevronRight size={12} className="text-muted-foreground" />
              <span className="text-[11px]">{current}</span>
            </div>
          </div>
          <div className="topbar-right">
            <span className="utc-clock font-mono text-[10px] text-muted-foreground">{clock}</span>
            <div className="top-divider" />
            <span className="status-pill gold">
              <ShieldCheck size={11} /> SIGNALS ONLY
            </span>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/markets" aria-label="Search markets" title="Search markets">
                <Search />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/signals" aria-label="Signal notifications" title="Signal notifications">
                <Bell />
              </Link>
            </Button>
          </div>
        </header>
        <main className="content">
          {children}
          <footer className="footer">
            <span>
              AFI <span className="mx-2">·</span> Intelligence for Better Investment Decisions.
            </span>
            <span>
              <ShieldCheck size={11} /> Intelligence, not investment advice{" "}
              <ArrowUpRight size={10} />
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
export function PageTitle({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-title-row">
      <div>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
      <div className="page-actions">{children}</div>
    </div>
  );
}
export function ConnectionStrip() {
  const { connection, health } = useWorkspace();
  return (
    <div className="health-strip">
      <div className="health-item">
        <Activity size={12} />
        <span>System</span>
        <span>Observation mode</span>
      </div>
      <div className="health-item">
        <i className="status-dot" />
        <span>Market feed</span>
        <span>Not connected</span>
      </div>
      <div className="health-item">
        <i className={`status-dot ${health.data?.status === "connected" ? "connected" : ""}`} />
        <span>ML engine</span>
        <span>{health.data?.message ?? "Checking"}</span>
      </div>
      <div className="health-item">
        <i className={`status-dot ${connection.data ? "connected" : ""}`} />
        <span>Database</span>
        <span>
          {connection.data === undefined
            ? "Checking"
            : connection.data
              ? "Connected"
              : "Unavailable"}
        </span>
      </div>
      <div className="health-item end">
        <span>Active model</span>
        <span className="font-mono">—</span>
      </div>
    </div>
  );
}
