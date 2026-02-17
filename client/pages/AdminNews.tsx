import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  mockNews,
  getCategoryLabel,
  getCategoryEmoji,
  getCategoryBadgeColor,
} from "@/lib/mockNews";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function AdminNewsPage() {
  const { user } = useAuth();
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<
    "todos" | "publicada" | "borrador"
  >("todos");

  const noticiasFiltradas = mockNews.filter((noticia) => {
    const cumpleBusqueda =
      busqueda === "" ||
      noticia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      noticia.extracto.toLowerCase().includes(busqueda.toLowerCase());

    const cumpleEstado =
      estadoFiltro === "todos" || noticia.estado === estadoFiltro;

    return cumpleBusqueda && cumpleEstado;
  });

  const canCreate = [
    "SUPER_ADMIN",
    "ADMINISTRADOR",
    "COMITE_ORGANIZADOR",
  ].includes(user?.rol || "");

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Gestión de Noticias
          </h1>
          <p className="text-lg text-muted-foreground">
            Administra todas las noticias del portal
          </p>
        </div>

        {canCreate && (
          <Link to="/dashboard/admin/noticias/crear">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nueva Noticia
            </Button>
          </Link>
        )}
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white rounded-xl border border-border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Búsqueda */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, extracto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro de estado */}
          <div className="flex gap-2">
            <Filter className="w-4 h-4 text-muted-foreground mt-2.5" />
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value as any)}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-white text-sm"
            >
              <option value="todos">Todos</option>
              <option value="publicada">Publicada</option>
              <option value="borrador">Borrador</option>
            </select>
          </div>
        </div>

        {/* Información */}
        <p className="text-sm text-muted-foreground">
          Mostrando {noticiasFiltradas.length} de {mockNews.length} noticias
        </p>
      </div>

      {/* Tabla de Noticias */}
      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr className="text-xs font-bold text-muted-foreground uppercase">
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4 text-center">Vistas</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {noticiasFiltradas.map((noticia) => (
                <tr
                  key={noticia.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/* Título */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={noticia.imagenPrincipal}
                        alt={noticia.titulo}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">
                          {noticia.titulo}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {noticia.extracto}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border",
                        getCategoryBadgeColor(noticia.categoria),
                      )}
                    >
                      {getCategoryEmoji(noticia.categoria)}{" "}
                      {getCategoryLabel(noticia.categoria)}
                    </span>
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(noticia.fechaPublicacion).toLocaleDateString(
                      "es-PE",
                    )}
                  </td>

                  {/* Vistas */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <Eye className="w-4 h-4" />
                      {noticia.vistas}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        noticia.estado === "publicada"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-200",
                      )}
                    >
                      {noticia.estado}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/noticia/${noticia.slug}`}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            Ver
                          </Link>
                        </DropdownMenuItem>
                        {canCreate && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/dashboard/admin/noticias/${noticia.id}`}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive cursor-pointer flex items-center gap-2">
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {noticiasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No se encontraron noticias con los filtros aplicados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
