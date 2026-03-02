import { Link } from "react-router-dom";

export default function SimpleIndex() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-primary mb-4">
          🏆 SIGED - Sistema de Gestión Deportiva
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Bienvenido al sistema de gestión de eventos deportivos UNAS
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <Link
            to="/torneos"
            className="p-8 bg-white border-2 border-primary rounded-xl hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-primary mb-2">Torneos</h2>
            <p className="text-muted-foreground">Ver todos los torneos</p>
          </Link>

          <Link
            to="/partidos"
            className="p-8 bg-white border-2 border-secondary rounded-xl hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-4xl mb-4">⚽</div>
            <h2 className="text-2xl font-bold text-secondary mb-2">Partidos</h2>
            <p className="text-muted-foreground">Ver todos los partidos</p>
          </Link>

          <Link
            to="/noticias"
            className="p-8 bg-white border-2 border-accent rounded-xl hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-4xl mb-4">📰</div>
            <h2 className="text-2xl font-bold text-accent mb-2">Noticias</h2>
            <p className="text-muted-foreground">Últimas noticias</p>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg max-w-2xl mx-auto">
          <p className="text-green-800 font-semibold text-lg">
            ✅ El sitio está funcionando correctamente
          </p>
          <p className="text-green-600 mt-2">
            Si ves este mensaje, la aplicación está cargando bien
          </p>
        </div>

        <div className="mt-8">
          <Link
            to="/test-partidos"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            🔍 Ir a Página de Pruebas
          </Link>
        </div>
      </div>
    </div>
  );
}
