import { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "@/lib/mockAuth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);

  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (!email.trim()) {
        setError("Por favor ingresa tu correo electrónico");
        return;
      }
      if (!password.trim()) {
        setError("Por favor ingresa tu contraseña");
        return;
      }

      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  const fillCredentials = (uEmail: string, uPass: string) => {
    setEmail(uEmail);
    setPassword(uPass);
    setShowCredentials(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                🏆
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center">SIGED UNAS</h1>
            <p className="text-center text-white/90 text-sm mt-2">
              Sistema de Gestión de Eventos Deportivos
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
              Iniciar Sesión
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Accede a tu cuenta para gestionar tus equipos y participaciones
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="usuario@siged.test"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition disabled:opacity-50"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border border-border rounded bg-white cursor-pointer accent-primary"
                    disabled={isLoading}
                  />
                  <span className="text-muted-foreground">Recuérdame</span>
                </label>
                <a
                  href="#"
                  className="text-primary hover:text-primary-700 transition font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">O</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Test Credentials Panel */}
            <div className="mt-8 border border-primary/20 rounded-xl overflow-hidden bg-primary-50/50">
              <button
                type="button"
                onClick={() => setShowCredentials(!showCredentials)}
                className="w-full flex items-center justify-between p-4 text-primary font-bold hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <span>Cuentas de Prueba</span>
                </div>
                {showCredentials ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showCredentials && (
                <div className="p-4 pt-0 space-y-3">
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {mockUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() =>
                          fillCredentials(user.email, user.password)
                        }
                        className="w-full text-left p-2 rounded bg-white border border-border hover:border-primary transition-colors group"
                      >
                        <p className="text-xs font-bold text-foreground group-hover:text-primary">
                          {user.rol.replace("_", " ")}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center italic">
                    Contraseña común:{" "}
                    <span className="font-bold">Password123!</span> (Ver lista
                    para detalles)
                  </p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
              <p className="text-xs text-foreground mb-2">
                <span className="font-semibold">¿Primera vez?</span> Contacta al
                Comité Deportivo para registrarte.
              </p>
              <p className="text-xs text-muted-foreground">
                Tu código universitario y contraseña fueron enviados por el
                administrador del sistema.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-primary-50 border-t border-border">
            <p className="text-center text-xs text-muted-foreground">
              © 2026 Universidad Nacional Agraria de la Selva
            </p>
          </div>
        </div>

        {/* Support Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Problemas al iniciar sesión?{" "}
            <a
              href="mailto:contacto@siged.unas.edu.pe"
              className="text-primary hover:text-primary-700 font-medium transition"
            >
              Contacta soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
