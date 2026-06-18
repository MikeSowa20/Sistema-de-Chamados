import { FaRegClock, FaReply } from "react-icons/fa";
import RichTextView from "../../../../../commum/RichTextView";
import type { Chamado,RespostaChamado } from "./types";

interface ChamadoUserProps {
    chamado: Chamado;
    formatarDataAbertura: (data: string) => string;
    abrirRespostaUsuario: (chamado: Chamado) => void;
}

export default function ChamadoUser({
    chamado,
    formatarDataAbertura,
    abrirRespostaUsuario
}: ChamadoUserProps) {

    function formatarStatus(status: string) {
        switch (status) {
            case "aberto":
                return "Aberto";
            case "resolvido":
                return "Resolvido";
            case "encerrado":
                return "Encerrado";
            default:
                return status;
        }
    }

    function statusClasses(status: string) {
        switch (status) {
            case "aberto":
                return "bg-yellow-100 text-yellow-800";
            case "resolvido":
                return "bg-blue-100 text-blue-800";
            case "encerrado":
                return "bg-green-100 text-green-800";
            default:
                return "";
        }
    }
    const ultimaRespostaAdmin = (chamado: Chamado) => {
        return chamado.respostas
            .filter((resposta) => resposta.tipo_autor === "admin")
            .at(-1);
    }

    const chamadoEstaFinalizado = (chamado: Chamado) => {
        return chamado.status === "encerrado" || chamado.status === "resolvido";
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
    const formatarAutor = (resposta: RespostaChamado) => {
    if (resposta.tipo_autor === "admin") return "Atendimento";

    return resposta.usuario_nome ?? "Você";
}

    return (
        <div>

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
        </div>
    )
}