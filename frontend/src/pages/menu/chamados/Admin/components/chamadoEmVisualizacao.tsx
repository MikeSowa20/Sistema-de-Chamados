import type { ChamadoEmVisualizacaoProps } from "../types/types";
import {
    FaReply,
    FaTimes,
    FaUserCircle,
} from "react-icons/fa";
import RichTextView from "../../../../../commum/RichTextView";

export default function ChamadoEmVisualizacao({
    chamadoEmVisualizacao,
    setChamadoVisualizando,
    abrirFormularioResposta,
    statusClasses,
    urgenciaClasses,
    formatarTexto,
    formatarData,
    formatarAutor,
}: ChamadoEmVisualizacaoProps) {
    return (
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
    )
}