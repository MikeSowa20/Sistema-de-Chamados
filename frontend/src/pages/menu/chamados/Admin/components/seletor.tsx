import type { SeletorProps } from "../types/types"


export default function Seletor({
    periodo,
    setPeriodo,
    filtroUrgencia,
    setFiltroUrgencia,
    inicioPersonalizado,
    setInicioPersonalizado,
    fimPersonalizado,
    setFimPersonalizado,
    periodos,
    filtrosUrgencia,
}: SeletorProps){
    
    return (
        <div className="flex flex-col gap-2 md:flex-row md:items-end">
            <div>
                <label htmlFor="periodo-chamados" className="block text-xs font-bold uppercase text-gray-500">
                    Período
                </label>
                <select
                    id="periodo-chamados"
                    value={periodo}
                    onChange={(event) => setPeriodo(event.target.value)}
                    className="mt-1 min-w-48 border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-800 focus:border-teal-700 focus:outline-0"
                >
                    {periodos.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="filtro-urgencia" className="block text-xs font-bold uppercase text-gray-500">
                    Urgência
                </label>
                <select
                    id="filtro-urgencia"
                    value={filtroUrgencia}
                    onChange={(event) => setFiltroUrgencia(event.target.value)}
                    className="mt-1 min-w-44 border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-800 focus:border-teal-700 focus:outline-0"
                >
                    {filtrosUrgencia.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </div>

            {periodo === "custom" && (
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label htmlFor="chamados-data-inicio" className="block text-xs font-bold uppercase text-gray-500">
                            De
                        </label>
                        <input
                            id="chamados-data-inicio"
                            type="date"
                            value={inicioPersonalizado}
                            onChange={(event) => setInicioPersonalizado(event.target.value)}
                            className="mt-1 w-40 border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-800 focus:border-teal-700 focus:outline-0"
                        />
                    </div>
                    <div>
                        <label htmlFor="chamados-data-fim" className="block text-xs font-bold uppercase text-gray-500">
                            Até
                        </label>
                        <input
                            id="chamados-data-fim"
                            type="date"
                            value={fimPersonalizado}
                            onChange={(event) => setFimPersonalizado(event.target.value)}
                            className="mt-1 w-40 border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-800 focus:border-teal-700 focus:outline-0"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}