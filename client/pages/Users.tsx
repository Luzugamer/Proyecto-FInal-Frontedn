import {
  Shield,
  UserPlus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const mockUsersList = [
  {
    id: 1,
    name: "Carlos Super",
    email: "super@siged.test",
    rol: "SUPER_ADMIN",
    estado: "activo",
  },
  {
    id: 2,
    name: "Ana María Rodríguez",
    email: "admin@siged.test",
    rol: "ADMINISTRADOR",
    estado: "activo",
  },
  {
    id: 3,
    name: "Pedro Martínez",
    email: "comite@siged.test",
    rol: "COMITE_ORGANIZADOR",
    estado: "activo",
  },
  {
    id: 4,
    name: "Luis Fernández",
    email: "delegado.agronomia@siged.test",
    rol: "DELEGADO_DEPORTES",
    estado: "activo",
  },
];

export default function UsersPage() {
  const { user } = useAuth();
  const canCreateAdmin = user?.rol === "SUPER_ADMIN";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Shield className="w-10 h-10 text-primary" />
            Gestión de Usuarios
          </h1>
          <p className="text-lg text-muted-foreground">
            Administra los accesos y roles del sistema SIGED
          </p>
        </div>

        <div className="flex gap-3">
          {canCreateAdmin && (
            <Button className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Crear Administrador
            </Button>
          )}
          <Button variant="outline" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Crear Comité/Delegado
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Buscar por nombre o email..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-xs uppercase font-bold text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {mockUsersList.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">
                        {u.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {u.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.rol === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : u.rol === "ADMINISTRADOR"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.rol.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      {u.estado}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
