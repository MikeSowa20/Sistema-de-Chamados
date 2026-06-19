import type { RenderizarChamadoProps } from "../types/types"
import { FaEye, FaRegClock, FaReply, FaUserCircle } from "react-icons/fa";
import RichTextView from "../../../../../commum/RichTextView";

export default function RenderizarChamado({
    chamado,
    setChamadoVisualizando,
    abrirFormularioResposta,
    statusClasses,
    urgenciaClasses,
    formatarTexto,
    formatarData,
    formatarAutor,
    ultimaMensagem,
}: RenderizarChamadoProps) {
    return (
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
    )
}