import type { FormEvent, Dispatch, SetStateAction } from "react";

export interface Chamado {
    id: number;
    titulo: string;
    corpo: string;
    urgencia: string;
    status: string;
    criado_em: string;
    respostas: RespostaChamado[];
}

export interface SelecionadoProps {
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

export interface chamadosUserProps{
    nome:string | undefined
    user_id:number | undefined
}

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