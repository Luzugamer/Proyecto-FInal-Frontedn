import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function Header() {
  const { user, isAuthenticated, logout, hasPermission } = useAuth();
  const navigate = useNavigate();

  const baseLinks = [
    { label: "Inicio",     href: "/" },
    { label: "Torneos",    href: "/torneos" },
    { label: "Noticias",   href: "/noticias" },
    { label: "Calendario", href: "/calendario" },
  ];

  // ── Los admin links solo se filtran por ROLES, no por permission,
  //    porque el permission puede no estar asignado a todos los roles permitidos.
  const adminLinks = [
    {
      label: "Usuarios",
      href: "/dashboard/usuarios",
      roles: ["SUPER_ADMIN", "ADMINISTRADOR"],
    },
    {
      label: "Noticias",
      href: "/dashboard/admin/noticias",
      roles: ["SUPER_ADMIN", "ADMINISTRADOR", "COMITE_ORGANIZADOR"],
    },
  ];

  const filteredAdminLinks = adminLinks.filter((link) => {
    return link.roles.includes(user?.rol as string);
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case "SUPER_ADMIN":        return "bg-purple-100 text-purple-700 border-purple-200";
      case "ADMINISTRADOR":      return "bg-blue-100 text-blue-700 border-blue-200";
      case "COMITE_ORGANIZADOR": return "bg-green-100 text-green-700 border-green-200";
      case "DELEGADO_DEPORTES":  return "bg-orange-100 text-orange-700 border-orange-200";
      default:                   return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleLabel = (rol: string) => rol.replace(/_/g, " ");

  return (
    <header className="sticky top-0 z-50 w-full shadow-md bg-white">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 font-bold text-lg text-primary hover:opacity-80 transition-opacity"
        >
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {/* Links públicos */}
          <div className="flex items-center gap-1 px-2">
            {baseLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Separador */}
          {filteredAdminLinks.length > 0 && (
            <div className="w-px h-6 bg-border mx-2" />
          )}

          {/* Links de administración */}
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

        {/* User Actions */}
        <div className="hidden md:flex items-center gap-3 pl-3 border-l-2 border-border">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold leading-tight text-foreground">{user?.nombre}</p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  {user?.facultad && (
                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
                      {user.facultad.codigo}
                    </span>
                  )}
                  <span className={cn(
                    "text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border",
                    getRoleBadgeColor(user?.rol as string),
                  )}>
                    {getRoleLabel(user?.rol as string)}
                  </span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 p-0 overflow-hidden border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <User className="h-6 w-6 text-primary" />
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
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Ingresar
            </Link>
          )}
        </div>

        {/* Mobile User Actions - Solo icono de usuario o login */}
        <div className="md:hidden flex items-center">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-muted rounded-lg">
                  <User className="w-6 h-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2 border-b border-border">
                  <p className="font-medium text-sm">{user?.nombre} {user?.apellido}</p>
                  <span
                    className={cn(
                      "inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded border",
                      getRoleBadgeColor(user?.rol as string)
                    )}
                  >
                    {getRoleLabel(user?.rol as string)}
                  </span>
                </div>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
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

      {/* Mobile Navigation - REMOVED, now using BottomNav component at bottom */}
    </header>
  );
}