import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50">
      <div className="text-center px-4">
        <div className="text-8xl font-bold text-primary mb-4">404</div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Página no encontrada</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
