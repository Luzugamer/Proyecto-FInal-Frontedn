import { Link } from "react-router-dom";
import { Eye, ArrowRight } from "lucide-react";
import {
  News,
  getCategoryBadgeColor,
  getCategoryEmoji,
  getCategoryLabel,
} from "@/lib/mockNews";
import { cn } from "@/lib/utils";

interface CardNoticiaDestacadaProps {
  noticia: News;
}

export function CardNoticiaDestacada({ noticia }: CardNoticiaDestacadaProps) {
  return (
    <div className="group rounded-2xl overflow-hidden border border-border bg-white hover:shadow-xl transition-all duration-300">
      {/* Imagen */}
      <div className="relative h-96 overflow-hidden bg-muted">
        <img
          src={noticia.imagenPrincipal}
          alt={noticia.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Badge y metadata en imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold border",
                getCategoryBadgeColor(noticia.categoria),
              )}
            >
              {getCategoryEmoji(noticia.categoria)}{" "}
              {getCategoryLabel(noticia.categoria)}
            </span>
            <span className="text-sm flex items-center gap-1">
              <Eye className="w-4 h-4" /> {noticia.vistas}
            </span>
          </div>

          <h2 className="text-3xl font-bold leading-tight mb-3">
            {noticia.titulo}
          </h2>

          <p className="text-sm text-white/90 line-clamp-2">
            {noticia.extracto}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={noticia.fechaPublicacion}>
            {new Date(noticia.fechaPublicacion).toLocaleDateString("es-PE")}
          </time>
          <span>•</span>
          <span>{noticia.tiempoLectura} min de lectura</span>
        </div>

        <Link
          to={`/noticia/${noticia.slug}`}
          className="flex items-center gap-2 font-bold text-primary hover:text-primary-700 group/btn transition-colors"
        >
          Leer más
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
