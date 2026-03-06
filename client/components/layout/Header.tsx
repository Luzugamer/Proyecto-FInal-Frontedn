import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  ShieldCheck,
  Home,
  Trophy,
  Newspaper,
  Calendar,
  Users as UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const baseLinks = [
    { label: "Inicio", href: "/", icon: Home },
    { label: "Torneos", href: "/torneos", icon: Trophy },
    { label: "Noticias", href: "/noticias", icon: Newspaper },
    { label: "Calendario", href: "/calendario", icon: Calendar },
  ];

  const adminLinks = [
    {
      label: "Usuarios",
      href: "/dashboard/usuarios",
      roles: ["SUPER_ADMIN", "ADMINISTRADOR"],
      permission: "usuarios.ver",
      icon: UsersIcon,
    },
    {
      label: "Noticias",
      href: "/dashboard/admin/noticias",
      roles: ["SUPER_ADMIN", "ADMINISTRADOR", "COMITE_ORGANIZADOR"],
      permission: "portal.gestionar",
      icon: Newspaper,
    },
    {
      label: "Configuración",
      href: "/dashboard/configuracion",
      roles: ["SUPER_ADMIN"],
      permission: "configuracion.acceder",
      icon: Settings,
    },
  ];

  const filteredAdminLinks = adminLinks.filter((link) => {
    if (link.roles && !link.roles.includes(user?.rol as string)) return false;
    if (link.permission && !hasPermission(link.permission)) return false;
    return true;
  });

  const allLinks = [...baseLinks];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "ADMINISTRADOR":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "COMITE_ORGANIZADOR":
        return "bg-green-100 text-green-700 border-green-200";
      case "DELEGADO_DEPORTES":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleLabel = (rol: string) => {
    return rol.replace("_", " ");
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md bg-white">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 font-bold text-lg text-primary hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <span className="hidden sm:inline font-montserrat">SIGED</span>
        </Link>

        {/* Desktop Navigation - Región Común y Continuidad */}
        <div className="hidden md:flex items-center gap-1">
          {/* Regular Links - Proximidad */}
          <div className="flex items-center gap-1 px-2">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Separator - Conectividad */}
          {filteredAdminLinks.length > 0 && (
            <div className="w-1 h-6 bg-gradient-to-b from-transparent via-border to-transparent mx-2"></div>
          )}

          {/* Admin Links - Similitud visual */}
          {filteredAdminLinks.length > 0 && (
            <div className="flex items-center gap-1 px-2">
              {filteredAdminLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-2 text-sm font-semibold text-primary hover:text-primary-700 hover:bg-primary/10 rounded-lg transition-all duration-200 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* User Actions - Región Común */}
        <div className="hidden md:flex items-center gap-3 pl-3 border-l-2 border-border">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* User Info - Proximidad y Similitud */}
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold leading-tight text-foreground">
                  {user?.nombre}
                </p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  {user?.facultad && (
                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
                      {user.facultad.codigo}
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide",
                      getRoleBadgeColor(user?.rol as string),
                    )}
                  >
                    {getRoleLabel(user?.rol as string)}
                  </span>
                </div>
              </div>

              {/* User Menu - Similitud y Conectividad */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 p-0 overflow-hidden border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <User className="h-6 w-6 text-primary font-bold" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer rounded-lg m-1 px-4 py-3 flex items-center gap-3 font-semibold"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-700 transition-colors inline-block"
            >
              Ingresar
            </Link>
          )}
        </div>

        {/* Mobile/Tablet User Avatar */}
        <div className="md:hidden flex items-center">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 p-0 overflow-hidden border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <User className="h-5 w-5 text-primary font-bold" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg">
                <DropdownMenuLabel className="font-bold">
                  {user?.nombre} {user?.apellido}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer rounded-lg m-1 px-4 py-3 flex items-center gap-3 font-semibold"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm"
            >
              Ingresar
            </Link>
          )}
        </div>
      </nav>

      {/* Bottom Navigation Bar - Mobile & Tablet Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-50">
        <nav className="flex items-center justify-around px-2 py-3">
          {baseLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "scale-110")} />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            );
          })}
          
          {/* Admin Menu Icon for authorized users */}
          {filteredAdminLinks.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all duration-200",
                    "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <LayoutDashboard className="w-6 h-6" />
                  <span className="text-xs font-medium">Admin</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg mb-2">
                {filteredAdminLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link
                        to={link.href}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
}
