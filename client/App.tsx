import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import Tournaments from "./pages/Tournaments";
import TournamentDetail from "./pages/TournamentDetail";
import MatchDetail from "./pages/MatchDetail";
import Login from "./pages/Login";
import Teams from "./pages/Teams";
import Users from "./pages/Users";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import AdminNews from "./pages/AdminNews";
import AdminNewsForm from "./pages/AdminNewsForm";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/torneos" element={<Tournaments />} />
            <Route path="/torneo/:slug" element={<TournamentDetail />} />
            <Route
              path="/torneo/:slug/partidos/:id"
              element={<MatchDetail />}
            />
            <Route path="/partidos/:id" element={<MatchDetail />} />
            <Route path="/calendario" element={<Calendar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/noticias" element={<News />} />
            <Route path="/noticia/:slug" element={<NewsDetail />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/dashboard/sin-acceso" element={<Unauthorized />} />
            <Route
              path="/dashboard/usuarios"
              element={
                <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMINISTRADOR"]}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/noticias"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "SUPER_ADMIN",
                    "ADMINISTRADOR",
                    "COMITE_ORGANIZADOR",
                  ]}
                >
                  <AdminNews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/noticias/crear"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "SUPER_ADMIN",
                    "ADMINISTRADOR",
                    "COMITE_ORGANIZADOR",
                  ]}
                >
                  <AdminNewsForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/noticias/:id"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "SUPER_ADMIN",
                    "ADMINISTRADOR",
                    "COMITE_ORGANIZADOR",
                  ]}
                >
                  <AdminNewsForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipos"
              element={
                <ProtectedRoute>
                  <Teams />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
