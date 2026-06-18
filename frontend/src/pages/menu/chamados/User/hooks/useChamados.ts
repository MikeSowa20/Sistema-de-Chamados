import { useEffect, useState } from "react";
import api from "../../../../../api";
import { sanitizeRichText, isRichTextEmpty } from "../../../../../commum/richText";
import type { Chamado } from "../Components/types";

interface UseChamadosProps {
    userId?: number;
}

export function useChamados({ userId }: UseChamadosProps) {
    const [chamados, setChamados] = useState<Chamado[]>([]);
    const [loading, setLoading] = useState(false);

    async function atualizarChamados() {
        if (!userId) return;

        try {
            setLoading(true);

            const response = await api.get(
                `/menu/chamados/atualizar/${userId}`
            );

            setChamados(response.data.chamados ?? []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function abrirChamado(
        titulo: string,
        corpo: string,
        urgencia: string
    ) {
        if (!userId) {
            throw new Error("Usuário não identificado");
        }

        const corpoLimpo = sanitizeRichText(corpo);

        if (
            !titulo.trim() ||
            isRichTextEmpty(corpoLimpo)
        ) {
            throw new Error(
                "Preencha o título e a descrição"
            );
        }

        const response = await api.post(
            `/menu/chamados/abrir-chamados/${userId}`,
            {
                titulo,
                corpo: corpoLimpo,
                urgencia,
            }
        );

        await atualizarChamados();

        return response.data;
    }

    useEffect(() => {
        atualizarChamados();
    }, [userId]);

    return {
        chamados,
        setChamados,
        atualizarChamados,
        abrirChamado,
        loading,
    };
}