/**
 * Componentes de estado de carga y error
 * Componentes reutilizables para estados de UI
 */
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * Skeleton Loader genérico
 */
export function SkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-32 w-full" />
      ))}
    </div>
  );
}

/**
 * Loading Spinner
 */
export function LoadingSpinner({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground font-medium">{message}</p>
    </div>
  );
}

/**
 * Estado de error con opción de retry
 */
export function ErrorState({
  error,
  onRetry,
  title = 'Error al cargar datos',
}: {
  error?: Error | null;
  onRetry?: () => void;
  title?: string;
}) {
  return (
    <Alert variant="destructive" className="my-8">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="font-bold">{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {error?.message || 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'}
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mt-4 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Estado vacío (sin datos)
 */
export function EmptyState({
  icon: Icon = AlertCircle,
  title = 'No hay datos',
  description = 'No se encontraron resultados.',
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="default">
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * Estado de "No encontrado"
 */
export function NotFoundState({
  title = 'No encontrado',
  description = 'El recurso que buscas no existe o fue eliminado.',
  backUrl = '/',
  backLabel = 'Volver al inicio',
}: {
  title?: string;
  description?: string;
  backUrl?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="text-8xl font-bold text-primary mb-4">404</div>
      <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8 max-w-md">{description}</p>
      <Button asChild>
        <a href={backUrl}>{backLabel}</a>
      </Button>
    </div>
  );
}

/**
 * Skeleton para tarjetas de torneos
 */
export function TournamentCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-border animate-pulse">
          <div className="flex justify-between items-start mb-6">
            <div className="h-8 bg-gray-200 rounded-full w-24" />
            <div className="h-6 bg-gray-200 rounded w-16" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-6" />
          <div className="flex gap-4 mb-6">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
      ))}
    </div>
  );
}
