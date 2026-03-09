import { useState, useMemo } from "react";
import { Eye, Check, X, Filter, Search, Dice5, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface InscripcionesTabProps {
  tournamentId: string;
  userRole?: string;
}

const mockInscripciones = [
  {
    id: "1",
    facultad: "FIIS (Informática)",
    disciplina: "Fútbol Masculino",
    categoria: "Varones",
    estado: "pendiente",
    fecha: "2026-02-05",
    jugadores: "22/22",
    validacionDIIA: "completo",
    delegado: "Ing. Marco Aurelio",
    email: "maurelio@unas.edu.pe"
  },
  {
    id: "2",
    facultad: "FIA (Agronomía)",
    disciplina: "Vóley Femenino",
    categoria: "Damas",
    estado: "aprobado",
    fecha: "2026-02-04",
    jugadores: "12/12",
    validacionDIIA: "completo",
    delegado: "Dra. Elena Ramos",
    email: "eramos@unas.edu.pe"
  },
  {
    id: "3",
    facultad: "FCA (Administrativas)",
    disciplina: "Básquet Masculino",
    categoria: "Varones",
    estado: "pendiente",
    fecha: "2026-02-06",
    jugadores: "10/12",
    validacionDIIA: "incompleto",
    delegado: "Lic. Carlos Paz",
    email: "cpaz@unas.edu.pe"
  },
];

export function InscripcionesTab({
  tournamentId,
  userRole,
}: InscripcionesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [showSorteoModal, setShowSorteoModal] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  const canManage = [
    "COMITE_ORGANIZADOR",
    "ADMINISTRADOR",
    "SUPER_ADMIN",
  ].includes(userRole || "");

  const filteredInscripciones = useMemo(() => {
    return mockInscripciones.filter(ins => {
      const matchSearch = ins.facultad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ins.disciplina.toLowerCase().includes(searchTerm.toLowerCase());
      const matchEstado = filterEstado === "todos" || ins.estado === filterEstado;
      return matchSearch && matchEstado;
    });
  }, [searchTerm, filterEstado]);

  const handleSorteo = () => {
    setIsSorting(true);
    setTimeout(() => {
      setIsSorting(false);
      setShowSorteoModal(false);
      toast.success("Sorteo realizado con éxito. Grupos y Fixture generados.");
      window.open("https://www.unas.edu.pe/fixture-interfacultades-2026.pdf", "_blank");
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Título estandarizado ──────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">✅ Inscripciones</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestión de equipos inscritos y sorteo de competencia
          </p>
        </div>
        {canManage && (
          <Button
            onClick={() => setShowSorteoModal(true)}
            className="bg-primary hover:bg-primary-700 gap-2 shadow-lg shadow-primary/20 flex-shrink-0"
          >
            <Dice5 className="w-4 h-4" />
            Realizar Sorteo
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar facultad o disciplina..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select onValueChange={setFilterEstado} defaultValue="todos">
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendientes</SelectItem>
            <SelectItem value="aprobado">Aprobados</SelectItem>
            <SelectItem value="rechazado">Rechazados</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          Mostrando {filteredInscripciones.length} de {mockInscripciones.length} inscripciones
        </div>
      </div>

      {/* Lista */}
      <div className="grid grid-cols-1 gap-4">
        {filteredInscripciones.map((ins) => (
          <div
            key={ins.id}
            className="bg-white border border-border rounded-xl p-6 hover:shadow-md transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {ins.facultad[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
                    {ins.facultad}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="font-normal">{ins.disciplina}</Badge>
                    <Badge variant="outline" className="font-normal">{ins.categoria}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Badge
                  className={
                    ins.estado === "aprobado"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : ins.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-red-100 text-red-700 border-red-200"
                  }
                >
                  {ins.estado.toUpperCase()}
                </Badge>
                <p className="text-xs text-muted-foreground">Inscrito: {ins.fecha}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider">Delegado</p>
                <p className="text-sm font-semibold">{ins.delegado}</p>
                <p className="text-xs text-primary">{ins.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider">Jugadores</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{ins.jugadores}</p>
                  <Badge variant="outline" className="text-[10px] h-4">Validado DIIA</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider">DIIA Status</p>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${ins.validacionDIIA === 'completo' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <p className="text-sm font-semibold capitalize">{ins.validacionDIIA}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 md:col-span-1">
                <Button variant="ghost" size="sm" className="h-9 px-3 gap-2">
                  <Eye className="w-4 h-4" />
                  Ver
                </Button>
                {ins.estado === "pendiente" && canManage && (
                  <>
                    <Button variant="outline" size="sm" className="h-9 px-3 border-green-200 text-green-600 hover:bg-green-50">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 px-3 border-red-200 text-red-600 hover:bg-red-50">
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredInscripciones.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
            <p className="text-muted-foreground">No se encontraron inscripciones con los filtros actuales</p>
          </div>
        )}
      </div>

      {/* Modal de Sorteo */}
      <Dialog open={showSorteoModal} onOpenChange={setShowSorteoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <Dice5 className="w-6 h-6 text-primary" />
              Sistema de Sorteo
            </DialogTitle>
            <DialogDescription>
              Se ejecutará el algoritmo de sorteo aleatorio para la distribución de grupos y fixture de eliminación directa.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700">
              <strong>Atención:</strong> Esta acción notificará automáticamente a todos los delegados vía correo UNAS y publicará el fixture oficial. No se puede deshacer.
            </p>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowSorteoModal(false)}>Cancelar</Button>
            <Button
              onClick={handleSorteo}
              disabled={isSorting}
              className="bg-primary hover:bg-primary-700 min-w-[140px]"
            >
              {isSorting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sorteando...
                </>
              ) : (
                <>
                  <Dice5 className="w-4 h-4 mr-2" />
                  Ejecutar Sorteo
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}