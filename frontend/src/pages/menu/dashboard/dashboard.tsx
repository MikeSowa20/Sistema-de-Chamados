export default function Dashboard(){
    return(
        <div className="space-y-6">
            <div className="flex flex-col gap-2 border-b border-gray-200 pb-5">
                <p className="text-sm font-bold text-teal-700">Admin</p>
                <h1 className="text-2xl font-bold text-gray-950">Dashboard</h1>
                <p className="text-sm text-gray-500">Área preparada para os indicadores do sistema.</p>
            </div>

            <div className="border border-dashed border-gray-300 bg-white p-8 text-center">
                <p className="font-bold text-gray-800">Dashboard em preparação.</p>
                <p className="mt-1 text-sm text-gray-500">A integração será feita depois que o backend estiver pronto.</p>
            </div>
        </div>
    )
}
