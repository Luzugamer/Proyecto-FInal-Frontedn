import { useState } from "react";
import { Plus, Trash2, Edit2, Users, Mail, IdCard, Plus as PlusIcon, Check, X, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Tournament } from "@/lib/mockTournaments";

interface Jugador {
  id: string;
  codigo: string;
  nombre: string;
  apellido: string;
  correo: string;
  esTitular: boolean;
}

interface EquipoInscrito {
  id: string;
  nombre: string;
  facultad: string;
  disciplina: string;
  categoria: string;
  jugadores: Jugador[];
  estado: "incompleto" | "pendiente" | "aprobado";
  fechaInscripcion: string;
}

const DISCIPLINAS = [
  { id: "futbol", name: "Fútbol", cat: ["Varones", "Damas"], min: 11, max: 22 },
  { id: "voley", name: "Vóley", cat: ["Varones", "Damas", "Mixto"], min: 6, max: 12 },
  { id: "basquet", name: "Básquet", cat: ["Varones", "Damas"], min: 5, max: 12 },
  { id: "futsal", name: "Futsal", cat: ["Varones", "Damas"], min: 5, max: 12 },
  { id: "ajedrez", name: "Ajedrez", cat: ["Mixto"], min: 1, max: 2 },
];

const FACULTADES_UNAS = [
  "FIA (Ingeniería Agronómica)",
  "FIZ (Zootecnia)",
  "FIIS (Ingeniería en Informática y Sistemas)",
  "FIARN (Recursos Naturales Renovables)",
  "FCA (Ciencias Administrativas)",
  "FCEA (Ciencias Económicas y Administrativas)",
  "FE (Educación)",
];

// Datos simulados
const MOCK_EQUIPOS: EquipoInscrito[] = [
  {
    id: "eq-001",
    nombre: "FIA Fútbol Varones A",
    facultad: "FIA (Ingeniería Agronómica)",
    disciplina: "futbol",
    categoria: "Varones",
    estado: "aprobado",
    fechaInscripcion: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    jugadores: [
      {
        id: "j1",
        codigo: "0020190123",
        nombre: "Juan Alberto",
        apellido: "Pérez Rodríguez",
        correo: "juan.perez@unas.edu.pe",
        esTitular: true,
      },
      {
        id: "j2",
        codigo: "0020190124",
        nombre: "Carlos Eduardo",
        apellido: "López García",
        correo: "carlos.lopez@unas.edu.pe",
        esTitular: true,
      },
      {
        id: "j3",
        codigo: "0020190125",
        nombre: "Miguel Ángel",
        apellido: "Ramírez Flores",
        correo: "miguel.ramirez@unas.edu.pe",
        esTitular: false,
      },
    ],
  },
];

interface MisEquiposTabProps {
  tournament: Tournament;
  userRole?: string;
}

interface NuevoJugadorForm {
  codigo: string;
  nombre: string;
  apellido: string;
  correo: string;
  esTitular: boolean;
}

export function MisEquiposTab({ tournament, userRole }: MisEquiposTabProps) {
  const [equipos, setEquipos] = useState<EquipoInscrito[]>(MOCK_EQUIPOS);
  const [showAddEquipoDialog, setShowAddEquipoDialog] = useState(false);
  const [showAddJugadorDialog, setShowAddJugadorDialog] = useState(false);
  const [selectedEquipoId, setSelectedEquipoId] = useState<string | null>(null);

  const [newEquipo, setNewEquipo] = useState({
    nombre: "",
    facultad: "",
    disciplina: "",
    categoria: "",
  });

  const [newJugador, setNewJugador] = useState<NuevoJugadorForm>({
    codigo: "",
    nombre: "",
    apellido: "",
    correo: "",
    esTitular: true,
  });

  const selectedDisc = DISCIPLINAS.find(d => d.id === newEquipo.disciplina);
  const selectedEquipo = equipos.find(eq => eq.id === selectedEquipoId);

  const validarCodigo = (codigo: string) => {
    return codigo.length === 10 && /^\d+$/.test(codigo);
  };

  const validarCorreo = (correo: string) => {
    return correo.endsWith("@unas.edu.pe") && correo.includes(".");
  };

  const handleAgregarEquipo = () => {
    if (!newEquipo.nombre || !newEquipo.facultad || !newEquipo.disciplina || !newEquipo.categoria) {
      toast.error("Completa todos los campos del equipo");
      return;
    }

    const equipoId = `eq-${Date.now()}`;
    const nuevoEquipo: EquipoInscrito = {
      id: equipoId,
      ...newEquipo,
      estado: "incompleto",
      fechaInscripcion: new Date().toISOString(),
      jugadores: [],
    };

    setEquipos([...equipos, nuevoEquipo]);
    setShowAddEquipoDialog(false);
    setNewEquipo({ nombre: "", facultad: "", disciplina: "", categoria: "" });
    setSelectedEquipoId(equipoId);
    toast.success("Equipo creado correctamente");
  };

  const handleAgregarJugador = () => {
    if (!selectedEquipo) return;

    if (!validarCodigo(newJugador.codigo)) {
      toast.error("Código debe tener 10 dígitos numéricos (ej: 0020190123)");
      return;
    }

    if (!newJugador.nombre || !newJugador.apellido) {
      toast.error("Ingresa nombre y apellido del estudiante");
      return;
    }

    if (!validarCorreo(newJugador.correo)) {
      toast.error("Correo debe terminar en @unas.edu.pe (ej: juan.perez@unas.edu.pe)");
      return;
    }

    const titulares = selectedEquipo.jugadores.filter(j => j.esTitular).length;
    const total = selectedEquipo.jugadores.length;

    if (newJugador.esTitular && titulares >= (selectedDisc?.min || 11)) {
      toast.error(`Ya completaste el mínimo de ${selectedDisc?.min} titulares`);
      return;
    }

    if (total >= (selectedDisc?.max || 22)) {
      toast.error(`Límite de ${selectedDisc?.max} jugadores alcanzado`);
      return;
    }

    const jugador: Jugador = {
      id: `j-${Date.now()}`,
      ...newJugador,
    };

    const updatedEquipos = equipos.map(eq => {
      if (eq.id === selectedEquipo.id) {
        return {
          ...eq,
          jugadores: [...eq.jugadores, jugador],
          estado: eq.jugadores.length + 1 >= (selectedDisc?.min || 11) ? "pendiente" : "incompleto",
        };
      }
      return eq;
    });

    setEquipos(updatedEquipos);
    setNewJugador({ codigo: "", nombre: "", apellido: "", correo: "", esTitular: true });
    setShowAddJugadorDialog(false);
    toast.success("Jugador agregado correctamente");
  };

  const handleEliminarJugador = (equipoId: string, jugadorId: string) => {
    const updatedEquipos = equipos.map(eq => {
      if (eq.id === equipoId) {
        return {
          ...eq,
          jugadores: eq.jugadores.filter(j => j.id !== jugadorId),
        };
      }
      return eq;
    });
    setEquipos(updatedEquipos);
    toast.success("Jugador eliminado");
  };

  const handleToggleTitular = (equipoId: string, jugadorId: string) => {
    const updatedEquipos = equipos.map(eq => {
      if (eq.id === equipoId) {
        return {
          ...eq,
          jugadores: eq.jugadores.map(j =>
            j.id === jugadorId ? { ...j, esTitular: !j.esTitular } : j
          ),
        };
      }
      return eq;
    });
    setEquipos(updatedEquipos);
    toast.success("Estado de jugador actualizado");
  };

  const handleEliminarEquipo = (equipoId: string) => {
    setEquipos(equipos.filter(eq => eq.id !== equipoId));
    setSelectedEquipoId(null);
    toast.success("Equipo eliminado");
  };

  return (
    <div className="space-y-6">
      {/* Header con botón de agregar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">⭐ Mis Equipos Inscritos</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Gestiona tus equipos y jugadores en el torneo {tournament.name}
          </p>
        </div>
        <Button onClick={() => setShowAddEquipoDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Equipo
        </Button>
      </div>

      {/* Tabs para ver equipos vs requisitos */}
      <Tabs defaultValue="equipos" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="equipos">Mis Equipos ({equipos.length})</TabsTrigger>
          <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
        </TabsList>

        <TabsContent value="equipos" className="space-y-4 mt-6">
          {equipos.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground font-medium">No tienes equipos inscritos</p>
                <p className="text-sm text-muted-foreground mt-1">Crea tu primer equipo para comenzar</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {equipos.map(equipo => (
                <Card
                  key={equipo.id}
                  className={`cursor-pointer transition-all ${
                    selectedEquipoId === equipo.id
                      ? "ring-2 ring-primary border-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedEquipoId(equipo.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{equipo.nombre}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {equipo.facultad} • {DISCIPLINAS.find(d => d.id === equipo.disciplina)?.name} {equipo.categoria}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            equipo.estado === "aprobado"
                              ? "default"
                              : equipo.estado === "pendiente"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {equipo.estado === "aprobado"
                            ? "✓ Aprobado"
                            : equipo.estado === "pendiente"
                            ? "⏳ Pendiente"
                            : "⚠️ Incompleto"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEliminarEquipo(equipo.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {selectedEquipoId === equipo.id && (
                    <>
                      <Separator />
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {/* Requisitos del equipo */}
                          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-2">
                            <h4 className="font-bold text-primary flex items-center gap-2">
                              <Info className="w-4 h-4" />
                              Requisitos de {DISCIPLINAS.find(d => d.id === equipo.disciplina)?.name}
                            </h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>
                                • Mínimo titulares: {selectedDisc?.min} (Actual: {equipo.jugadores.filter(j => j.esTitular).length})
                              </p>
                              <p>
                                • Máximo jugadores: {selectedDisc?.max} (Actual: {equipo.jugadores.length})
                              </p>
                            </div>
                          </div>

                          {/* Lista de jugadores */}
                          <div>
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Jugadores ({equipo.jugadores.length})
                            </h4>
                            <div className="space-y-2">
                              {equipo.jugadores.map(jugador => (
                                <div
                                  key={jugador.id}
                                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                    jugador.esTitular
                                      ? "bg-primary/5 border-primary/30"
                                      : "bg-muted/20 border-border"
                                  }`}
                                >
                                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                    {jugador.nombre[0]}{jugador.apellido[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">
                                      {jugador.nombre} {jugador.apellido}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                      <span className="flex items-center gap-1">
                                        <IdCard className="w-3 h-3" />
                                        {jugador.codigo}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        {jugador.correo}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-primary"
                                      onClick={() =>
                                        handleToggleTitular(equipo.id, jugador.id)
                                      }
                                      title={
                                        jugador.esTitular
                                          ? "Cambiar a suplente"
                                          : "Cambiar a titular"
                                      }
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-red-500 hover:text-red-700"
                                      onClick={() =>
                                        handleEliminarJugador(equipo.id, jugador.id)
                                      }
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                    {jugador.esTitular ? (
                                      <Badge className="bg-primary text-[10px] h-5">
                                        TITULAR
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] h-5"
                                      >
                                        SUPLENTE
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}

                              {equipo.jugadores.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                  <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                                  <p className="text-sm text-muted-foreground">
                                    No hay jugadores agregados
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Botón para agregar jugador */}
                          <Button
                            onClick={() => setShowAddJugadorDialog(true)}
                            variant="outline"
                            className="w-full gap-2 border-dashed"
                            disabled={
                              equipo.jugadores.length >= (selectedDisc?.max || 22)
                            }
                          >
                            <PlusIcon className="w-4 h-4" />
                            Agregar Jugador
                          </Button>
                        </div>
                      </CardContent>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requisitos" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Requisitos de Inscripción</CardTitle>
              <CardDescription>
                Información necesaria para inscribir tus equipos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Requisitos de datos de estudiante */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <IdCard className="w-5 h-5 text-primary" />
                  Datos del Estudiante
                </h3>
                <div className="grid md:grid-cols-2 gap-4 ml-7">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Código Universitario</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Identificador único del estudiante registrado en DIIA
                    </p>
                    <div className="bg-white p-3 rounded font-mono text-sm border border-blue-200">
                      0020190123 ← 10 dígitos numéricos
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">Correo Universitario</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Correo oficial emitido por UNAS
                    </p>
                    <div className="bg-white p-3 rounded font-mono text-sm border border-green-200">
                      usuario.apellido@unas.edu.pe
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Requisitos por disciplina */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Requisitos por Disciplina
                </h3>
                <div className="ml-7 space-y-3">
                  {DISCIPLINAS.map(disc => (
                    <div key={disc.id} className="p-4 rounded-lg bg-muted/50 border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{disc.name}</h4>
                        <Badge variant="secondary">{disc.cat.join(", ")}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Mínimo titulares: <span className="font-bold text-foreground">{disc.min}</span> • Máximo total:{" "}
                        <span className="font-bold text-foreground">{disc.max}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Sistema de Titulares y Suplentes */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  Titulares y Suplentes
                </h3>
                <div className="ml-7 space-y-3">
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-1">🟢 Titulares</h4>
                    <p className="text-sm text-green-700">
                      Jugadores que participarán en todos los partidos. Cada disciplina tiene un mínimo requerido.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-1">🟡 Suplentes</h4>
                    <p className="text-sm text-yellow-700">
                      Jugadores de respaldo. Pueden cambiar a titulares en cualquier momento.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para agregar nuevo equipo */}
      <Dialog open={showAddEquipoDialog} onOpenChange={setShowAddEquipoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Equipo</DialogTitle>
            <DialogDescription>
              Crea un nuevo equipo para el torneo {tournament.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre del Equipo</Label>
              <Input
                placeholder="Ej: FIA Fútbol Varones A"
                value={newEquipo.nombre}
                onChange={(e) =>
                  setNewEquipo({ ...newEquipo, nombre: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Facultad</Label>
              <Select
                value={newEquipo.facultad}
                onValueChange={(v) =>
                  setNewEquipo({ ...newEquipo, facultad: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar facultad" />
                </SelectTrigger>
                <SelectContent>
                  {FACULTADES_UNAS.map(f => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Disciplina</Label>
              <Select
                value={newEquipo.disciplina}
                onValueChange={(v) =>
                  setNewEquipo({ ...newEquipo, disciplina: v, categoria: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {DISCIPLINAS.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select
                value={newEquipo.categoria}
                onValueChange={(v) =>
                  setNewEquipo({ ...newEquipo, categoria: v })
                }
                disabled={!newEquipo.disciplina}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDisc?.cat.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEquipoDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAgregarEquipo}>Crear Equipo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para agregar jugador */}
      <Dialog open={showAddJugadorDialog} onOpenChange={setShowAddJugadorDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Jugador</DialogTitle>
            <DialogDescription>
              Añade un nuevo jugador a {selectedEquipo?.nombre}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Código Universitario *</Label>
                <Input
                  placeholder="0020190123"
                  maxLength={10}
                  value={newJugador.codigo}
                  onChange={(e) =>
                    setNewJugador({
                      ...newJugador,
                      codigo: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className={
                    newJugador.codigo &&
                    !validarCodigo(newJugador.codigo)
                      ? "border-red-500"
                      : ""
                  }
                />
                {newJugador.codigo &&
                  !validarCodigo(newJugador.codigo) && (
                    <p className="text-xs text-red-500">
                      Debe tener 10 dígitos
                    </p>
                  )}
              </div>

              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select
                  value={newJugador.esTitular ? "titular" : "suplente"}
                  onValueChange={(v) =>
                    setNewJugador({
                      ...newJugador,
                      esTitular: v === "titular",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="titular">Titular</SelectItem>
                    <SelectItem value="suplente">Suplente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input
                  placeholder="Juan"
                  value={newJugador.nombre}
                  onChange={(e) =>
                    setNewJugador({ ...newJugador, nombre: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Apellido *</Label>
                <Input
                  placeholder="Pérez"
                  value={newJugador.apellido}
                  onChange={(e) =>
                    setNewJugador({
                      ...newJugador,
                      apellido: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Correo Universitario *</Label>
              <Input
                placeholder="juan.perez@unas.edu.pe"
                type="email"
                value={newJugador.correo}
                onChange={(e) =>
                  setNewJugador({
                    ...newJugador,
                    correo: e.target.value.toLowerCase(),
                  })
                }
                className={
                  newJugador.correo &&
                  !validarCorreo(newJugador.correo)
                    ? "border-red-500"
                    : ""
                }
              />
              {newJugador.correo &&
                !validarCorreo(newJugador.correo) && (
                  <p className="text-xs text-red-500">
                    Debe terminar en @unas.edu.pe
                  </p>
                )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddJugadorDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAgregarJugador}>Agregar Jugador</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
