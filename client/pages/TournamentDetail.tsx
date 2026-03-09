import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { mockTournaments } from "@/lib/mockTournaments";
import { TournamentHeader } from "@/components/tournament/TournamentHeader";
import { TournamentAdminBar } from "@/components/tournament/TournamentAdminBar";
import { TournamentTabs } from "@/components/tournament/TournamentTabs";
import { RegistrarActaModal } from "@/components/tournament/modals/RegistrarActaModal";
import { InscribirEquipoModal } from "@/components/tournament/modals/InscribirEquipoModal";

export default function TournamentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showRegistrarActa, setShowRegistrarActa] = useState(false);
  const [showInscribirEquipo, setShowInscribirEquipo] = useState(false);

  const tournament = mockTournaments.find((t) => t.slug === slug);

  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Torneo no encontrado
        </h1>
        <p className="text-muted-foreground mb-8">
          El torneo que buscas no existe.
        </p>
        <button
          onClick={() => navigate("/torneos")}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-700"
        >
          Volver a Torneos
        </button>
      </div>
    );
  }

  const handleInscribirse = () => {
    setShowInscribirEquipo(true);
  };

  const handleGenererFixture = () => {
    alert(
      "Generando fixture automáticamente...\n\nEl fixture se ha generado exitosamente.",
    );
  };

  const handleRegistrarActa = () => {
    setShowRegistrarActa(true);
  };

  const handleEditar = () => {
    alert("Abriendo editor de torneo...");
  };

  const handleAsignarComite = () => {
    alert("Abriendo selector de comités...");
  };

  const handleEliminar = () => {
    if (
      confirm(
        "¿Estás seguro de que deseas eliminar este torneo? Esta acción es irreversible.",
      )
    ) {
      alert("Torneo eliminado exitosamente.");
      navigate("/torneos");
    }
  };

  const handleSubmitActa = (data: any) => {
    console.log("Acta registrada:", data);
    alert(
      "✓ Acta registrada correctamente!\n\n" + JSON.stringify(data, null, 2),
    );
  };

  const handleSubmitInscripcion = (data: any) => {
    console.log("Equipo inscrito:", data);
    alert(
      "✓ Equipo inscrito correctamente!\n\n" +
        data.nombreEquipo +
        " - " +
        data.disciplina,
    );
  };

  return (
    <div className="w-full bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-white sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link
              to="/torneos"
              className="text-muted-foreground hover:text-foreground"
            >
              Torneos
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-bold text-foreground">
              {tournament.nombre}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <TournamentHeader
        tournament={tournament}
        userRole={user?.rol}
        onInscribirse={handleInscribirse}
      />

      {/* Admin Bar - Solo si es Comité/Admin/SuperAdmin */}
      <TournamentAdminBar
        tournament={tournament}
        userRole={user?.rol}
        onGenererFixture={handleGenererFixture}
        onRegistrarActa={handleRegistrarActa}
        onEditar={handleEditar}
        onAsignarComite={handleAsignarComite}
      />

      {/* Contenido Principal */}
      <main className="container mx-auto px-4 py-12">
        <TournamentTabs
          tournament={tournament}
          userRole={user?.rol}
          onGenererFixture={handleGenererFixture}
          onRegistrarActa={handleRegistrarActa}
          onEliminar={handleEliminar}
        />
      </main>

      {/* Modales */}
      <RegistrarActaModal
        isOpen={showRegistrarActa}
        onClose={() => setShowRegistrarActa(false)}
        onSubmit={handleSubmitActa}
        match={{
          homeTeam: "Agronomía",
          awayTeam: "Zootecnia",
          date: "2026-02-10T15:00:00",
          sport: "Fútbol Masculino",
          location: "Estadio UNAS",
        }}
      />

      <InscribirEquipoModal
        isOpen={showInscribirEquipo}
        onClose={() => setShowInscribirEquipo(false)}
        onSubmit={handleSubmitInscripcion}
      />
    </div>
  );
}
