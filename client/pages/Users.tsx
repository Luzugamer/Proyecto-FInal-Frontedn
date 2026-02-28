import {
  Shield,
  UserPlus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

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
  const canCreateCommittee =
    user?.rol === "SUPER_ADMIN" || user?.rol === "ADMINISTRADOR";

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showCommitteeModal, setShowCommitteeModal] = useState(false);
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [adminForm, setAdminForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  const [committeeForm, setCommitteeForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    puesto: "",
  });
  const [delegateForm, setDelegateForm] = useState({
    nombre: "",
    email: "",
    facultad: "",
  });

  const handleCreateAdmin = () => {
    console.log("Crear Administrador:", adminForm);
    setAdminForm({ nombre: "", email: "", telefono: "" });
    setShowAdminModal(false);
  };

  const handleCreateCommittee = () => {
    console.log("Crear Miembro Comité:", committeeForm);
    setCommitteeForm({
      nombre: "",
      email: "",
      telefono: "",
      puesto: "",
    });
    setShowCommitteeModal(false);
  };

  const handleCreateDelegate = () => {
    console.log("Crear Delegado Deportes:", delegateForm);
    setDelegateForm({
      nombre: "",
      email: "",
      facultad: "",
    });
    setShowDelegateModal(false);
  };

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

        <div className="flex flex-col sm:flex-row gap-3">
          {canCreateAdmin && (
            <Dialog open={showAdminModal} onOpenChange={setShowAdminModal}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Crear Administrador
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Administrador</DialogTitle>
                  <DialogDescription>
                    Agrega un nuevo administrador al sistema con permisos para
                    gestionar usuarios y configuración.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-nombre">Nombre Completo</Label>
                    <Input
                      id="admin-nombre"
                      placeholder="Ej: Juan Pérez"
                      value={adminForm.nombre}
                      onChange={(e) =>
                        setAdminForm({
                          ...adminForm,
                          nombre: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="Ej: juan@siged.test"
                      value={adminForm.email}
                      onChange={(e) =>
                        setAdminForm({
                          ...adminForm,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-telefono">Teléfono</Label>
                    <Input
                      id="admin-telefono"
                      placeholder="Ej: +51 987 654 321"
                      value={adminForm.telefono}
                      onChange={(e) =>
                        setAdminForm({
                          ...adminForm,
                          telefono: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowAdminModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateAdmin}>
                    Crear Administrador
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {canCreateCommittee && (
            <Dialog
              open={showCommitteeModal}
              onOpenChange={setShowCommitteeModal}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Crear Comité
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Agregar Miembro al Comité</DialogTitle>
                  <DialogDescription>
                    Agrega un nuevo miembro del comité organizador. El comité puede tener
                    múltiples miembros con diferentes puestos.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="committee-nombre">Nombre Completo</Label>
                    <Input
                      id="committee-nombre"
                      placeholder="Ej: María García"
                      value={committeeForm.nombre}
                      onChange={(e) =>
                        setCommitteeForm({
                          ...committeeForm,
                          nombre: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="committee-email">Email</Label>
                    <Input
                      id="committee-email"
                      type="email"
                      placeholder="Ej: maria@siged.test"
                      value={committeeForm.email}
                      onChange={(e) =>
                        setCommitteeForm({
                          ...committeeForm,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="committee-puesto">Puesto en el Comité</Label>
                    <select
                      id="committee-puesto"
                      value={committeeForm.puesto}
                      onChange={(e) =>
                        setCommitteeForm({
                          ...committeeForm,
                          puesto: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Seleccionar puesto...</option>
                      <option value="presidente">Presidente</option>
                      <option value="vicepresidente">Vicepresidente</option>
                      <option value="secretario">Secretario</option>
                      <option value="tesorero">Tesorero</option>
                      <option value="miembro">Miembro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="committee-telefono">Teléfono</Label>
                    <Input
                      id="committee-telefono"
                      placeholder="Ej: +51 987 654 321"
                      value={committeeForm.telefono}
                      onChange={(e) =>
                        setCommitteeForm({
                          ...committeeForm,
                          telefono: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowCommitteeModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateCommittee}>
                    Agregar al Comité
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {canCreateCommittee && (
            <Dialog
              open={showDelegateModal}
              onOpenChange={setShowDelegateModal}
            >
              <DialogTrigger asChild>
                <Button variant="secondary" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Crear Delegado
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Crear Delegado Deportivo</DialogTitle>
                  <DialogDescription>
                    Agrega un delegado deportivo de una facultad específica. Cada
                    delegado es responsable de los aspectos deportivos de su facultad.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="delegate-nombre">Nombre Completo</Label>
                    <Input
                      id="delegate-nombre"
                      placeholder="Ej: Carlos López"
                      value={delegateForm.nombre}
                      onChange={(e) =>
                        setDelegateForm({
                          ...delegateForm,
                          nombre: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delegate-email">Email</Label>
                    <Input
                      id="delegate-email"
                      type="email"
                      placeholder="Ej: carlos@siged.test"
                      value={delegateForm.email}
                      onChange={(e) =>
                        setDelegateForm({
                          ...delegateForm,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delegate-facultad">Facultad</Label>
                    <select
                      id="delegate-facultad"
                      value={delegateForm.facultad}
                      onChange={(e) =>
                        setDelegateForm({
                          ...delegateForm,
                          facultad: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Seleccionar facultad...</option>
                      <option value="Agronomía">Agronomía</option>
                      <option value="Zootecnia">Zootecnia</option>
                      <option value="Ingeniería">Ingeniería</option>
                      <option value="Enfermería">Enfermería</option>
                      <option value="Economía">Ciencias Económicas</option>
                      <option value="Recursos Naturales">Recursos Naturales</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowDelegateModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateDelegate}>
                    Crear Delegado
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
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
