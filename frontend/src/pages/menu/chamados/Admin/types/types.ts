import type { FormEvent, Dispatch, SetStateAction } from "react";

export interface RespostaChamado {
    id: number;
    chamado_id: number;
    usuario_id: number;
    mensagem: string;
    tipo_autor: string;
    criado_em: string;
    usuario_nome: string | null;
    usuario_email: string | null;
}

export interface ChamadoAdmin {
    id: number;
    titulo: string;
    corpo: string;
    urgencia: string;
    status: string;
    fechado_em: string | null;
    reaberto_em: string | null;
    quantidade_reaberturas: number;
    usuario_id: number;
    admin_id: number | null;
    resposta: string | null;
    atualizado_em: string | null;
    criado_em: string;
    usuario_nome: string | null;
    usuario_email: string | null;
    respostas: RespostaChamado[];
}


export interface StatusChamado {
    value: string;
    label: string;
}

export interface ChamadoSelecionadoProps {
    chamadoSelecionado?: ChamadoAdmin;

    statusChamado: StatusChamado[];

    statusEditando: Record<number, string>;
    setStatusEditando: Dispatch<
        SetStateAction<Record<number, string>>
    >;

    respostas: Record<number, string>;
    setRespostas: Dispatch<
        SetStateAction<Record<number, string>>
    >;

    setChamadoRespondendo: Dispatch<
        SetStateAction<number | null>
    >;

    salvandoId: number | null;

    responderChamado: (
        event: FormEvent<HTMLFormElement>,
        chamado: ChamadoAdmin
    ) => void | Promise<void>;
}

export interface ChamadoEmVisualizacaoProps {
    chamadoEmVisualizacao: ChamadoAdmin;

    setChamadoVisualizando: Dispatch<
        SetStateAction<number | null>
    >;

    abrirFormularioResposta: (
        chamado: ChamadoAdmin
    ) => void;

    statusClasses: (status: string) => string;

    urgenciaClasses: (
        urgencia: string
    ) => string;

    formatarTexto: (
        texto: string
    ) => string;

    formatarData: (
        data: string | null
    ) => string;

    formatarAutor: (
        resposta: RespostaChamado
    ) => string;
}

export interface RenderizarChamadoProps {
    chamado: ChamadoAdmin;

    setChamadoVisualizando: Dispatch<
        SetStateAction<number | null>
    >;

    abrirFormularioResposta: (
        chamado: ChamadoAdmin
    ) => void;

    statusClasses: (
        status: string
    ) => string;

    urgenciaClasses: (
        urgencia: string
    ) => string;

    formatarTexto: (
        texto: string
    ) => string;

    formatarData: (
        data: string | null
    ) => string;

    formatarAutor: (
        resposta: RespostaChamado
    ) => string;

    ultimaMensagem: (
        chamado: ChamadoAdmin
    ) => RespostaChamado | undefined;
}

export interface SeletorProps {
    periodo: string;
    setPeriodo: Dispatch<SetStateAction<string>>;

    filtroUrgencia: string;
    setFiltroUrgencia: Dispatch<SetStateAction<string>>;

    inicioPersonalizado: string;
    setInicioPersonalizado: Dispatch<SetStateAction<string>>;

    fimPersonalizado: string;
    setFimPersonalizado: Dispatch<SetStateAction<string>>;

    periodos: {
        id: string;
        label: string;
    }[];

    filtrosUrgencia: {
        value: string;
        label: string;
    }[];
}