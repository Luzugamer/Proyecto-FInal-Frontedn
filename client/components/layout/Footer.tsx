import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary font-bold">
                🏆
              </div>
              <span className="font-bold text-lg">SIGED</span>
            </div>
            <p className="text-sm opacity-90">
              Sistema de Gestión de Eventos Deportivos de la Universidad Nacional Agraria de la Selva (UNAS).
            </p>
          </div>

          {/* Competencias */}
          <div>
            <h4 className="font-bold mb-4">Competencias</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-90 hover:opacity-100 transition">Interfacultades</a></li>
              <li><a href="#" className="opacity-90 hover:opacity-100 transition">Cachimbos</a></li>
              <li><a href="#" className="opacity-90 hover:opacity-100 transition">Calendario</a></li>
              <li><a href="#" className="opacity-90 hover:opacity-100 transition">Reglamentos</a></li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="font-bold mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-90 hover:opacity-100 transition">Preguntas Frecuentes</a></li>
              <li><a href="#" className="opacity-90 hover:opacity-100 transition">Contacto</a></li>
              <li><a href="#" className="opacity-90 hover:opacity-100 transition">Ayuda</a></li>
              <li><a href="mailto:contacto@siged.unas.edu.pe" className="opacity-90 hover:opacity-100 transition">Email</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4">Síguenos</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 hover:bg-white/20 rounded-lg transition" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-white/20 rounded-lg transition" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-white/20 rounded-lg transition" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-white/20 rounded-lg transition" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-90">
            <p>&copy; 2026 Universidad Nacional Agraria de la Selva | Tingo María, Perú</p>
            <div className="flex gap-6">
              <a href="#" className="hover:opacity-100 transition">Política de Privacidad</a>
              <a href="#" className="hover:opacity-100 transition">Términos de Servicio</a>
            </div>
          </div>
          <p className="text-center mt-4 text-xs opacity-80">contacto@siged.unas.edu.pe</p>
        </div>
      </div>
    </footer>
  );
}
