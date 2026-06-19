import type { ChamadoAdmin, RespostaChamado } from "../types/types";

export const formatarData = (data: string | null) => {
    if (!data) return "Não informado";

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
        return "Não informado";
    }

    return dataFormatada.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatarTexto = (texto: string) =>
    texto.charAt(0).toUpperCase() + texto.slice(1);

export const formatarAutor = (resposta: RespostaChamado) => {
    if (resposta.tipo_autor === "admin") return "Atendimento";

    return resposta.usuario_nome ?? "Usuário";
};

export const statusClasses = (status: string) => {
    const estilos: Record<string, string> = {
        aberto: "border-teal-200 bg-teal-50 text-teal-800",
        resolvido: "border-emerald-200 bg-emerald-50 text-emerald-800",
        encerrado: "border-gray-300 bg-gray-100 text-gray-700",
    };

    return estilos[status] ?? "border-gray-200 bg-gray-50 text-gray-700";
};

export const urgenciaClasses = (urgencia: string) => {
    const estilos: Record<string, string> = {
        baixa: "border-sky-200 bg-sky-50 text-sky-800",
        media: "border-amber-200 bg-amber-50 text-amber-800",
        alta: "border-orange-200 bg-orange-50 text-orange-800",
        urgente: "border-rose-200 bg-rose-50 text-rose-800",
    };

    return estilos[urgencia] ?? "border-gray-200 bg-gray-50 text-gray-700";
};

export const ultimaMensagem = (chamado: ChamadoAdmin) =>
    chamado.respostas.at(-1);

export const formatarDataInput = (data: Date) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
};

export const formatarDataTela = (data: string) => {
    if (!data) return "Não informado";

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
};

export const somarDias = (data: Date, dias: number) => {
    const novaData = new Date(data);

    novaData.setDate(novaData.getDate() + dias);

    return novaData;
};

export const hojeInput = () =>
    formatarDataInput(new Date());

export const inicioMesInput = () => {
    const agora = new Date();

    const inicioMes = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        1
    );

    return formatarDataInput(inicioMes);
};

export const periodos = [
    { id: "mes", label: "Deste mês" },
    { id: "hoje", label: "Hoje" },
    { id: "7", label: "Últimos 7 dias" },
    { id: "30", label: "Últimos 30 dias" },
    { id: "90", label: "Últimos 90 dias" },
    { id: "custom", label: "Personalizado" },
];

export const filtrosUrgencia = [
    { value: "todos", label: "Todas as urgências" },
    { value: "baixa", label: "Baixa" },
    { value: "media", label: "Média" },
    { value: "alta", label: "Alta" },
    { value: "urgente", label: "Urgente" },
];

export const statusChamado = [
    { value: "aberto", label: "Aberto" },
    { value: "resolvido", label: "Resolvido" },
    { value: "encerrado", label: "Encerrado" },
];