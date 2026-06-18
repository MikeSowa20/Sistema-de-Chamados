import { useEffect, useState, type FormEvent } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import Mensagem from "../../../commum/mensagem";
import ChamadoUser from "./Components/chamadouser";
import Formulario from "./Components/formulario";
import Selecionado from "./Components/selecionado";
import { useChamados } from "./hooks/useChamados";
import { useChamadosFiltros } from "./hooks/useChamadosFiltros";
import { useRespostaChamado } from "./hooks/useRespostaChamado";
import {
    formatarDataAbertura,
    ultimaRespostaAdmin,
    chamadoEstaFinalizado,
} from "./utils/chamados";

import type { Chamado } from "./Components/types";

interface ChamadosUserProps {
    nome?: string;
    user_id?: number;
}

export default function ChamadosUser({
    nome,
    user_id,
}: ChamadosUserProps) {
    const [formAberto, setFormAberto] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [corpo, setCorpo] = useState("");
    const [urgencia, setUrgencia] = useState("baixa");
    const [mensagem, setMensagem] = useState("");
    const [type, setType] = useState<"success" | "error" | null>(null);
    const [chamadoRespondendo, setChamadoRespondendo] =useState<number | null>(null);
    const {chamados,abrirChamado,atualizarChamados,} = useChamados({userId: user_id,});
    const {abertos,resolvidos,encerrados,} = useChamadosFiltros(chamados);
    const chamadoSelecionado = chamados.find((chamado) =>chamado.id === chamadoRespondendo);
    const {respostaUsuario,setRespostaUsuario,responderChamado,salvandoResposta, 
    } = useRespostaChamado({userId: user_id,chamadoSelecionado,atualizarChamados,});

    useEffect(() => {
        if (!mensagem) return;

        const intervalo = setTimeout(() => {
            setMensagem("");
            setType(null);
        }, 3000);

        return () => clearTimeout(intervalo);
    }, [mensagem]);

    function limparFormulario() {
        setTitulo("");
        setCorpo("");
        setUrgencia("baixa");
    }

    async function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        try {
            const data = await abrirChamado(
                titulo,
                corpo,
                urgencia
            );
            limparFormulario();
            setFormAberto(false);
            setMensagem(data.mensagem);
            setType(data.type);
        } catch (error) {
            console.error(error);
            setMensagem(
                error instanceof Error
                    ? error.message
                    : "Erro ao abrir chamado"
            );
            setType("error");
        }
    }

    function abrirRespostaUsuario(
        chamado: Chamado
    ) {
        setChamadoRespondendo(chamado.id);
        setRespostaUsuario("");
    }

    function fecharRespostaUsuario() {
        setChamadoRespondendo(null);
        setRespostaUsuario("");
    }

    async function handleResponderChamado(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        try {
            const data =
                await responderChamado();
            fecharRespostaUsuario();
            setMensagem(data.mensagem);
            setType(data.type);
        } catch (error) {
            console.error(error);
            setMensagem(
                error instanceof Error
                    ? error.message
                    : "Erro ao responder chamado"
            );
            setType("error");
        }
    }

    return (
        <div className="space-y-6">
            {mensagem && (
                <Mensagem
                    mensagem={mensagem}
                    type={type}
                />
            )}

            <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm font-bold text-teal-700">
                        Olá, {nome}
                    </p>
                    <h1 className="text-2xl font-bold text-gray-950">
                        Meus chamados
                    </h1>
                    <p className="text-sm text-gray-500">
                        Acompanhe solicitações,
                        respostas e reaberturas em
                        um só lugar.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setFormAberto(!formAberto)
                    }
                    className="flex items-center justify-center gap-2 bg-teal-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-800"
                >
                    {formAberto ? (
                        <FaTimes />) : (<FaPlus />
                    )}

                    Abrir chamado
                </button>
            </div>

            {formAberto && (
                <Formulario
                    titulo={titulo}
                    corpo={corpo}
                    urgencia={urgencia}
                    setTitulo={setTitulo}
                    setCorpo={setCorpo}
                    setUrgencia={setUrgencia}
                    setFormAberto={setFormAberto}
                    handleSubmit={handleSubmit}
                    limparFormulario={limparFormulario}
                />
            )}

            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-950">
                        Chamados abertos
                    </h2>
                    <span className="border border-gray-200 bg-white px-3 py-1 text-sm font-bold text-gray-600">
                        {abertos.length}
                    </span>
                </div>

                {abertos.map((chamado) => (
                    <ChamadoUser
                        key={chamado.id}
                        chamado={chamado}
                        formatarDataAbertura={
                            formatarDataAbertura
                        }
                        abrirRespostaUsuario={
                            abrirRespostaUsuario
                        }
                    />
                ))}
            </section>
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-950">
                        Chamados resolvidos
                    </h2>

                    <span className="border border-gray-200 bg-white px-3 py-1 text-sm font-bold text-gray-600">
                        {resolvidos.length}
                    </span>
                </div>
                {resolvidos.map((chamado) => (
                    <ChamadoUser
                        key={chamado.id}
                        chamado={chamado}
                        formatarDataAbertura={
                            formatarDataAbertura
                        }
                        abrirRespostaUsuario={
                            abrirRespostaUsuario
                        }
                    />
                ))}
            </section>

            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-950">
                        Chamados encerrados
                    </h2>

                    <span className="border border-gray-200 bg-white px-3 py-1 text-sm font-bold text-gray-600">
                        {encerrados.length}
                    </span>
                </div>

                {encerrados.map((chamado) => (
                    <ChamadoUser
                        key={chamado.id}
                        chamado={chamado}
                        formatarDataAbertura={formatarDataAbertura}
                        abrirRespostaUsuario={abrirRespostaUsuario}
                    />
                ))}
            </section>

            {chamadoSelecionado && (
                <Selecionado
                    chamadoSelecionado={
                        chamadoSelecionado
                    }
                    respostaUsuario={
                        respostaUsuario
                    }
                    setRespostaUsuario={
                        setRespostaUsuario
                    }
                    salvandoResposta={
                        salvandoResposta
                    }
                    formatarDataAbertura={
                        formatarDataAbertura
                    }
                    ultimaRespostaAdmin={
                        ultimaRespostaAdmin
                    }
                    chamadoEstaFinalizado={
                        chamadoEstaFinalizado
                    }
                    fecharRespostaUsuario={
                        fecharRespostaUsuario
                    }
                    responderChamado={
                        handleResponderChamado
                    }
                />
            )}
        </div>
    );
}