import type { Dispatch, SetStateAction } from "react";

export interface DashboardData {
    total: number;
    status: {
        abertos: number;
        encerrados: number;
        reabertos: number;
        resolvidos: number;
    };
    urgencia: {
        alta: number;
        baixa: number;
        media: number;
        urgente: number;
    };
}

export const dadosVazios: DashboardData = {
    total: 0,
    status: {
        abertos: 0,
        encerrados: 0,
        reabertos: 0,
        resolvidos: 0,
    },
    urgencia: {
        alta: 0,
        baixa: 0,
        media: 0,
        urgente: 0,
    },
};

export interface Tabela{
    dados: DashboardData;
    config: Config
}
type Config = {
    label: string;
    valor: number;
    color: string;
}[];

export interface Cards{
    dados: DashboardData;
}


export interface SeletorPeriodoProps {
    periodo: string;
    setPeriodo: Dispatch<SetStateAction<string>>;
    periodos: PeriodoOption[];
    inicioPersonalizado: string;
    setInicioPersonalizado: Dispatch<SetStateAction<string>>;
    fimPersonalizado: string;
    setFimPersonalizado: Dispatch<SetStateAction<string>>;
}

interface PeriodoOption {
    id: string;
    label: string;
}