import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-muted rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-white animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-4 space-y-1">

            {/* Info usuario */}
            {isAuthenticated && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">{user?.nombre} {user?.apellido}</p>
                  <p className="text-xs text-muted-foreground">{getRoleLabel(user?.rol as string)}</p>
                </div>
              </div>
            )}

            {/* Links públicos */}
            {baseLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block py-2.5 px-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Links admin */}
            {filteredAdminLinks.length > 0 && (
              <div className="pt-2 mt-2 border-t border-border space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 pb-1">
                  Administración
                </p>
                {filteredAdminLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-2 py-2.5 px-3 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Logout / Login */}
            <div className="pt-2 mt-2 border-t border-border">
              {isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="w-full mt-2 px-4 py-2.5 bg-destructive/10 text-destructive rounded-lg font-bold hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              ) : (
                <Link
                  to="/login"
                  className="w-full mt-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-700 transition-colors block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ingresar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}