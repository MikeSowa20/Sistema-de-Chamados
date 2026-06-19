import { useEffect, useMemo, useState, type FormEvent } from "react"
import { FaEye, FaPaperPlane, FaRegClock, FaReply, FaTimes, FaUserCircle } from "react-icons/fa";
import Mensagem from "../../../../commum/mensagem";
import api from "../../../../api"
import RichTextEditor from "../../../../commum/RichTextEditor";
import RichTextView from "../../../../commum/RichTextView";
import { isRichTextEmpty, sanitizeRichText } from "../../../../commum/richText";

interface chamadosAdminProps{
    nome:string | undefined
    user_id:number | undefined
}

interface RespostaChamado {
    id: number;
    chamado_id: number;
    usuario_id: number;
    mensagem: string;
    tipo_autor: string;
    criado_em: string;
    usuario_nome: string | null;
    usuario_email: string | null;
}

interface ChamadoAdmin {
    id: number;
    titulo: string;
    corpo: string;
    urgencia: string;
    status: string;
    fechado_em: string | null;
    reaberto_em: string | null;
    quantidade_reaberturas: number;
    usuario_id: number;
    admin_id: number | null;
    resposta: string | null;
    atualizado_em: string | null;
    criado_em: string;
    usuario_nome: string | null;
    usuario_email: string | null;
    respostas: RespostaChamado[];
}

const formatarData = (data: string | null) => {
    if (!data) return "Não informado";

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
        return "Não informado";
    }

    return dataFormatada.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const formatarTexto = (texto: string) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const formatarAutor = (resposta: RespostaChamado) => {
    if (resposta.tipo_autor === "admin") return "Atendimento";

    return resposta.usuario_nome ?? "Usuário";
}

const statusChamado = [
    { value: "aberto", label: "Aberto" },
    { value: "resolvido", label: "Resolvido" },
    { value: "encerrado", label: "Encerrado" },
];

const statusClasses = (status: string) => {
    const estilos: Record<string, string> = {
        aberto: "border-teal-200 bg-teal-50 text-teal-800",
        resolvido: "border-emerald-200 bg-emerald-50 text-emerald-800",
        encerrado: "border-gray-300 bg-gray-100 text-gray-700",
    };

    return estilos[status] ?? "border-gray-200 bg-gray-50 text-gray-700";
}

const urgenciaClasses = (urgencia: string) => {
    const estilos: Record<string, string> = {
        baixa: "border-sky-200 bg-sky-50 text-sky-800",
        media: "border-amber-200 bg-amber-50 text-amber-800",
        alta: "border-orange-200 bg-orange-50 text-orange-800",
        urgente: "border-rose-200 bg-rose-50 text-rose-800",
    };

    return estilos[urgencia] ?? "border-gray-200 bg-gray-50 text-gray-700";
}

const ultimaMensagem = (chamado: ChamadoAdmin) => {
    return chamado.respostas.at(-1);
}

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

const filtrosUrgencia = [
    { value: "todos", label: "Todas as urgências" },
    { value: "baixa", label: "Baixa" },
    { value: "media", label: "Média" },
    { value: "alta", label: "Alta" },
    { value: "urgente", label: "Urgente" },
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

export default function ChamadosAdmin({nome, user_id}:chamadosAdminProps){
    const [chamados, setChamados] = useState<ChamadoAdmin[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [statusVisivel, setStatusVisivel] = useState("aberto");
    const [periodo, setPeriodo] = useState("mes");
    const [inicioPersonalizado, setInicioPersonalizado] = useState(formatarDataInput(somarDias(new Date(), -7)));
    const [fimPersonalizado, setFimPersonalizado] = useState(hojeInput());
    const [filtroUrgencia, setFiltroUrgencia] = useState("todos");
    const [chamadoRespondendo, setChamadoRespondendo] = useState<number | null>(null);
    const [respostas, setRespostas] = useState<Record<number, string>>({});
    const [statusEditando, setStatusEditando] = useState<Record<number, string>>({});
    const [salvandoId, setSalvandoId] = useState<number | null>(null);
    const [mensagem, setMensagem] = useState("");
    const [type, setType] = useState<"success" | "error" | null>(null);
    const [chamadoVisualizando, setChamadoVisualizando] = useState<number | null>(null);
    const chamadoSelecionado = chamados.find((chamado) => chamado.id === chamadoRespondendo);
    const chamadoEmVisualizacao = chamados.find((chamado) => chamado.id === chamadoVisualizando);
    const chamadosFiltrados = chamados.filter((chamado) => chamado.status === statusVisivel);
    const statusAtual = statusChamado.find((status) => status.value === statusVisivel);
    const labelStatusAtual = statusAtual?.label.toLowerCase() ?? "selecionado";
    const intervalo = useMemo(() => (
        obterIntervalo(periodo, inicioPersonalizado, fimPersonalizado)
    ), [periodo, inicioPersonalizado, fimPersonalizado]);
    const periodoAtual = periodos.find((item) => item.id === periodo)?.label ?? "Período";
    const filtroAtual = filtrosUrgencia.find((item) => item.value === filtroUrgencia)?.label ?? "Todas as urgências";

    const carregarChamados = async () => {
        try{
            const response = await api.get(
                `/menu/chamados/admin/atualizar?data_inicio=${intervalo.dataInicio}&data_fim=${intervalo.dataFim}&filtro=${filtroUrgencia}`
            )
            setChamados(response.data.chamados ?? []);
        }catch(error){
            console.error(error)
        }finally{
            setCarregando(false);
        }
    }

    useEffect(()=>{
        carregarChamados()
    },[intervalo.dataInicio, intervalo.dataFim, filtroUrgencia])

    useEffect(() => {
        if (!mensagem) return;

        const intervalo = setTimeout(() => {
            setMensagem("");
            setType(null);
        }, 3000);

        return () => clearTimeout(intervalo);
    }, [mensagem]);

    const abrirFormularioResposta = (chamado: ChamadoAdmin) => {
        setChamadoRespondendo((idAtual) => idAtual === chamado.id ? null : chamado.id);
        setStatusEditando((statusAtual) => ({
            ...statusAtual,
            [chamado.id]: statusAtual[chamado.id] ?? chamado.status,
        }));
    }

    const responderChamado = async (event: FormEvent<HTMLFormElement>, chamado: ChamadoAdmin) => {
        event.preventDefault();

        if (!user_id) {
            setType("error");
            setMensagem("Administrador não identificado.");
            return;
        }

        const textoResposta = sanitizeRichText(respostas[chamado.id] ?? "");
        const novoStatus = statusEditando[chamado.id] ?? chamado.status;

        if (isRichTextEmpty(textoResposta) && novoStatus === chamado.status) {
            setType("error");
            setMensagem("Escreva uma resposta ou altere o status.");
            return;
        }

        try {
            setSalvandoId(chamado.id);

            const response = await api.post(`/menu/chamados/admin/responder/${chamado.id}`, {
                admin_id: user_id,
                mensagem: textoResposta,
                status: novoStatus,
            });

            setChamados((chamadosAtuais) => chamadosAtuais.map((item) => (
                item.id === chamado.id ? response.data.chamado : item
            )));
            setRespostas((respostasAtuais) => ({
                ...respostasAtuais,
                [chamado.id]: "",
            }));
            setChamadoRespondendo(null);
            setType(response.data.type);
            setMensagem(response.data.mensagem);
        } catch (error) {
            console.error(error);
            setType("error");
            setMensagem("Erro ao responder chamado.");
        } finally {
            setSalvandoId(null);
        }
    }

    const renderizarChamado = (chamado: ChamadoAdmin) => (
        <div key={chamado.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid gap-4 xl:grid-cols-[minmax(260px,1.1fr)_minmax(280px,1.4fr)_minmax(220px,0.8fr)_auto] xl:items-start">
                <div className="min-w-0">
                    <h3 className="font-bold text-gray-950">{chamado.titulo}</h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <FaUserCircle />
                        {chamado.usuario_nome ?? "Usuário não informado"} - {chamado.usuario_email ?? "E-mail não informado"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className={`border px-2 py-1 text-xs font-bold ${statusClasses(chamado.status)}`}>
                            {formatarTexto(chamado.status)}
                        </span>
                        <span className={`border px-2 py-1 text-xs font-bold ${urgenciaClasses(chamado.urgencia)}`}>
                            {formatarTexto(chamado.urgencia)}
                        </span>
                    </div>
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase text-gray-400">Descrição</p>
                    <RichTextView html={chamado.corpo} className="mt-1 line-clamp-2 text-sm leading-6 text-gray-700" />

                    {ultimaMensagem(chamado) && (
                        <div className="mt-3 border-t border-gray-100 pt-3">
                            <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                                <span className="font-bold text-gray-700">Última mensagem: {formatarAutor(ultimaMensagem(chamado)!)}</span>
                                <span>{chamado.respostas.length}</span>
                            </div>
                            <RichTextView html={ultimaMensagem(chamado)!.mensagem} className="mt-1 line-clamp-1 text-sm leading-6 text-gray-600" />
                        </div>
                    )}
                </div>

                <div className="grid gap-2 text-xs text-gray-600 sm:grid-cols-2 xl:grid-cols-1">
                    <p className="flex items-center gap-2"><FaRegClock /> Aberto: {formatarData(chamado.criado_em)}</p>
                    <p>Atualizado: {formatarData(chamado.atualizado_em)}</p>
                    <p>Fechado: {formatarData(chamado.fechado_em)}</p>
                    <p>Reaberturas: {chamado.quantidade_reaberturas}</p>
                </div>

                <div className="flex flex-wrap justify-end gap-2 xl:flex-col">
                    <button
                        type="button"
                        onClick={() => setChamadoVisualizando(chamado.id)}
                        className="flex items-center justify-center gap-2 border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-950"
                    >
                        <FaEye />
                        Ver
                    </button>
                    <button
                        type="button"
                        onClick={() => abrirFormularioResposta(chamado)}
                        className="flex items-center justify-center gap-2 bg-teal-700 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-800"
                    >
                        <FaReply />
                        Responder
                    </button>
                </div>
            </div>
        </div>
    );

    return(
        <div className="space-y-6">
            {mensagem && <Mensagem mensagem={mensagem} type={type} />}

            <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <p className="text-sm font-bold text-teal-700">Olá, {nome}</p>
                    <h1 className="text-2xl font-bold text-gray-950">Painel de chamados</h1>
                    <p className="text-sm text-gray-500">Abertos aparecem sempre; resolvidos e encerrados respeitam o período escolhido.</p>
                </div>

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
            </div>

            <div className="space-y-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-950">Fila de atendimento</h2>
                        <p className="text-sm text-gray-500">
                            Exibindo: {statusAtual?.label ?? "Chamados"} | {periodoAtual}: {formatarDataTela(intervalo.dataInicio)} até {formatarDataTela(intervalo.dataFim)} | {filtroAtual}
                        </p>
                    </div>
                    <span className="border border-gray-200 bg-white px-3 py-1 text-sm font-bold text-gray-600">
                        {chamados.length}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {statusChamado.map((status) => {
                        const quantidade = chamados.filter((chamado) => chamado.status === status.value).length;
                        const ativo = status.value === statusVisivel;

                        return (
                            <button
                                key={status.value}
                                type="button"
                                onClick={() => setStatusVisivel(status.value)}
                                className={`border px-4 py-2 text-sm font-bold transition-colors ${ativo ? "border-teal-700 bg-teal-700 text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-950"}`}
                            >
                                {status.label}
                                <span className={`ml-2 px-2 py-0.5 text-xs ${ativo ? "bg-white text-teal-800" : statusClasses(status.value)}`}>
                                    {quantidade}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {carregando ? (
                    <div className="border border-gray-200 bg-white p-6 text-sm font-bold text-gray-600">Carregando chamados...</div>
                ) : chamados.length === 0 ? (
                    <div className="border border-dashed border-gray-300 bg-white p-8 text-center">
                        <p className="font-bold text-gray-800">Nenhum chamado registrado.</p>
                        <p className="mt-1 text-sm text-gray-500">Quando usuários abrirem solicitações, elas aparecerão aqui.</p>
                    </div>
                ) : chamadosFiltrados.length === 0 ? (
                    <div className="border border-dashed border-gray-300 bg-white p-8 text-center">
                        <p className="font-bold text-gray-800">Nenhum chamado {labelStatusAtual}.</p>
                        <p className="mt-1 text-sm text-gray-500">Use os filtros acima para alternar entre as listas.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {chamadosFiltrados.map((chamado) => renderizarChamado(chamado))}
                    </div>
                )}
            </div>

            {chamadoEmVisualizacao && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-3">
                    <div className="flex h-[92vh] w-[96vw] max-w-7xl flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-4 border-b border-gray-200 bg-gray-50 p-5">
                            <div className="min-w-0">
                                <div className="mb-2 flex flex-wrap gap-2">
                                    <span className={`border px-2 py-1 text-xs font-bold ${statusClasses(chamadoEmVisualizacao.status)}`}>
                                        {formatarTexto(chamadoEmVisualizacao.status)}
                                    </span>
                                    <span className={`border px-2 py-1 text-xs font-bold ${urgenciaClasses(chamadoEmVisualizacao.urgencia)}`}>
                                        {formatarTexto(chamadoEmVisualizacao.urgencia)}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-950">{chamadoEmVisualizacao.titulo}</h2>
                                <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                    <FaUserCircle />
                                    {chamadoEmVisualizacao.usuario_nome ?? "Usuário não informado"} - {chamadoEmVisualizacao.usuario_email ?? "E-mail não informado"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setChamadoVisualizando(null)}
                                className="p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-950"
                                aria-label="Fechar modal"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="grid min-h-0 flex-1 gap-0 overflow-hidden lg:grid-cols-[minmax(0,1fr)_360px]">
                            <main className="overflow-y-auto p-5">
                                <section className="rounded-lg border border-gray-200 bg-white p-5">
                                    <h3 className="text-sm font-bold text-gray-950">Descrição do chamado</h3>
                                    <RichTextView html={chamadoEmVisualizacao.corpo} className="mt-3 text-sm leading-7 text-gray-700" />
                                </section>

                                <section className="mt-5 rounded-lg border border-gray-200 bg-white p-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-sm font-bold text-gray-950">Histórico de mensagens</h3>
                                        <span className="border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-bold text-gray-600">
                                            {chamadoEmVisualizacao.respostas.length}
                                        </span>
                                    </div>

                                    {chamadoEmVisualizacao.respostas.length === 0 ? (
                                        <p className="mt-3 text-sm text-gray-500">Ainda não há mensagens neste chamado.</p>
                                    ) : (
                                        <div className="mt-4 space-y-3">
                                            {chamadoEmVisualizacao.respostas.map((resposta) => {
                                                const respostaAdmin = resposta.tipo_autor === "admin";

                                                return (
                                                    <div
                                                        key={resposta.id}
                                                        className={`border p-4 ${respostaAdmin ? "border-teal-200 bg-teal-50" : "border-gray-200 bg-gray-50"}`}
                                                    >
                                                        <div className="flex flex-col gap-1 text-xs text-gray-600 md:flex-row md:items-center md:justify-between">
                                                            <span className="font-bold text-gray-800">{formatarAutor(resposta)}</span>
                                                            <span>{formatarData(resposta.criado_em)}</span>
                                                        </div>
                                                        <RichTextView html={resposta.mensagem} className="mt-2 text-sm leading-7 text-gray-700" />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </section>
                            </main>

                            <aside className="overflow-y-auto border-t border-gray-200 bg-gray-50 p-5 lg:border-l lg:border-t-0">
                                <h3 className="text-sm font-bold text-gray-950">Detalhes</h3>
                                <div className="mt-4 space-y-3 text-sm text-gray-600">
                                    <div className="border border-gray-200 bg-white p-3">
                                        <p className="text-xs font-bold uppercase text-gray-400">Aberto em</p>
                                        <p className="mt-1 text-gray-800">{formatarData(chamadoEmVisualizacao.criado_em)}</p>
                                    </div>
                                    <div className="border border-gray-200 bg-white p-3">
                                        <p className="text-xs font-bold uppercase text-gray-400">Atualizado em</p>
                                        <p className="mt-1 text-gray-800">{formatarData(chamadoEmVisualizacao.atualizado_em)}</p>
                                    </div>
                                    <div className="border border-gray-200 bg-white p-3">
                                        <p className="text-xs font-bold uppercase text-gray-400">Fechado em</p>
                                        <p className="mt-1 text-gray-800">{formatarData(chamadoEmVisualizacao.fechado_em)}</p>
                                    </div>
                                    <div className="border border-gray-200 bg-white p-3">
                                        <p className="text-xs font-bold uppercase text-gray-400">Reaberto em</p>
                                        <p className="mt-1 text-gray-800">{formatarData(chamadoEmVisualizacao.reaberto_em)}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="border border-gray-200 bg-white p-3">
                                            <p className="text-xs font-bold uppercase text-gray-400">Reaberturas</p>
                                            <p className="mt-1 text-gray-800">{chamadoEmVisualizacao.quantidade_reaberturas}</p>
                                        </div>
                                        <div className="border border-gray-200 bg-white p-3">
                                            <p className="text-xs font-bold uppercase text-gray-400">Usuário</p>
                                            <p className="mt-1 text-gray-800">#{chamadoEmVisualizacao.usuario_id}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setChamadoVisualizando(null);
                                        abrirFormularioResposta(chamadoEmVisualizacao);
                                    }}
                                    className="mt-5 flex w-full items-center justify-center gap-2 bg-teal-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-800"
                                >
                                    <FaReply />
                                    Responder chamado
                                </button>
                            </aside>
                        </div>
                    </div>
                </div>
            )}

            {chamadoSelecionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-3 border-b border-gray-200 bg-gray-50 p-5">
                            <div>
                                <h2 className="text-lg font-bold text-gray-950">Responder chamado</h2>
                                <p className="text-sm text-gray-600">{chamadoSelecionado.titulo}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setChamadoRespondendo(null)}
                                className="p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-950"
                                aria-label="Fechar modal"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={(event) => responderChamado(event, chamadoSelecionado)} className="space-y-4 p-5">
                            <div>
                                <label htmlFor={`status-${chamadoSelecionado.id}`} className="block text-sm font-bold text-gray-800">
                                    Status do chamado
                                </label>
                                <select
                                    id={`status-${chamadoSelecionado.id}`}
                                    value={statusEditando[chamadoSelecionado.id] ?? chamadoSelecionado.status}
                                    onChange={(event) => setStatusEditando((statusAtual) => ({
                                        ...statusAtual,
                                        [chamadoSelecionado.id]: event.target.value,
                                    }))}
                                    className="mt-1 w-full border border-gray-300 bg-white p-2 text-gray-900 focus:border-teal-700 focus:outline-0"
                                >
                                    {statusChamado.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor={`resposta-${chamadoSelecionado.id}`} className="block text-sm font-bold text-gray-800">
                                    Resposta
                                </label>
                                <div className="mt-1">
                                    <RichTextEditor
                                    value={respostas[chamadoSelecionado.id] ?? ""}
                                    placeholder="Escreva a resposta para o usuário"
                                    onChange={(conteudo) => setRespostas((respostasAtuais) => ({
                                        ...respostasAtuais,
                                        [chamadoSelecionado.id]: conteudo,
                                    }))}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setChamadoRespondendo(null)}
                                    className="bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvandoId === chamadoSelecionado.id}
                                    className="flex items-center gap-2 bg-teal-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    <FaPaperPlane />
                                    {salvandoId === chamadoSelecionado.id ? "Salvando..." : "Salvar resposta"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
