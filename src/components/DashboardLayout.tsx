import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  Truck,
  Wrench,
  DollarSign,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { WhatsAppButton } from "./WhatsAppButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Package, label: "Estoque", path: "/estoque" },
    { icon: Truck, label: "Caminhões", path: "/caminhoes" },
    { icon: Wrench, label: "Produção", path: "/producao" },
    { icon: DollarSign, label: "Vendas", path: "/vendas" },
    { icon: FileText, label: "Relatórios", path: "/relatorios" },
    { icon: Users, label: "Administração", path: "/admin" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-card border-b border-border shadow-soft">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-foreground"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded gradient-forest flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">J</span>
              </div>
              <span className="font-display font-bold text-xl hidden sm:block">JMC Madeira</span>
            </Link>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-card border-r border-border shadow-soft z-30 transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent transition-base"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-16 lg:pl-64">
        <div className="p-6">{children}</div>
      </main>

      {/* WhatsApp Button */}
      <WhatsAppButton fixed />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
