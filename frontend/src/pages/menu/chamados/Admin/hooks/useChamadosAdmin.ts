import { useEffect, useMemo, useState, type FormEvent } from "react";
import api from "../../../../../api";
import {
    isRichTextEmpty,
    sanitizeRichText,
} from "../../../../../commum/richText";

import type { ChamadoAdmin } from "../types/types";

import {
    formatarDataInput,
    hojeInput,
    somarDias,
    inicioMesInput,
} from "../utils/chamadosUtils";

const obterIntervalo = (
    periodo: string,
    inicioPersonalizado: string,
    fimPersonalizado: string
) => {
    const hoje = new Date();

    if (periodo === "mes") {
        return {
            dataInicio: inicioMesInput(),
            dataFim: hojeInput(),
        };
    }

    if (periodo === "hoje") {
        return {
            dataInicio: hojeInput(),
            dataFim: hojeInput(),
        };
    }

    if (periodo === "custom") {
        return {
            dataInicio: inicioPersonalizado,
            dataFim: fimPersonalizado,
        };
    }

    return {
        dataInicio: formatarDataInput(
            somarDias(hoje, -Number(periodo))
        ),
        dataFim: hojeInput(),
    };
};

export function useChamadosAdmin(user_id?: number) {
    const [chamados, setChamados] = useState<ChamadoAdmin[]>([]);
    const [carregando, setCarregando] = useState(true);

    const [statusVisivel, setStatusVisivel] = useState("aberto");

    const [periodo, setPeriodo] = useState("mes");

    const [inicioPersonalizado, setInicioPersonalizado] =
        useState(
            formatarDataInput(
                somarDias(new Date(), -7)
            )
        );

    const [fimPersonalizado, setFimPersonalizado] =
        useState(hojeInput());

    const [filtroUrgencia, setFiltroUrgencia] =
        useState("todos");

    const [chamadoRespondendo, setChamadoRespondendo] =
        useState<number | null>(null);

    const [chamadoVisualizando, setChamadoVisualizando] =
        useState<number | null>(null);

    const [respostas, setRespostas] =
        useState<Record<number, string>>({});

    const [statusEditando, setStatusEditando] =
        useState<Record<number, string>>({});

    const [salvandoId, setSalvandoId] =
        useState<number | null>(null);

    const [mensagem, setMensagem] = useState("");

    const [type, setType] = useState<
        "success" | "error" | null
    >(null);

    const intervalo = useMemo(
        () =>
            obterIntervalo(
                periodo,
                inicioPersonalizado,
                fimPersonalizado
            ),
        [
            periodo,
            inicioPersonalizado,
            fimPersonalizado,
        ]
    );

    const chamadoSelecionado = chamados.find(
        (item) => item.id === chamadoRespondendo
    );

    const chamadoEmVisualizacao = chamados.find(
        (item) => item.id === chamadoVisualizando
    );

    const chamadosFiltrados = chamados.filter(
        (item) => item.status === statusVisivel
    );

    const carregarChamados = async () => {
        try {
            const response = await api.get(
                `/menu/chamados/admin/atualizar?data_inicio=${intervalo.dataInicio}&data_fim=${intervalo.dataFim}&filtro=${filtroUrgencia}`
            );

            setChamados(
                response.data.chamados ?? []
            );
        } catch (error) {
            console.error(error);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarChamados();
    }, [
        intervalo.dataInicio,
        intervalo.dataFim,
        filtroUrgencia,
    ]);

    useEffect(() => {
        if (!mensagem) return;

        const timer = setTimeout(() => {
            setMensagem("");
            setType(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [mensagem]);

    const abrirFormularioResposta = (
        chamado: ChamadoAdmin
    ) => {
        setChamadoRespondendo((idAtual) =>
            idAtual === chamado.id
                ? null
                : chamado.id
        );

        setStatusEditando((atual) => ({
            ...atual,
            [chamado.id]:
                atual[chamado.id] ??
                chamado.status,
        }));
    };

    const responderChamado = async (
        event: FormEvent<HTMLFormElement>,
        chamado: ChamadoAdmin
    ) => {
        event.preventDefault();

        if (!user_id) {
            setType("error");
            setMensagem(
                "Administrador não identificado."
            );
            return;
        }

        const textoResposta =
            sanitizeRichText(
                respostas[chamado.id] ?? ""
            );

        const novoStatus =
            statusEditando[chamado.id] ??
            chamado.status;

        if (
            isRichTextEmpty(textoResposta) &&
            novoStatus === chamado.status
        ) {
            setType("error");
            setMensagem(
                "Escreva uma resposta ou altere o status."
            );
            return;
        }

        try {
            setSalvandoId(chamado.id);

            const response = await api.post(
                `/menu/chamados/admin/responder/${chamado.id}`,
                {
                    admin_id: user_id,
                    mensagem: textoResposta,
                    status: novoStatus,
                }
            );

            setChamados((atual) =>
                atual.map((item) =>
                    item.id === chamado.id
                        ? response.data.chamado
                        : item
                )
            );

            setRespostas((atual) => ({
                ...atual,
                [chamado.id]: "",
            }));

            setChamadoRespondendo(null);

            setMensagem(
                response.data.mensagem
            );

            setType(response.data.type);
        } catch (error) {
            console.error(error);

            setType("error");
            setMensagem(
                "Erro ao responder chamado."
            );
        } finally {
            setSalvandoId(null);
        }
    };

    return {
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
    };
}