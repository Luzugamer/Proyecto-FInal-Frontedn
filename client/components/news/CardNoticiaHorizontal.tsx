import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  News,
  getCategoryBadgeColor,
  getCategoryEmoji,
  getCategoryLabel,
} from "@/lib/mockNews";
import { cn } from "@/lib/utils";

interface CardNoticiaHorizontalProps {
  noticia: News;
  variant?: "default" | "compact";
}

export function CardNoticiaHorizontal({
  noticia,
  variant = "default",
}: CardNoticiaHorizontalProps) {
  const isCompact = variant === "compact";

  return (
    <Link
      to={`/noticia/${noticia.slug}`}
      className="group flex gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary-50 transition-all duration-200"
    >
      {/* Imagen */}
      <div
        className={cn(
          "flex-shrink-0 rounded-lg overflow-hidden bg-muted",
          isCompact ? "w-24 h-24" : "w-32 h-32",
        )}
      >
        <img
          src={noticia.imagenPrincipal}
          alt={noticia.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        {/* Badge y categoría */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap",
              getCategoryBadgeColor(noticia.categoria),
            )}
          >
            {getCategoryEmoji(noticia.categoria)}{" "}
            {getCategoryLabel(noticia.categoria)}
          </span>
          <time className="text-xs text-muted-foreground whitespace-nowrap">
            {new Date(noticia.fechaPublicacion).toLocaleDateString("es-PE")}
          </time>
        </div>

        {/* Título y extracto */}
        <div className="min-w-0">
          <h3
            className={cn(
              "font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2",
              isCompact ? "text-sm" : "text-base",
            )}
          >
            {noticia.titulo}
          </h3>
          {!isCompact && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {noticia.extracto}
            </p>
          )}
        </div>

        {/* Botón */}
        {!isCompact && (
          <div className="flex items-center gap-1 text-primary font-medium text-sm mt-2 group-hover:gap-2 transition-all">
            Leer más
            <ArrowRight className="w-3 h-3" />
          </div>
        )}
      </div>
    </Link>
  );
}
