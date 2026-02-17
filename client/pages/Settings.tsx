import { useState } from "react";
import {
  Settings as SettingsIcon,
  Globe,
  Mail,
  Shield,
  Save,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.rol === "SUPER_ADMIN";

  const [roles, setRoles] = useState([
    {
      id: 1,
      nombre: "SUPER_ADMIN",
      descripcion: "Administrador del sistema con acceso total",
      permisos: ["usuarios.ver", "usuarios.crear", "usuarios.editar", "usuarios.eliminar", "configuracion.acceder", "roles.gestionar"],
    },
    {
      id: 2,
      nombre: "ADMINISTRADOR",
      descripcion: "Administrador de eventos y usuarios",
      permisos: ["usuarios.ver", "usuarios.crear", "usuarios.editar", "configuracion.acceder"],
    },
    {
      id: 3,
      nombre: "COMITE_ORGANIZADOR",
      descripcion: "Organiza y gestiona torneos",
      permisos: ["torneos.gestionar", "partidos.gestionar", "noticias.crear"],
    },
    {
      id: 4,
      nombre: "DELEGADO_DEPORTES",
      descripcion: "Gestiona aspectos deportivos de su facultad",
      permisos: ["torneos.ver", "partidos.ver", "equipo.gestionar"],
    },
  ]);

  const [newRole, setNewRole] = useState({
    nombre: "",
    descripcion: "",
  });

  const [editingRole, setEditingRole] = useState<number | null>(null);

  const handleAddRole = () => {
    if (newRole.nombre.trim()) {
      setRoles([
        ...roles,
        {
          id: Math.max(...roles.map(r => r.id)) + 1,
          nombre: newRole.nombre,
          descripcion: newRole.descripcion,
          permisos: [],
        },
      ]);
      setNewRole({ nombre: "", descripcion: "" });
    }
  };

  const handleDeleteRole = (id: number) => {
    if (roles.length > 1) {
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
          <SettingsIcon className="w-10 h-10 text-primary" />
          Configuración del Sistema
        </h1>
        <p className="text-lg text-muted-foreground">
          Configuración crítica y personalización global del SIGED
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="bg-muted p-1 rounded-xl">
          <TabsTrigger
            value="general"
            className="flex items-center gap-2 rounded-lg"
          >
            <Globe className="w-4 h-4" /> General
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="flex items-center gap-2 rounded-lg"
          >
            <Mail className="w-4 h-4" /> Emails
          </TabsTrigger>
          {isSuperAdmin && (
            <TabsTrigger
              value="roles"
              className="flex items-center gap-2 rounded-lg"
            >
              <Shield className="w-4 h-4" /> Roles
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>
                Ajustes regionales y básicos del sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="systemName">Nombre del Sistema</Label>
                  <Input id="systemName" defaultValue="SIGED UNAS" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Input
                    id="timezone"
                    defaultValue="America/Lima (UTC-05:00)"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
                <div className="space-y-0.5">
                  <Label>Modo Mantenimiento</Label>
                  <p className="text-sm text-muted-foreground">
                    Desactiva el acceso público al sistema.
                  </p>
                </div>
                <Switch />
              </div>
              <Button className="flex items-center gap-2">
                <Save className="w-4 h-4" /> Guardar Cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Email</CardTitle>
              <CardDescription>
                Configura los correos automáticos enviados por el sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">
                Sección de gestión de plantillas (Simulada)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {isSuperAdmin && (
          <TabsContent value="roles">
            <div className="space-y-8">
              {/* Crear Nuevo Rol */}
              <Card>
                <CardHeader>
                  <CardTitle>Crear Nuevo Rol</CardTitle>
                  <CardDescription>
                    Define un nuevo rol con permisos específicos para el sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="roleName">Nombre del Rol</Label>
                      <Input
                        id="roleName"
                        placeholder="ej: COMITE_TECNICO"
                        value={newRole.nombre}
                        onChange={(e) =>
                          setNewRole({ ...newRole, nombre: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roleDescription">Descripción</Label>
                      <Input
                        id="roleDescription"
                        placeholder="ej: Encargado del control técnico"
                        value={newRole.descripcion}
                        onChange={(e) =>
                          setNewRole({
                            ...newRole,
                            descripcion: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddRole}
                    className="flex items-center gap-2 w-full md:w-auto"
                  >
                    <Plus className="w-4 h-4" /> Crear Rol
                  </Button>
                </CardContent>
              </Card>

              {/* Listado de Roles */}
              <Card>
                <CardHeader>
                  <CardTitle>Roles del Sistema</CardTitle>
                  <CardDescription>
                    Gestiona los roles disponibles y sus permisos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className="p-6 border rounded-xl bg-gradient-to-br from-primary-50 to-white hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-foreground">
                                {role.nombre}
                              </h3>
                              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                                {role.permisos.length} permisos
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {role.descripcion}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {role.permisos.slice(0, 3).map((permiso, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded font-medium"
                                >
                                  {permiso}
                                </span>
                              ))}
                              {role.permisos.length > 3 && (
                                <span className="px-2 py-1 text-xs text-muted-foreground">
                                  +{role.permisos.length - 3} más
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                              onClick={() => setEditingRole(role.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {roles.length > 1 && (
                              <button
                                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                                onClick={() => handleDeleteRole(role.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
