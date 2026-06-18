import type {
    Chamado,
    RespostaChamado,
} from "../Components/types";

export function formatarDataAbertura(
    data: string
) {
    const dataFormatada = new Date(data);

    if (
        Number.isNaN(dataFormatada.getTime())
    ) {
        return "Horário não informado";
    }

    return dataFormatada.toLocaleString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
}

export function ultimaRespostaAdmin(
    chamado: Chamado
): RespostaChamado | undefined {
    return chamado.respostas
        .filter(
            resposta =>
                resposta.tipo_autor ===
                "admin"
        )
        .at(-1);
}

export function chamadoEstaFinalizado(
    chamado: Chamado
) {
    return (
        chamado.status === "encerrado" ||
        chamado.status === "resolvido"
    );
}