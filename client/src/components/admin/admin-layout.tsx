import { Link } from "wouter";
import { useAuth } from "@/contexts/auth-context";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminLayout({ children, activeTab, onTabChange }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "fas fa-chart-bar" },
    { id: "appointments", label: "Citas", icon: "fas fa-calendar" },
    { id: "services", label: "Servicios", icon: "fas fa-spa" },
    { id: "gallery", label: "Galería", icon: "fas fa-images" },
    { id: "testimonials", label: "Testimonios", icon: "fas fa-comments" },
    { id: "messages", label: "Mensajes", icon: "fas fa-envelope" },
    { id: "promotions", label: "Promociones", icon: "fas fa-megaphone" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-spa-dark hover:text-spa-green transition-colors">
              <i className="fas fa-arrow-left mr-2"></i>
              Volver al Sitio
            </Link>
            <h1 className="font-playfair text-2xl font-bold text-spa-dark">
              Pureza<span className="text-spa-green">dePiel</span> Admin
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">¡Hola, {user?.username}!</span>
            <button 
              onClick={logout}
              className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
              data-testid="button-logout"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-spa-green text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    data-testid={`nav-${item.id}`}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
