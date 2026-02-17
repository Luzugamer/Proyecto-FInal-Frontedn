import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockNews, NewsCategory } from "@/lib/mockNews";

export default function AdminNewsFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const noticiaExistente = id ? mockNews.find((n) => n.id === id) : null;

  const [formData, setFormData] = useState({
    titulo: noticiaExistente?.titulo || "",
    categoria: (noticiaExistente?.categoria || "resultados") as NewsCategory,
    extracto: noticiaExistente?.extracto || "",
    contenido: noticiaExistente?.contenido || "",
    imagenPrincipal: noticiaExistente?.imagenPrincipal || "",
    etiquetas: noticiaExistente?.etiquetas.join(", ") || "",
    destacada: noticiaExistente?.destacada || false,
    permitirComentarios: true,
    estado: (noticiaExistente?.estado || "borrador") as
      | "borrador"
      | "publicada",
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errores[field]) {
      setErrores((prev) => {
        const newErrores = { ...prev };
        delete newErrores[field];
        return newErrores;
      });
    }
  };

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.titulo.trim())
      nuevosErrores.titulo = "El título es requerido";
    if (formData.titulo.length > 120)
      nuevosErrores.titulo = "Máximo 120 caracteres";
    if (!formData.extracto.trim())
      nuevosErrores.extracto = "El extracto es requerido";
    if (formData.extracto.length > 250)
      nuevosErrores.extracto = "Máximo 250 caracteres";
    if (!formData.contenido.trim())
      nuevosErrores.contenido = "El contenido es requerido";
    if (!formData.imagenPrincipal)
      nuevosErrores.imagenPrincipal = "La imagen principal es requerida";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (estado: "borrador" | "publicada") => {
    if (validar()) {
      console.log("Guardando noticia:", { ...formData, estado });
      navigate("/dashboard/admin/noticias");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-border bg-white sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/admin/noticias")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? "Editar Noticia" : "Nueva Noticia"}
          </h1>
        </div>
      </div>

      {/* Formulario */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Tabs defaultValue="contenido" className="space-y-8">
          <TabsList className="bg-muted p-1 rounded-xl">
            <TabsTrigger value="contenido" className="rounded-lg">
              Contenido
            </TabsTrigger>
            <TabsTrigger value="media" className="rounded-lg">
              Media
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg">
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* Pestaña Contenido */}
          <TabsContent value="contenido" className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                placeholder="Ej: Agronomía se corona campeón..."
                value={formData.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                maxLength={120}
                className={errores.titulo ? "border-red-500" : ""}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formData.titulo.length} / 120 caracteres</span>
                {errores.titulo && (
                  <span className="text-red-600">{errores.titulo}</span>
                )}
              </div>
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <select
                id="categoria"
                value={formData.categoria}
                onChange={(e) => handleChange("categoria", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-white"
              >
                <option value="resultados">🏆 Resultados</option>
                <option value="jugadores">⭐ Jugadores</option>
                <option value="equipos">👥 Equipos</option>
                <option value="convocatorias">📢 Convocatorias</option>
                <option value="institucional">🎯 Institucional</option>
              </select>
            </div>

            {/* Extracto */}
            <div className="space-y-2">
              <Label htmlFor="extracto">Extracto *</Label>
              <textarea
                id="extracto"
                placeholder="Breve resumen de la noticia (máximo 250 caracteres)"
                value={formData.extracto}
                onChange={(e) => handleChange("extracto", e.target.value)}
                maxLength={250}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg resize-none ${errores.extracto ? "border-red-500" : "border-border"}`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formData.extracto.length} / 250 caracteres</span>
                {errores.extracto && (
                  <span className="text-red-600">{errores.extracto}</span>
                )}
              </div>
            </div>

            {/* Contenido */}
            <div className="space-y-2">
              <Label htmlFor="contenido">Contenido *</Label>
              <textarea
                id="contenido"
                placeholder="Contenido completo del artículo..."
                value={formData.contenido}
                onChange={(e) => handleChange("contenido", e.target.value)}
                rows={8}
                className={`w-full px-3 py-2 border rounded-lg font-mono text-sm resize-none ${errores.contenido ? "border-red-500" : "border-border"}`}
              />
              {errores.contenido && (
                <p className="text-xs text-red-600">{errores.contenido}</p>
              )}
            </div>

            {/* Etiquetas */}
            <div className="space-y-2">
              <Label htmlFor="etiquetas">Etiquetas (separadas por coma)</Label>
              <Input
                id="etiquetas"
                placeholder="Ej: Fútbol, Interfacultades, Agronomía"
                value={formData.etiquetas}
                onChange={(e) => handleChange("etiquetas", e.target.value)}
              />
            </div>
          </TabsContent>

          {/* Pestaña Media */}
          <TabsContent value="media" className="space-y-6">
            {/* Imagen Principal */}
            <div className="space-y-2">
              <Label>Imagen Principal (16:9) *</Label>
              {formData.imagenPrincipal ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={formData.imagenPrincipal}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleChange("imagenPrincipal", "")}
                    className="absolute top-2 right-2 p-1 bg-destructive text-white rounded hover:bg-destructive/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-video border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30 cursor-pointer hover:border-primary transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">
                      Click para cargar imagen
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WebP (máx 5MB)
                    </p>
                  </div>
                </div>
              )}
              {errores.imagenPrincipal && (
                <p className="text-xs text-red-600">
                  {errores.imagenPrincipal}
                </p>
              )}
            </div>

            {/* Galería */}
            <div className="space-y-2">
              <Label>Galería (opcional)</Label>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30 cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs">Foto {idx}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Pestaña Configuración */}
          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-4">
              {/* Destacada */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                <div>
                  <p className="font-semibold text-foreground">
                    Marcar como destacada
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Aparecerá en el área de noticias destacadas
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.destacada}
                  onChange={(e) => handleChange("destacada", e.target.checked)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
              </div>

              {/* Permitir comentarios */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                <div>
                  <p className="font-semibold text-foreground">
                    Permitir comentarios
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Los lectores podrán comentar el artículo
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.permitirComentarios}
                  onChange={(e) =>
                    handleChange("permitirComentarios", e.target.checked)
                  }
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Botones de Acción */}
        <div className="flex items-center gap-3 mt-12 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/admin/noticias")}
          >
            Cancelar
          </Button>
          <Button variant="outline" onClick={() => handleSubmit("borrador")}>
            Guardar Borrador
          </Button>
          <Button onClick={() => handleSubmit("publicada")}>Publicar</Button>
        </div>
      </div>
    </div>
  );
}
