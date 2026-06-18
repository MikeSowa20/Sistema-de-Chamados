import { useEffect, useMemo, useState } from "react";
import { FaChartBar, FaCheckCircle, FaClock, FaExclamationTriangle, FaFolderOpen, FaRedo } from "react-icons/fa";
import api from "../../../api";

interface DashboardData {
    total: number;
    status: {
        abertos: number;
        encerrados: number;
        reabertos: number;
        resolvidos: number;
    };
    urgencia: {
        alta: number;
        baixa: number;
        media: number;
        urgente: number;
    };
}

const dadosVazios: DashboardData = {
    total: 0,
    status: {
        abertos: 0,
        encerrados: 0,
        reabertos: 0,
        resolvidos: 0,
    },
    urgencia: {
        alta: 0,
        baixa: 0,
        media: 0,
        urgente: 0,
    },
};

const formatarDataInput = (data: Date) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

const formatarDataTela = (data: string) => {
    if (!data) return "Não informado";

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
}

const somarDias = (data: Date, dias: number) => {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() + dias);

    return novaData;
}

const hojeInput = () => formatarDataInput(new Date());

const inicioMesInput = () => {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

    return formatarDataInput(inicioMes);
}

const periodos = [
    { id: "mes", label: "Deste mês" },
    { id: "hoje", label: "Hoje" },
    { id: "7", label: "Últimos 7 dias" },
    { id: "30", label: "Últimos 30 dias" },
    { id: "90", label: "Últimos 90 dias" },
    { id: "custom", label: "Personalizado" },
];

const obterIntervalo = (periodo: string, inicioPersonalizado: string, fimPersonalizado: string) => {
    const hoje = new Date();

    if (periodo === "mes") return { dataInicio: inicioMesInput(), dataFim: hojeInput() };
    if (periodo === "hoje") return { dataInicio: hojeInput(), dataFim: hojeInput() };
    if (periodo === "custom") return { dataInicio: inicioPersonalizado, dataFim: fimPersonalizado };

    return {
        dataInicio: formatarDataInput(somarDias(hoje, -Number(periodo))),
        dataFim: hojeInput(),
    };
}

const calcularPercentual = (valor: number, total: number) => {
    if (!total) return 0;

    return Math.min(100, Math.round((valor / total) * 100));
}

export default function Dashboard(){
    const [periodo, setPeriodo] = useState("mes");
    const [inicioPersonalizado, setInicioPersonalizado] = useState(formatarDataInput(somarDias(new Date(), -7)));
    const [fimPersonalizado, setFimPersonalizado] = useState(hojeInput());
    const [dados, setDados] = useState<DashboardData>(dadosVazios);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const intervalo = useMemo(() => (
        obterIntervalo(periodo, inicioPersonalizado, fimPersonalizado)
    ), [periodo, inicioPersonalizado, fimPersonalizado]);

    const periodoAtual = periodos.find((item) => item.id === periodo)?.label ?? "Período";

    const atualizarDashboard = async () => {
        try{
            setCarregando(true);
            setErro("");

            if (!intervalo.dataInicio || !intervalo.dataFim) {
                setDados(dadosVazios);
                setErro("Selecione a data inicial e a data final.");
                return;
            }

            const response = await api.get(
                `/dashboard/chamados?data_inicio=${intervalo.dataInicio}&data_fim=${intervalo.dataFim}`
            );

            setDados(response.data ?? dadosVazios);
        }catch(error){
            console.error(error);
            setErro("Erro ao carregar dados do dashboard.");
            setDados(dadosVazios);
        }finally{
            setCarregando(false);
        }
    }

    useEffect(() => {
        atualizarDashboard();
    }, [intervalo.dataInicio, intervalo.dataFim]);

    const cards = [
        {
            label: "Total",
            valor: dados.total,
            icon: <FaChartBar />,
            className: "bg-gray-950 text-white",
        },
        {
            label: "Abertos",
            valor: dados.status.abertos,
            icon: <FaFolderOpen />,
            className: "bg-teal-700 text-white",
        },
        {
            label: "Resolvidos",
            valor: dados.status.resolvidos,
            icon: <FaCheckCircle />,
            className: "bg-emerald-700 text-white",
        },
        {
            label: "Encerrados",
            valor: dados.status.encerrados,
            icon: <FaClock />,
            className: "bg-gray-700 text-white",
        },
        {
            label: "Reabertos",
            valor: dados.status.reabertos,
            icon: <FaRedo />,
            className: "bg-amber-600 text-white",
        },
    ];

    const statusResumo = [
        { label: "Abertos", valor: dados.status.abertos, color: "bg-teal-700" },
        { label: "Resolvidos", valor: dados.status.resolvidos, color: "bg-emerald-700" },
        { label: "Encerrados", valor: dados.status.encerrados, color: "bg-gray-700" },
        { label: "Reabertos", valor: dados.status.reabertos, color: "bg-amber-600" },
    ];

    const urgenciaResumo = [
        { label: "Urgente", valor: dados.urgencia.urgente, color: "bg-rose-700" },
        { label: "Alta", valor: dados.urgencia.alta, color: "bg-orange-600" },
        { label: "Média", valor: dados.urgencia.media, color: "bg-amber-500" },
        { label: "Baixa", valor: dados.urgencia.baixa, color: "bg-sky-600" },
    ];

    return(
        <div className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-bold text-teal-700">Admin</p>
                    <h1 className="text-2xl font-bold text-gray-950">Dashboard</h1>
                    <p className="text-sm text-gray-500">Indicadores de chamados por período.</p>
                </div>

                <div className="flex flex-col gap-2 md:flex-row md:items-end">
                    <div>
                        <label htmlFor="periodo" className="block text-xs font-bold uppercase text-gray-500">
                            Período
                        </label>
                        <select
                            id="periodo"
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

                    {periodo === "custom" && (
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label htmlFor="data-inicio" className="block text-xs font-bold uppercase text-gray-500">
                                    De
                                </label>
                                <input
                                    id="data-inicio"
                                    type="date"
                                    value={inicioPersonalizado}
                                    onChange={(event) => setInicioPersonalizado(event.target.value)}
                                    className="mt-1 w-40 border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-800 focus:border-teal-700 focus:outline-0"
                                />
                            </div>
                            <div>
                                <label htmlFor="data-fim" className="block text-xs font-bold uppercase text-gray-500">
                                    Até
                                </label>
                                <input
                                    id="data-fim"
                                    type="date"
                                    value={fimPersonalizado}
                                    onChange={(event) => setFimPersonalizado(event.target.value)}
                                    className="mt-1 w-40 border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-800 focus:border-teal-700 focus:outline-0"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span className="border border-gray-200 bg-white px-3 py-1 font-bold text-gray-800">{periodoAtual}</span>
                <span>Intervalo: {formatarDataTela(intervalo.dataInicio)} até {formatarDataTela(intervalo.dataFim)}</span>
            </div>

            {erro && (
                <div className="border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800">
                    {erro}
                </div>
            )}

            {carregando ? (
                <div className="border border-gray-200 bg-white p-6 text-sm font-bold text-gray-600">
                    Carregando dashboard...
                </div>
            ) : (
                <>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                        {cards.map((card) => (
                            <div key={card.label} className={`p-4 shadow-sm ${card.className}`}>
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-bold opacity-90">{card.label}</p>
                                    <span className="text-lg">{card.icon}</span>
                                </div>
                                <p className="mt-4 text-3xl font-bold">{card.valor}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="font-bold text-gray-950">Chamados por status</h2>
                                <span className="text-sm font-bold text-gray-500">{dados.total}</span>
                            </div>

                            <div className="mt-5 space-y-4">
                                {statusResumo.map((item) => {
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
                        </section>

                        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="font-bold text-gray-950">Chamados por urgência</h2>
                                <FaExclamationTriangle className="text-amber-500" />
                            </div>

                            <div className="mt-5 space-y-4">
                                {urgenciaResumo.map((item) => {
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
                        </section>
                    </div>
                </>
            )}
        </div>
    )
}
