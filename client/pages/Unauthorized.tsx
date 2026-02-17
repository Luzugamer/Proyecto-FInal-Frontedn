import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-destructive/10 p-6 rounded-full mb-6">
        <ShieldAlert className="w-16 h-16 text-destructive" />
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-2">
        Acceso Denegado
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        No tienes los permisos necesarios para acceder a esta sección. Si crees
        que esto es un error, contacta al administrador del sistema.
      </p>

      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Link>
        </Button>
        <Button asChild>
          <Link to="/login">Iniciar Sesión con otra cuenta</Link>
        </Button>
      </div>
    </div>
  );
}
