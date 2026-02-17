# Guía de Implementación: Sistema de Gestión de Récords Deportivos

## Descripción General

Se ha implementado un sistema completo de gestión de récords de estudiantes deportistas para SIGED - UNAS. El sistema permite:

- **Delegados Deportivos**: Cargar documentos individuales o mediante Google Drive
- **Administradores**: Revisar, aprobar o rechazar documentos
- **Estudiantes**: Consultar estado de sus récords

## Componentes Creados

### 1. **DocumentUploader** (`client/components/records/DocumentUploader.tsx`)
Componente base para cargar archivos con:
- Drag & drop
- Validación de formato (PDF, JPG, PNG, JPEG)
- Validación de tamaño (máx 5MB por archivo, 20MB total)
- Progreso de carga simulado
- Preview de archivos

**Uso:**
```tsx
import { DocumentUploader } from "@/components/records/DocumentUploader";

<DocumentUploader
  documentType="certificado_medico"
  onDocumentsUploaded={(files, type) => handleUpload(files, type)}
  maxFileSize={5}
  maxTotalSize={20}
  acceptedFormats={["pdf", "jpg", "jpeg", "png"]}
/>
```

### 2. **RecordsUploadModal** (`client/components/records/RecordsUploadModal.tsx`)
Modal principal para cargar récords con dos opciones:

#### Opción 1: Individual
- Interfaz por jugador
- Upload de documentos obligatorios
- Validación en tiempo real
- Navegación entre jugadores

#### Opción 2: Google Drive
- Validación de URL de Drive
- Validación de estructura de carpetas
- Reporte de validación
- Sincronización automática

**Uso:**
```tsx
import { RecordsUploadModal } from "@/components/records/RecordsUploadModal";

<RecordsUploadModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  jugadores={jugadores}
  disciplina="Fútbol Masculino"
  onComplete={(records) => handleRecordsComplete(records)}
/>
```

### 3. **RecordsManagementPanel** (`client/components/records/RecordsManagementPanel.tsx`)
Panel para delegados con:
- Vista de todos sus récords
- Filtros por estado
- Búsqueda por nombre/código
- Estadísticas de completitud
- Acciones: actualizar, descargar, comentarios

**Uso:**
```tsx
import { RecordsManagementPanel } from "@/components/records/RecordsManagementPanel";

<RecordsManagementPanel
  records={studentRecords}
  onEdit={(record) => handleEdit(record)}
  onDownload={(recordId) => handleDownload(recordId)}
/>
```

### 4. **RecordsReviewPanel** (`client/components/records/RecordsReviewPanel.tsx`)
Panel de revisión para administradores con:
- Revisión de documentos por estudiante
- Aprobación/rechazo individual
- Aprobación masiva
- Filtros avanzados (facultad, estado)
- Reporte de rechazos

**Uso:**
```tsx
import { RecordsReviewPanel } from "@/components/records/RecordsReviewPanel";

<RecordsReviewPanel
  records={allStudentRecords}
  onApprove={(recordId, docId) => handleApprove(recordId, docId)}
  onReject={(recordId, docId, motivo) => handleReject(recordId, docId, motivo)}
/>
```

## Tipos Definidos

Se han agregado los siguientes tipos a `shared/api.ts`:

```typescript
// Tipos de documento
export type DocumentType = 
  | "ficha_inscripcion"
  | "certificado_medico"
  | "foto_3x4"
  | "dni"
  | "constancia_matricula"
  | "declaracion_jurada"
  | "seguro_accidentes"
  | "otros";

// Estados de documento
export type DocumentStatus = "pendiente" | "aprobado" | "rechazado";

// Método de carga
export type RecordsUploadMethod = "individual" | "drive";

// Interfaces principales
export interface Document { ... }
export interface StudentRecord { ... }
export interface TeamRecords { ... }
export interface RecordsValidationReport { ... }
export interface RecordsNotification { ... }
```

## Integración en el Flujo Existente

### 1. En InscribirEquipoModal (Delegado)

Agregar a `client/components/tournament/modals/InscribirEquipoModal.tsx`:

```tsx
// Importar el modal
import { RecordsUploadModal } from "@/components/records/RecordsUploadModal";

// Agregar estado
const [showRecordsModal, setShowRecordsModal] = useState(false);
const [jugadores, setJugadores] = useState<Player[]>([]);
const [records, setRecords] = useState<StudentRecord[]>([]);

// En el componente
{step === 2 && (
  <>
    {/* Existing player upload code */}
    
    {/* Add Records Upload */}
    <Button onClick={() => setShowRecordsModal(true)}>
      Gestionar Récords
    </Button>
  </>
)}

<RecordsUploadModal
  isOpen={showRecordsModal}
  onClose={() => setShowRecordsModal(false)}
  jugadores={jugadores}
  disciplina={formData.disciplina}
  onComplete={(newRecords) => setRecords(newRecords)}
/>
```

### 2. Panel de Delegado (Nueva Tab)

Agregar a `client/pages/TournamentDetail.tsx`:

```tsx
{userRole === "DELEGADO_DEPORTES" && (
  <TabsContent value="mis_recordes" className="mt-8">
    <RecordsManagementPanel
      records={delegadoRecords}
      onEdit={handleEditRecord}
      onDownload={handleDownloadRecords}
    />
  </TabsContent>
)}
```

### 3. Panel de Admin (Nueva Tab en Inscripciones)

Agregar a `client/components/tournament/tabs/InscripcionesTab.tsx`:

```tsx
{/* Agregar tab */}
<TabsTrigger value="recordes">
  📄 Récords Deportivos
</TabsTrigger>

<TabsContent value="recordes" className="mt-8">
  <RecordsReviewPanel
    records={allTeamRecords}
    onApprove={handleApproveDocument}
    onReject={handleRejectDocument}
  />
</TabsContent>
```

## Flujo de Trabajo Completo

### Para Delegado Deportivo:

1. Inscribe jugadores en el modal de inscripción
2. Accede a "Gestionar Récords" 
3. Elige método de carga (Individual o Drive)
4. Si elige Individual:
   - Por cada jugador, sube los 5 documentos obligatorios
   - Valida formato y tamaño
   - Completa el proceso para cada jugador
5. Si elige Drive:
   - Organiza carpetas en Google Drive según estructura requerida
   - Pega el enlace en el modal
   - Sistema valida automáticamente
6. Envía inscripción
7. Recibe notificación cuando admin aprueba/rechaza documentos

### Para Administrador:

1. En tab "Récords Deportivos"
2. Filtra por facultad, estado, método de carga
3. Para cada jugador:
   - Revisa documentos
   - Aprueba documentos válidos
   - Rechaza documentos con motivo
4. Puede:
   - Seleccionar múltiples registros
   - Aprobar todos de una vez
   - Descargar documentos
   - Agregar comentarios

### Para Estudiante:

1. En su perfil en "Mis Récords Deportivos"
2. Ve estado de cada documento (Pendiente/Aprobado/Rechazado)
3. Puede descargar constancia de aprobación

## Funcionalidades Futures

Los siguientes elementos fueron diseñados pero requieren implementación adicional:

- [ ] **Google Drive API Integration**: Requiere OAuth 2.0 y lectura de estructura
- [ ] **Email Notifications**: Sistema de notificaciones por correo
- [ ] **Storage Backend**: Integración con AWS S3 o Google Cloud Storage
- [ ] **Antivirus Scanning**: Validación de archivos subidos
- [ ] **PDF Preview**: Visor de PDFs integrado
- [ ] **Historial de Versiones**: Tracking de cambios de documentos
- [ ] **Reportes Exportables**: Dashboard con estadísticas exportables

## Consideraciones de Seguridad

- Los archivos se validan por formato y tamaño
- Se recomienda implementar:
  - Validación de virus en archivos subidos
  - Cifrado de archivos en reposo (AES-256)
  - Control de acceso basado en roles
  - Logs de auditoría de todos los cambios

## Styling y Responsive Design

- Todos los componentes son completamente responsivos
- Desktop: 3-4 columnas para grillas
- Tablet: 2 columnas
- Mobile: 1 columna (lista vertical)
- Colores institucionales: Verde UNAS (#00873E)
- Iconografía: Lucide Icons

## Próximos Pasos

1. **Integración de Google Drive API**: Validación automática de estructura
2. **Backend Storage**: Configurar AWS S3 o equivalente
3. **Email Service**: Implementar notificaciones por correo
4. **Visor de Documentos**: Preview de PDFs e imágenes
5. **Dashboard de Reportes**: Estadísticas y exportación

## Soporte

Para preguntas sobre la implementación, revisar:
- `shared/api.ts` para tipos
- Comentarios en componentes
- Esta guía de implementación
