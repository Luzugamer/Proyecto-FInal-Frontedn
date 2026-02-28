import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  Filter,
  Newspaper,
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
  const [busqueda, setBusqueda]       = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<"todos" | "publicada" | "borrador">("todos");

  const noticiasFiltradas = mockNews.filter((noticia) => {
    const cumpleBusqueda =
      busqueda === "" ||
      noticia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      noticia.extracto.toLowerCase().includes(busqueda.toLowerCase());

    const cumpleEstado =
      estadoFiltro === "todos" || noticia.estado === estadoFiltro;

    return cumpleBusqueda && cumpleEstado;
  });

  const canCreate = ["SUPER_ADMIN", "ADMINISTRADOR", "COMITE_ORGANIZADOR"].includes(user?.rol || "");

  return (
    <div className="container mx-auto px-4 py-10">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Gestión de Noticias</h1>
          <p className="text-muted-foreground">Administra todas las noticias del portal</p>
        </div>

        {canCreate && (
          <Link to="/dashboard/admin/noticias/crear">
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Nueva Noticia
            </Button>
          </Link>
        )}
      </div>

      {/* ── Buscador y filtros ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-border p-5 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">

          {/* Búsqueda */}
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título o extracto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro estado */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value as any)}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="todos">Todos</option>
              <option value="publicada">Publicada</option>
              <option value="borrador">Borrador</option>
            </select>
          </div>
        </div>

        {/* Conteo */}
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{noticiasFiltradas.length}</span> de{" "}
          <span className="font-semibold text-foreground">{mockNews.length}</span> noticias
        </p>
      </div>

      {/* ── Tabla — desktop (md+) ────────────────────────────────────────────── */}
      <div className="hidden md:block bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-muted/50 border-b border-border">
              <tr className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4">Noticia</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4 text-center">Vistas</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {noticiasFiltradas.map((noticia) => (
                <tr key={noticia.id} className="hover:bg-muted/20 transition-colors">

                  {/* Imagen + título */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={noticia.imagenPrincipal}
                        alt={noticia.titulo}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-border"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-foreground text-sm truncate max-w-[280px]">
                          {noticia.titulo}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 max-w-[280px] leading-relaxed">
                          {noticia.extracto}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="px-6 py-5">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap",
                      getCategoryBadgeColor(noticia.categoria),
                    )}>
                      {getCategoryEmoji(noticia.categoria)}{" "}
                      {getCategoryLabel(noticia.categoria)}
                    </span>
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-5 text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(noticia.fechaPublicacion).toLocaleDateString("es-PE", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>

                  {/* Vistas */}
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">{noticia.vistas.toLocaleString("es-PE")}</span>
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider",
                      noticia.estado === "publicada"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-yellow-100 text-yellow-700 border border-yellow-200",
                    )}>
                      {noticia.estado}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-lg">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem asChild>
                          <Link to={`/noticia/${noticia.slug}`} className="flex items-center gap-2 cursor-pointer">
                            <Eye className="w-4 h-4" />
                            Ver publicación
                          </Link>
                        </DropdownMenuItem>
                        {canCreate && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link to={`/dashboard/admin/noticias/${noticia.id}`} className="flex items-center gap-2 cursor-pointer">
                                <Edit2 className="w-4 h-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2">
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
          <EmptyState />
        )}
      </div>

      {/* ── Cards — mobile (< md) ────────────────────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {noticiasFiltradas.length === 0 ? (
          <div className="bg-white border border-border rounded-xl">
            <EmptyState />
          </div>
        ) : (
          noticiasFiltradas.map((noticia) => (
            <div
              key={noticia.id}
              className="bg-white border border-border rounded-xl p-4 shadow-sm"
            >
              {/* Fila superior: imagen + info principal */}
              <div className="flex gap-3 mb-4">
                <img
                  src={noticia.imagenPrincipal}
                  alt={noticia.titulo}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground line-clamp-2 leading-snug mb-1">
                    {noticia.titulo}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {noticia.extracto}
                  </p>
                </div>
              </div>

              {/* Fila de badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border",
                  getCategoryBadgeColor(noticia.categoria),
                )}>
                  {getCategoryEmoji(noticia.categoria)} {getCategoryLabel(noticia.categoria)}
                </span>
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border",
                  noticia.estado === "publicada"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-yellow-100 text-yellow-700 border-yellow-200",
                )}>
                  {noticia.estado}
                </span>
              </div>

              {/* Fila inferior: metadata + acciones */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    {new Date(noticia.fechaPublicacion).toLocaleDateString("es-PE", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {noticia.vistas.toLocaleString("es-PE")}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem asChild>
                      <Link to={`/noticia/${noticia.slug}`} className="flex items-center gap-2 cursor-pointer">
                        <Eye className="w-4 h-4" />
                        Ver publicación
                      </Link>
                    </DropdownMenuItem>
                    {canCreate && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to={`/dashboard/admin/noticias/${noticia.id}`} className="flex items-center gap-2 cursor-pointer">
                            <Edit2 className="w-4 h-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

// ── Componente auxiliar para estado vacío ─────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
        <Newspaper className="w-7 h-7 text-muted-foreground" />
      </div>
      <p className="font-semibold text-foreground">Sin resultados</p>
      <p className="text-sm text-muted-foreground max-w-xs">
        No se encontraron noticias con los filtros aplicados. Intenta con otros términos.
      </p>
    </div>
  );
}