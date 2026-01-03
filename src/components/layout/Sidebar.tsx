import { 
  LayoutDashboard, 
  Plane, 
  Calendar, 
  TrendingUp, 
  CloudRain, 
  Bell, 
  Settings,
  LogOut,
  Car
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "vuelos", label: "Vuelos BCN", icon: Plane },
  { id: "eventos", label: "Eventos", icon: Calendar },
  { id: "licencias", label: "Licencias", icon: TrendingUp },
  { id: "alertas", label: "Alertas", icon: Bell },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-secondary text-secondary-foreground">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-secondary-foreground/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-primary">TaxiBCN</h1>
            <p className="text-xs text-secondary-foreground/60">Panel del Taxista</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "nav-link w-full",
                activeTab === item.id && "nav-link-active"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-secondary-foreground/10 p-3">
          <button className="nav-link w-full">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Configuración</span>
          </button>
          <button className="nav-link w-full text-destructive hover:text-destructive">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
