import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  mockNews,
  getCategoryBadgeColor,
  getCategoryEmoji,
  getCategoryLabel,
} from "@/lib/mockNews";
import { CardNoticiaHorizontal } from "@/components/news/CardNoticiaHorizontal";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const noticia = mockNews.find((n) => n.slug === slug);

  useEffect(() => {
    // Auto-incrementar vistas cuando se abre el artículo
    if (noticia) {
      noticia.vistas += 1;
      window.scrollTo(0, 0);
    }
  }, [slug, noticia]);

  if (!noticia) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Noticia no encontrada
        </h1>
        <p className="text-muted-foreground mb-8">
          La noticia que buscas no existe.
        </p>
        <Button onClick={() => navigate("/noticias")}>Volver al portal</Button>
      </div>
    );
  }

  // Noticias relacionadas (misma categoría)
  const noticiasRelacionadas = mockNews
    .filter((n) => n.categoria === noticia.categoria && n.id !== noticia.id)
    .slice(0, 3);

  // Más noticias recientes
  const masNoticias = mockNews
    .filter((n) => n.id !== noticia.id)
    .sort(
      (a, b) =>
        new Date(b.fechaPublicacion).getTime() -
        new Date(a.fechaPublicacion).getTime(),
    )
    .slice(0, 4);

  const shareUrl = `${window.location.origin}/noticia/${noticia.slug}`;
  const shareText = `${noticia.titulo} - Portal de Noticias SIGED`;

  return (
    <div className="w-full bg-white">
      {/* Navegación rápida */}
      <div className="border-b border-border sticky top-16 z-30 bg-white">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/noticias")}
            className="flex items-center gap-2 text-primary hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al portal
          </Button>
        </div>
      </div>

      {/* Contenido Principal */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Principal (70%) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Badge y título */}
              <div>
                <span
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border mb-4",
                    getCategoryBadgeColor(noticia.categoria),
                  )}
                >
                  {getCategoryEmoji(noticia.categoria)}{" "}
                  {getCategoryLabel(noticia.categoria)}
                </span>

                <h1 className="text-5xl font-bold text-foreground leading-tight mb-6">
                  {noticia.titulo}
                </h1>

                {/* Meta información */}
                <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-border text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      A
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {noticia.autor}
                      </p>
                      <p className="text-xs">{noticia.autor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <time dateTime={noticia.fechaPublicacion}>
                      {new Date(noticia.fechaPublicacion).toLocaleDateString(
                        "es-PE",
                      )}
                    </time>
                  </div>

                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {noticia.vistas} vistas
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {noticia.tiempoLectura} min
                  </div>
                </div>
              </div>

              {/* Imagen principal */}
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={noticia.imagenPrincipal}
                  alt={noticia.titulo}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Contenido */}
              <div className="prose prose-lg max-w-none text-foreground space-y-6">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {noticia.contenido}
                </p>

                {/* Galería si existe */}
                {noticia.galeria.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Galería</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {noticia.galeria.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Imagen ${idx + 1}`}
                          className="rounded-lg w-full h-48 object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Etiquetas */}
              <div className="flex flex-wrap gap-2 py-6 border-y border-border">
                {noticia.etiquetas.map((tag) => (
                  <Link
                    key={tag}
                    to={`/noticias?busqueda=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-muted hover:bg-primary hover:text-white rounded-full text-sm font-medium transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Botones de compartir */}
              <div className="flex items-center gap-4 py-6">
                <span className="font-semibold text-foreground">
                  Compartir:
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    window.open(
                      `https://facebook.com/sharer/sharer.php?u=${shareUrl}`,
                      "_blank",
                    )
                  }
                  title="Compartir en Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
                      "_blank",
                    )
                  }
                  title="Compartir en Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    (window.location.href = `mailto:?subject=${shareText}&body=${shareUrl}`)
                  }
                  title="Enviar por email"
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Sidebar (30%) */}
            <div className="space-y-6">
              {/* Compartir redes */}
              <div className="p-6 border border-border rounded-xl bg-muted/30">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  Compartir
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() =>
                      window.open(
                        `https://facebook.com/sharer/sharer.php?u=${shareUrl}`,
                        "_blank",
                      )
                    }
                  >
                    <Facebook className="w-4 h-4" /> Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
                        "_blank",
                      )
                    }
                  >
                    <Twitter className="w-4 h-4" /> Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                  >
                    <Mail className="w-4 h-4" /> Copiar enlace
                  </Button>
                </div>
              </div>

              {/* Noticias relacionadas */}
              {noticiasRelacionadas.length > 0 && (
                <div className="p-6 border border-border rounded-xl bg-white">
                  <h3 className="font-bold text-lg mb-4">
                    Noticias Relacionadas
                  </h3>
                  <div className="space-y-3">
                    {noticiasRelacionadas.map((n) => (
                      <Link
                        key={n.id}
                        to={`/noticia/${n.slug}`}
                        className="group flex gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={n.imagenPrincipal}
                            alt={n.titulo}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-2">
                            {n.titulo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(n.fechaPublicacion).toLocaleDateString(
                              "es-PE",
                            )}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Más noticias */}
      {masNoticias.length > 0 && (
        <section className="py-16 bg-primary-50 border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Más Noticias
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {masNoticias.map((noticia) => (
                <CardNoticiaHorizontal
                  key={noticia.id}
                  noticia={noticia}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
