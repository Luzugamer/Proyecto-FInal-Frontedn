import { useState, useMemo } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardNoticiaDestacada } from "@/components/news/CardNoticiaDestacada";
import { CardNoticiaHorizontal } from "@/components/news/CardNoticiaHorizontal";
import { WidgetMasLeidas } from "@/components/news/WidgetMasLeidas";
import {
  mockNews,
  NewsCategory,
  getCategoryLabel,
  getCategoryEmoji,
} from "@/lib/mockNews";

const categories: { value: NewsCategory | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "resultados", label: "Resultados" },
  { value: "jugadores", label: "Jugadores" },
  { value: "equipos", label: "Equipos" },
  { value: "convocatorias", label: "Convocatorias" },
  { value: "institucional", label: "Institucional" },
];

const NOTICIAS_POR_PAGINA = 6;

export default function NewsPage() {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState<
    NewsCategory | "todas"
  >("todas");
  const [paginaActual, setPaginaActual] = useState(1);

  // Filtrar por categoría y búsqueda
  const noticiasFiltradas = useMemo(() => {
    return mockNews.filter((noticia) => {
      const cumpleCategoria =
        categoriaActiva === "todas" || noticia.categoria === categoriaActiva;
      const cumpleBusqueda =
        busqueda === "" ||
        noticia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        noticia.extracto.toLowerCase().includes(busqueda.toLowerCase()) ||
        noticia.etiquetas.some((tag) =>
          tag.toLowerCase().includes(busqueda.toLowerCase()),
        );

      return (
        cumpleCategoria && cumpleBusqueda && noticia.estado === "publicada"
      );
    });
  }, [busqueda, categoriaActiva]);

  // Noticia destacada (primera o la que tiene destacada: true)
  const noticiaDestacada =
    noticiasFiltradas.find((n) => n.destacada) || noticiasFiltradas[0];
  const noticiasRestantes = noticiasFiltradas.filter(
    (n) => n.id !== noticiaDestacada?.id,
  );

  // Paginación
  const totalPaginas = Math.ceil(
    noticiasRestantes.length / NOTICIAS_POR_PAGINA,
  );
  const indiceInicio = (paginaActual - 1) * NOTICIAS_POR_PAGINA;
  const noticiasPaginadas = noticiasRestantes.slice(
    indiceInicio,
    indiceInicio + NOTICIAS_POR_PAGINA,
  );

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Portal de Noticias
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mantente informado sobre los eventos deportivos, resultados y
              novedades del deporte universitario UNAS.
            </p>
          </div>

          {/* Búsqueda */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar noticias por título, categoría, etiquetas..."
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
                className="pl-12 h-12 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="bg-white border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={categoriaActiva === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCategoriaActiva(cat.value as any);
                  setPaginaActual(1);
                }}
                className="whitespace-nowrap"
              >
                {cat.value !== "todas" &&
                  `${getCategoryEmoji(cat.value as NewsCategory)} `}
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Principal (70%) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Noticia Destacada */}
              {noticiaDestacada && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    Noticia Destacada
                  </h2>
                  <CardNoticiaDestacada noticia={noticiaDestacada} />
                </div>
              )}

              {/* Grid de Noticias */}
              {noticiasPaginadas.length > 0 ? (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    {busqueda
                      ? `Resultados para "${busqueda}"`
                      : "Últimas Noticias"}
                  </h2>
                  <div className="space-y-4">
                    {noticiasPaginadas.map((noticia) => (
                      <CardNoticiaHorizontal
                        key={noticia.id}
                        noticia={noticia}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No se encontraron noticias con los filtros aplicados.
                  </p>
                </div>
              )}

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                  >
                    Anterior
                  </Button>

                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                    (pagina) => (
                      <Button
                        key={pagina}
                        variant={
                          paginaActual === pagina ? "default" : "outline"
                        }
                        onClick={() => setPaginaActual(pagina)}
                      >
                        {pagina}
                      </Button>
                    ),
                  )}

                  <Button
                    variant="outline"
                    disabled={paginaActual === totalPaginas}
                    onClick={() =>
                      setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                    }
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar (30%) */}
            <div className="space-y-6">
              {/* Widget Más Leídas */}
              <WidgetMasLeidas noticias={mockNews} limit={5} />

              {/* Widget Próximos Partidos */}
              <div className="p-6 border border-border rounded-xl bg-white">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="text-xl">⚽</span> Próximos Partidos
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    { equipos: "Agronomía vs Ingeniería", hora: "Hoy 14:00" },
                    {
                      equipos: "Enfermería vs Zootecnia",
                      hora: "Mañana 10:00",
                    },
                    { equipos: "Forestales vs Economía", hora: "Mañana 15:00" },
                  ].map((partido, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-muted/50 rounded-lg border border-border/50"
                    >
                      <p className="font-bold text-foreground">
                        {partido.equipos}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {partido.hora}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget Suscripción */}
              <div className="p-6 border border-primary/20 rounded-xl bg-primary-50">
                <h3 className="font-bold text-lg mb-2">Suscríbete</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Recibe las últimas noticias en tu correo electrónico.
                </p>
                <div className="space-y-2">
                  <Input
                    placeholder="tu@email.com"
                    type="email"
                    className="bg-white"
                  />
                  <Button className="w-full" size="sm">
                    Suscribirse
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
