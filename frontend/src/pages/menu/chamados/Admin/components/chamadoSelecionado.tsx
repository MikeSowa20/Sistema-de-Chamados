import RichTextEditor from "../../../../../commum/RichTextEditor";
import {  FaPaperPlane, FaTimes,} from "react-icons/fa";
import type { ChamadoSelecionadoProps } from "../types/types";

export default function ChamadoSelecionado({
    chamadoSelecionado,
    statusChamado,
    statusEditando,
    setStatusEditando,
    respostas,
    setRespostas,
    setChamadoRespondendo,
    salvandoId,
    responderChamado,
}: ChamadoSelecionadoProps) {
    return (
        <div>
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