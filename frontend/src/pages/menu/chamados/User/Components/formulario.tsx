import Buttom from "../../../../../commum/buttom";
import { FaTimes } from "react-icons/fa";
import RichTextEditor from "../../../../../commum/RichTextEditor";

interface FormularioProps {
    titulo: string;
    corpo: string;
    urgencia: string;
    setTitulo: React.Dispatch<React.SetStateAction<string>>;
    setCorpo: React.Dispatch<React.SetStateAction<string>>;
    setUrgencia: React.Dispatch<React.SetStateAction<string>>;
    setFormAberto: React.Dispatch<React.SetStateAction<boolean>>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    limparFormulario: () => void;
}

export default function Formulario({titulo,corpo,urgencia,setTitulo,setCorpo,setUrgencia,setFormAberto,handleSubmit,limparFormulario}:FormularioProps) {
    return (
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
    )
}