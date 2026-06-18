import { useMemo } from "react";
import type { Chamado } from "../Components/types";

export function useChamadosFiltros(
    chamados: Chamado[]
) {
    const abertos = useMemo(
        () =>
            chamados.filter(
                c => c.status === "aberto"
            ),
        [chamados]
    );

    const resolvidos = useMemo(
        () =>
            chamados.filter(
                c => c.status === "resolvido"
            ),
        [chamados]
    );

    const encerrados = useMemo(
        () =>
            chamados.filter(
                c => c.status === "encerrado"
            ),
        [chamados]
    );

    return {
        abertos,
        resolvidos,
        encerrados,
    };
}