import { useMatches, useLiveMatches } from "@/hooks/useMatches";

export default function TestMatches() {
  const { data: allMatches, isLoading: isLoadingAll, error: errorAll } = useMatches();
  const { data: liveMatches, isLoading: isLoadingLive, error: errorLive } = useLiveMatches();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test de Partidos</h1>
      
      <div className="space-y-8">
        {/* All Matches */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Todos los Partidos</h2>
          {isLoadingAll && <p>Cargando...</p>}
          {errorAll && <p className="text-red-500">Error: {String(errorAll)}</p>}
          {allMatches && (
            <div>
              <p className="font-bold">Total: {allMatches.length} partidos</p>
              <pre className="text-xs bg-gray-100 p-2 mt-2 overflow-auto max-h-96">
                {JSON.stringify(allMatches, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Live Matches */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Partidos en Vivo</h2>
          {isLoadingLive && <p>Cargando...</p>}
          {errorLive && <p className="text-red-500">Error: {String(errorLive)}</p>}
          {liveMatches && (
            <div>
              <p className="font-bold">Total: {liveMatches.length} partidos</p>
              <pre className="text-xs bg-gray-100 p-2 mt-2 overflow-auto max-h-96">
                {JSON.stringify(liveMatches, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
