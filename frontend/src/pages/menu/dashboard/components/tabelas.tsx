import type { Tabela} from "../types/type";

export default function Tabela({dados,config}:Tabela) {


    const calcularPercentual = (valor: number, total: number) => {
        if (!total) return 0;

        return Math.min(100, Math.round((valor / total) * 100));
    }

    return (
        <div>
            {config.map((item:any) => {
                const percentual = calcularPercentual(item.valor, dados.total);

                return (
                    <div key={item.label}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="font-bold text-gray-700">{item.label}</span>
                            <span className="text-gray-500">{item.valor}</span>
                        </div>
                        <div className="h-3 bg-gray-100">
                            <div className={`h-full ${item.color}`} style={{ width: `${percentual}%` }} />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}