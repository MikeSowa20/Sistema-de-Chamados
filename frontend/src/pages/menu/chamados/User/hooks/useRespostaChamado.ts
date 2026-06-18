import { useState } from "react";
import api from "../../../../../api";
import {
    sanitizeRichText,
    isRichTextEmpty,
} from "../../../../../commum/richText";

import type { Chamado } from "../Components/types";

interface UseRespostaChamadoProps {
    userId?: number;
    chamadoSelecionado?: Chamado;
    atualizarChamados: () => Promise<void>;
}

export function useRespostaChamado({
    userId,
    chamadoSelecionado,
    atualizarChamados,
}: UseRespostaChamadoProps) {
    const [respostaUsuario, setRespostaUsuario] =
        useState("");

    const [salvandoResposta, setSalvandoResposta] =
        useState(false);

    async function responderChamado() {
        if (!userId || !chamadoSelecionado) {
            throw new Error(
                "Usuário ou chamado não identificado"
            );
        }

        const respostaLimpa =
            sanitizeRichText(respostaUsuario);

        if (isRichTextEmpty(respostaLimpa)) {
            throw new Error(
                "Escreva uma resposta"
            );
        }

        try {
            setSalvandoResposta(true);

            const response = await api.post(
                `/menu/chamados/responder/${chamadoSelecionado.id}`,
                {
                    usuario_id: userId,
                    mensagem: respostaLimpa,
                }
            );

            await atualizarChamados();

            setRespostaUsuario("");

            return response.data;
        } finally {
            setSalvandoResposta(false);
        }
    }

    return {
        respostaUsuario,
        setRespostaUsuario,
        responderChamado,
        salvandoResposta,
    };
}