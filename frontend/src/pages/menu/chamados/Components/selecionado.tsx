import RichTextEditor from "../../../../commum/RichTextEditor";
import RichTextView from "../../../../commum/RichTextView";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import type { FormEvent, Dispatch, SetStateAction } from "react";
import type {Chamado, RespostaChamado} from "./types"


interface SelecionadoProps {
    chamadoSelecionado: Chamado;

    respostaUsuario: string;
    setRespostaUsuario: Dispatch<SetStateAction<string>>;

    salvandoResposta: boolean;

    formatarDataAbertura: (data: string) => string;

    ultimaRespostaAdmin: (
        chamado: Chamado
    ) => RespostaChamado | undefined;

    chamadoEstaFinalizado: (
        chamado: Chamado
    ) => boolean;

    fecharRespostaUsuario: () => void;

    responderChamado: (
        e: FormEvent<HTMLFormElement>
    ) => void;
}

export default function Selecionado({
    chamadoSelecionado,
    respostaUsuario,
    setRespostaUsuario,
    salvandoResposta,
    formatarDataAbertura,
    ultimaRespostaAdmin,
    chamadoEstaFinalizado,
    fecharRespostaUsuario,
    responderChamado
}: SelecionadoProps) {
    return (
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
    )
}