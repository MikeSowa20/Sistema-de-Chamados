import Mensagem from "../../../../commum/mensagem";

import ChamadoSelecionado from "./components/chamadoSelecionado";
import ChamadoEmVisualizacao from "./components/chamadoEmVisualizacao";
import RenderizarChamado from "./components/renderizarChamado";
import Seletor from "./components/seletor";

import { useChamadosAdmin } from "./hooks/useChamadosAdmin";

import {
    formatarData,
    formatarTexto,
    formatarAutor,
    statusChamado,
    statusClasses,
    urgenciaClasses,
    ultimaMensagem,
    formatarDataTela,
    periodos,
    filtrosUrgencia
} from "./utils/chamadosUtils";

interface ChamadosAdminProps {
    nome?: string;
    user_id?: number;
}
export default function ChamadosAdmin({
    nome,
    user_id,
}: ChamadosAdminProps) {

    const {
        chamados,
        carregando,
        mensagem,
        type,
        periodo,
        setPeriodo,
        inicioPersonalizado,
        setInicioPersonalizado,
        fimPersonalizado,
        setFimPersonalizado,
        filtroUrgencia,
        setFiltroUrgencia,
        statusVisivel,
        setStatusVisivel,
        respostas,
        setRespostas,
        statusEditando,
        setStatusEditando,
        salvandoId,
        chamadoSelecionado,
        chamadoEmVisualizacao,
        setChamadoVisualizando,
        setChamadoRespondendo,
        chamadosFiltrados,
        abrirFormularioResposta,
        responderChamado,
        intervalo,
    } = useChamadosAdmin(user_id);

    const statusAtual = statusChamado.find(
        (status) => status.value === statusVisivel
    );

    const labelStatusAtual =
        statusAtual?.label.toLowerCase() ?? "selecionado";

    const periodoAtual =
        periodos.find(
            (item) => item.id === periodo
        )?.label ?? "Período";

    const filtroAtual =
        filtrosUrgencia.find(
            (item) => item.value === filtroUrgencia
        )?.label ?? "Todas as urgências";

    return (
        <div className="space-y-6">
            {mensagem && (
                <Mensagem
                    mensagem={mensagem}
                    type={type}
                />
            )}
            <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <p className="text-sm font-bold text-teal-700">
                        Olá, {nome}
                    </p>
                    <h1 className="text-2xl font-bold text-gray-950">
                        Painel de chamados
                    </h1>
                    <p className="text-sm text-gray-500">
                        Abertos aparecem sempre;
                        resolvidos e encerrados
                        respeitam o período escolhido.
                    </p>
                </div>
                <Seletor
                    periodo={periodo}
                    setPeriodo={setPeriodo}
                    filtroUrgencia={filtroUrgencia}
                    setFiltroUrgencia={setFiltroUrgencia}
                    inicioPersonalizado={inicioPersonalizado}
                    setInicioPersonalizado={setInicioPersonalizado}
                    fimPersonalizado={fimPersonalizado}
                    setFimPersonalizado={setFimPersonalizado}
                    periodos={periodos}
                    filtrosUrgencia={filtrosUrgencia}
                />
            </div>
            <div className="space-y-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-950">
                            Fila de atendimento
                        </h2>
                        <p className="text-sm text-gray-500">
                            Exibindo:{" "}
                            {statusAtual?.label ?? "Chamados"}
                            {" | "}
                            {periodoAtual}:{" "}
                            {formatarDataTela(intervalo.dataInicio)}
                            {" até "}
                            {formatarDataTela(intervalo.dataFim)}
                            {" | "}
                            {filtroAtual}
                        </p>
                    </div>
                    <span className="border border-gray-200 bg-white px-3 py-1 text-sm font-bold text-gray-600">
                        {chamados.length}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {statusChamado.map((status) => {
                        const quantidade =
                            chamados.filter(
                                (chamado) =>
                                    chamado.status ===
                                    status.value
                            ).length;
                        const ativo =
                            status.value ===
                            statusVisivel;
                        return (
                            <button
                                key={status.value}
                                type="button"
                                onClick={() =>
                                    setStatusVisivel(
                                        status.value
                                    )
                                }
                                className={`border px-4 py-2 text-sm font-bold transition-colors cursor-pointer ${
                                    ativo
                                        ? "border-teal-700 bg-teal-700 text-white"
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {status.label}
                                <span
                                    className={`ml-2 px-2 py-0.5 text-xs ${
                                        ativo
                                            ? "bg-white text-teal-800"
                                            : statusClasses(
                                                  status.value
                                              )
                                    }`}
                                >
                                    {quantidade}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {carregando ? (
                    <div className="border border-gray-200 bg-white p-6">
                        Carregando chamados...
                    </div>
                ) : chamadosFiltrados.length === 0 ? (
                    <div className="border border-dashed border-gray-300 bg-white p-8 text-center">
                        <p className="font-bold">
                            Nenhum chamado {labelStatusAtual}.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {chamadosFiltrados.map(
                            (chamado) => (
                                <RenderizarChamado
                                    key={chamado.id}
                                    chamado={chamado}
                                    setChamadoVisualizando={setChamadoVisualizando }
                                    abrirFormularioResposta={ abrirFormularioResposta}
                                    statusClasses={statusClasses  }
                                    urgenciaClasses={ urgenciaClasses }
                                    formatarTexto={formatarTexto}
                                    formatarData={formatarData}
                                    formatarAutor={formatarAutor}
                                    ultimaMensagem={ultimaMensagem}
                                />
                            )
                        )}
                    </div>
                )}
            </div>

            {chamadoEmVisualizacao && (
                <ChamadoEmVisualizacao
                    chamadoEmVisualizacao={chamadoEmVisualizacao}
                    setChamadoVisualizando={setChamadoVisualizando}
                    abrirFormularioResposta={abrirFormularioResposta}
                    statusClasses={statusClasses}
                    urgenciaClasses={urgenciaClasses}
                    formatarTexto={formatarTexto}
                    formatarData={formatarData}
                    formatarAutor={formatarAutor}
                />
            )}

            <ChamadoSelecionado
                chamadoSelecionado={chamadoSelecionado }
                statusChamado={statusChamado}
                statusEditando={statusEditando}
                setStatusEditando={setStatusEditando }
                respostas={respostas}
                setRespostas={setRespostas}
                setChamadoRespondendo={setChamadoRespondendo }
                salvandoId={salvandoId}
                responderChamado={responderChamado }
            />
        </div>
    );
}