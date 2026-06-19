import { FaChartBar, FaCheckCircle, FaClock, FaFolderOpen, FaRedo } from "react-icons/fa";
import type { Cards } from "../types/type";

export default function Cards({dados}:Cards) {
    const cards = [
        {
            label: "Total",
            valor: dados.total,
            icon: <FaChartBar />,
            className: "bg-gray-950 text-white",
        },
        {
            label: "Abertos",
            valor: dados.status.abertos,
            icon: <FaFolderOpen />,
            className: "bg-teal-700 text-white",
        },
        {
            label: "Resolvidos",
            valor: dados.status.resolvidos,
            icon: <FaCheckCircle />,
            className: "bg-emerald-700 text-white",
        },
        {
            label: "Encerrados",
            valor: dados.status.encerrados,
            icon: <FaClock />,
            className: "bg-gray-700 text-white",
        },
        {
            label: "Reabertos",
            valor: dados.status.reabertos,
            icon: <FaRedo />,
            className: "bg-amber-600 text-white",
        },
    ];

    return (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => (
                <div key={card.label} className={`p-4 shadow-sm ${card.className}`}>
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold opacity-90">{card.label}</p>
                        <span className="text-lg">{card.icon}</span>
                    </div>
                    <p className="mt-4 text-3xl font-bold">{card.valor}</p>
                </div>
            ))}
        </div>
    )
}