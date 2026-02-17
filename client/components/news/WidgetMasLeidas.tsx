import { Link } from "react-router-dom";
import { Eye, TrendingUp } from "lucide-react";
import { News } from "@/lib/mockNews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WidgetMasLeidasProps {
  noticias: News[];
  limit?: number;
}

export function WidgetMasLeidas({ noticias, limit = 5 }: WidgetMasLeidasProps) {
  const sortedByViews = [...noticias]
    .sort((a, b) => b.vistas - a.vistas)
    .slice(0, limit);

  return (
    <Card className="border border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          Más Leídas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedByViews.map((noticia, index) => (
          <Link
            key={noticia.id}
            to={`/noticia/${noticia.slug}`}
            className="flex items-start gap-3 pb-4 border-b last:border-b-0 hover:opacity-75 transition-opacity group"
          >
            {/* Número */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
              {index + 1}
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                {noticia.titulo}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Eye className="w-3 h-3" />
                <span>{noticia.vistas.toLocaleString("es-PE")} vistas</span>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
