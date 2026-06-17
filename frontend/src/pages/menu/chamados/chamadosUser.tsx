import { useEffect, useState, type FormEvent } from "react";
import { FaPaperPlane, FaPlus, FaRegClock, FaReply, FaTimes } from "react-icons/fa";
import Buttom from "../../../commum/buttom";
import Mensagem from "../../../commum/mensagem";
import api from "../../../api";
import RichTextEditor from "../../../commum/RichTextEditor";
import RichTextView from "../../../commum/RichTextView";
import { isRichTextEmpty, sanitizeRichText } from "../../../commum/richText";

interface chamadosUserProps{
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

interface Chamado {
    id: number;
    titulo: string;
    corpo: string;
    urgencia: string;
    status: string;
    criado_em: string;
    respostas: RespostaChamado[];
}

const formatarDataAbertura = (data: string) => {
    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
        return "Horário não informado";
    }

    return dataFormatada.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const formatarStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

const formatarAutor = (resposta: RespostaChamado) => {
    if (resposta.tipo_autor === "admin") return "Atendimento";

    return resposta.usuario_nome ?? "Você";
}

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

export default function ChamadosUser({nome,user_id}:chamadosUserProps){
    const [formAberto, setFormAberto] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [corpo, setCorpo] = useState("");
    const [urgencia, setUrgencia] = useState("baixa");
    const [chamados, setChamados] = useState<Chamado[]>([]);
    const [mensagem, setMensagem] = useState("");
    const [type, setType] = useState<"success" | "error" | null>(null);
    const [chamadoRespondendo, setChamadoRespondendo] = useState<number | null>(null);
    const [respostaUsuario, setRespostaUsuario] = useState("");
    const [salvandoResposta, setSalvandoResposta] = useState(false);
    const chamadoSelecionado = chamados.find((chamado) => chamado.id === chamadoRespondendo);

    useEffect(() => {
        if (!mensagem) return;

        const intervalo = setTimeout(() => {
            setMensagem("");
            setType(null);
        }, 3000);

        return () => clearTimeout(intervalo);
    }, [mensagem]);

    const limparFormulario = () => {
        setTitulo("");
        setCorpo("");
        setUrgencia("baixa");
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const corpoLimpo = sanitizeRichText(corpo);

        if (!titulo.trim() || isRichTextEmpty(corpoLimpo)) {
            setType("error");
            setMensagem("Preencha o título e a descrição do chamado");
            return;
        }

        if (!user_id) {
            setType("error");
            setMensagem("Usuário não identificado");
            return;
        }

        try{
            const response = await api.post(`/menu/chamados/abrir-chamados/${user_id}`, {
                titulo,
                corpo: corpoLimpo,
                urgencia,
            })

            setChamados(prev => [
                {
                    id: Date.now(),
                    titulo,
                    corpo: corpoLimpo,
                    urgencia,
                    status: "aberto",
                    criado_em: new Date().toISOString(),
                    respostas: [],
                },
                ...prev,
            ]);

            limparFormulario();
            setFormAberto(false);
            setType(response.data.type);
            setMensagem(response.data.mensagem);
        }catch(error){
            console.error(error)
            setType("error");
            setMensagem("Erro ao abrir chamado");
        }
    }

    const AtualizarChamados = async () => {
        if (!user_id) return;

        try{
            const response = await api.get(`/menu/chamados/atualizar/${user_id}`)
            setChamados(response.data.chamados ?? []);
        }catch(error){
            console.error(error)
        }
    }

    useEffect(()=>{
        AtualizarChamados()
    },[user_id])

    const ultimaRespostaAdmin = (chamado: Chamado) => {
        return chamado.respostas
            .filter((resposta) => resposta.tipo_autor === "admin")
            .at(-1);
    }

    const chamadoEstaFinalizado = (chamado: Chamado) => {
        return chamado.status === "encerrado" || chamado.status === "resolvido";
    }

    const abrirRespostaUsuario = (chamado: Chamado) => {
        setChamadoRespondendo(chamado.id);
        setRespostaUsuario("");
    }

    const fecharRespostaUsuario = () => {
        setChamadoRespondendo(null);
        setRespostaUsuario("");
    }

    const responderChamado = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user_id || !chamadoSelecionado) {
            setType("error");
            setMensagem("Usuário ou chamado não identificado.");
            return;
        }

        const respostaLimpa = sanitizeRichText(respostaUsuario);

        if (isRichTextEmpty(respostaLimpa)) {
            setType("error");
            setMensagem("Escreva uma mensagem para responder.");
            return;
        }

        try {
            setSalvandoResposta(true);

            const response = await api.post(`/menu/chamados/responder/${chamadoSelecionado.id}`, {
                usuario_id: user_id,
                mensagem: respostaLimpa,
            });

            setChamados((chamadosAtuais) => chamadosAtuais.map((chamado) => (
                chamado.id === chamadoSelecionado.id ? response.data.chamado : chamado
            )));
            fecharRespostaUsuario();
            setType(response.data.type);
            setMensagem(response.data.mensagem);
        } catch (error) {
            console.error(error);
            setType("error");
            setMensagem("Erro ao responder chamado.");
        } finally {
            setSalvandoResposta(false);
        }
    }

    return(
        <div className="space-y-6">
            {mensagem && <Mensagem mensagem={mensagem} type={type} />}

            <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm font-bold text-teal-700">Olá, {nome}</p>
                    <h1 className="text-2xl font-bold text-gray-950">Meus chamados</h1>
                    <p className="text-sm text-gray-500">Acompanhe solicitações, respostas e reaberturas em um só lugar.</p>
                </div>

                <button
                    type="button"
                    onClick={() => setFormAberto(!formAberto)}
                    className="flex items-center justify-center gap-2 bg-teal-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-800"
                >
                    {formAberto ? <FaTimes /> : <FaPlus />}
                    Abrir chamado
                </button>
            </div>

            {formAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-5">
                            <div>
                                <h2 className="text-lg font-bold text-gray-950">Abrir chamado</h2>
                                <p className="text-sm text-gray-500">Descreva o problema para o atendimento priorizar corretamente.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormAberto(false)}
                                className="p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-950"
                                aria-label="Fechar modal"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label htmlFor="titulo" className="block text-sm font-bold text-gray-800">
                                    Título do chamado:
                                </label>
                                <input
                                    id="titulo"
                                    type="text"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    placeholder="Ex: Computador não liga"
                                    className="mt-1 w-full border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-teal-700 focus:outline-0"
                                />
                            </div>

                            <div>
                                <label htmlFor="corpo" className="block text-sm font-bold text-gray-800">
                                    Descrição:
                                </label>
                                <div className="mt-1">
                                    <RichTextEditor
                                    value={corpo}
                                    placeholder="Descreva o problema com detalhes"
                                    onChange={setCorpo}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="urgencia" className="block text-sm font-bold text-gray-800">
                                    Nível de urgência:
                                </label>
                                <select
                                    id="urgencia"
                                    value={urgencia}
                                    onChange={(e) => setUrgencia(e.target.value)}
                                    className="mt-1 w-full border border-gray-300 bg-white p-2 text-gray-900 focus:border-teal-700 focus:outline-0"
                                >
                                    <option value="baixa">Baixa</option>
                                    <option value="media">Média</option>
                                    <option value="alta">Alta</option>
                                    <option value="urgente">Urgente</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                                <Buttom
                                    type="button"
                                    text="Cancelar"
                                    className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    onClick={() => {
                                        limparFormulario();
                                        setFormAberto(false);
                                    }}
                                />
                                <Buttom
                                    type="submit"
                                    text="Enviar chamado"
                                    className="bg-teal-700 hover:bg-teal-800"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-950">Solicitações recentes</h2>
                    <span className="border border-gray-200 bg-white px-3 py-1 text-sm font-bold text-gray-600">
                        {chamados.length}
                    </span>
                </div>

                {chamados.length === 0 ? (
                    <div className="border border-dashed border-gray-300 bg-white p-8 text-center">
                        <p className="font-bold text-gray-800">Nenhum chamado aberto.</p>
                        <p className="mt-1 text-sm text-gray-500">Quando você abrir uma solicitação, ela aparecerá aqui.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {chamados.map((chamado) => (
                            <div key={chamado.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-950">{chamado.titulo}</h3>
                                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                            <FaRegClock />
                                            Aberto em {formatarDataAbertura(chamado.criado_em)}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`border px-2 py-1 text-xs font-bold ${statusClasses(chamado.status)}`}>
                                            {formatarStatus(chamado.status)}
                                        </span>
                                        <span className={`border px-2 py-1 text-xs font-bold ${urgenciaClasses(chamado.urgencia)}`}>
                                            {formatarStatus(chamado.urgencia)}
                                        </span>
                                    </div>
                                </div>
                                <RichTextView html={chamado.corpo} className="mt-3 text-sm leading-6 text-gray-700" />

                                {ultimaRespostaAdmin(chamado) && (
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => abrirRespostaUsuario(chamado)}
                                            className="flex items-center gap-2 bg-teal-700 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-800"
                                        >
                                            <FaReply />
                                            {chamadoEstaFinalizado(chamado) ? "Responder e reabrir" : "Responder"}
                                        </button>
                                    </div>
                                )}

                                {chamado.respostas.length > 0 && (
                                    <div className="mt-4 border-t border-gray-100 pt-4">
                                        <p className="text-sm font-bold text-gray-950">Histórico de mensagens</p>

                                        <div className="mt-3 space-y-2">
                                            {chamado.respostas.map((resposta) => {
                                                const respostaAdmin = resposta.tipo_autor === "admin";

                                                return (
                                                    <div
                                                        key={resposta.id}
                                                        className={`border p-3 ${respostaAdmin ? "border-teal-200 bg-teal-50" : "border-gray-200 bg-gray-50"}`}
                                                    >
                                                        <div className="flex flex-col gap-1 text-xs text-gray-600 md:flex-row md:items-center md:justify-between">
                                                            <span className="font-bold text-gray-800">
                                                                {formatarAutor(resposta)}
                                                            </span>
                                                            <span>{formatarDataAbertura(resposta.criado_em)}</span>
                                                        </div>
                                                        <RichTextView html={resposta.mensagem} className="mt-1 text-sm leading-6 text-gray-700" />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {chamadoSelecionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-3 border-b border-gray-200 bg-gray-50 p-5">
                            <div>
                                <h2 className="text-lg font-bold text-gray-950">
                                    {chamadoEstaFinalizado(chamadoSelecionado) ? "Responder e reabrir chamado" : "Responder chamado"}
                                </h2>
                                <p className="text-sm text-gray-600">{chamadoSelecionado.titulo}</p>
                            </div>
                            <button
                                type="button"
                                onClick={fecharRespostaUsuario}
                                className="p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-950"
                                aria-label="Fechar modal"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={responderChamado} className="space-y-4 p-5">
                            {ultimaRespostaAdmin(chamadoSelecionado) && (
                                <div className="border border-teal-200 bg-teal-50 p-3">
                                    <div className="flex flex-col gap-1 text-xs text-gray-600 md:flex-row md:items-center md:justify-between">
                                        <span className="font-bold text-gray-800">Última mensagem do atendimento</span>
                                        <span>{formatarDataAbertura(ultimaRespostaAdmin(chamadoSelecionado)!.criado_em)}</span>
                                    </div>
                                    <RichTextView html={ultimaRespostaAdmin(chamadoSelecionado)!.mensagem} className="mt-1 text-gray-700" />
                                </div>
                            )}

                            <div>
                                <label htmlFor={`resposta-usuario-${chamadoSelecionado.id}`} className="block text-sm font-bold text-gray-800">
                                    Sua resposta
                                </label>
                                <div className="mt-1">
                                    <RichTextEditor
                                    value={respostaUsuario}
                                    placeholder="Escreva sua resposta para o atendimento"
                                    onChange={setRespostaUsuario}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                                <button
                                    type="button"
                                    onClick={fecharRespostaUsuario}
                                    className="bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvandoResposta}
                                    className="flex items-center gap-2 bg-teal-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    <FaPaperPlane />
                                    {salvandoResposta ? "Enviando..." : chamadoEstaFinalizado(chamadoSelecionado) ? "Enviar e reabrir" : "Enviar resposta"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
