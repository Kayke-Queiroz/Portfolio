import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const ROLE_ACCENTS = [
    {
        hex: "#22d3ee",
        rgb: "34, 211, 238",
        badgeClass: "bg-cyan-500/15 text-cyan-300 border-cyan-400/40",
        techClass: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25 hover:border-cyan-400/60",
    },
    {
        hex: "#a855f7",
        rgb: "168, 85, 247",
        badgeClass: "bg-purple-500/15 text-purple-300 border-purple-400/40",
        techClass: "bg-purple-500/10 text-purple-300 border-purple-500/25 hover:border-purple-400/60",
    },
    {
        hex: "#3b82f6",
        rgb: "59, 130, 246",
        badgeClass: "bg-blue-500/15 text-blue-300 border-blue-400/40",
        techClass: "bg-blue-500/10 text-blue-300 border-blue-500/25 hover:border-blue-400/60",
    },
];

export default function Experience() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState(0);

    const items = t.experience.items || [];
    const activeItem = items[activeTab] || items[0];
    const activeAccent = ROLE_ACCENTS[activeTab % ROLE_ACCENTS.length];

    if (!activeItem) return null;

    return (
        <section
            id="experiencia"
            className="relative w-full py-24 px-4 md:px-8 overflow-hidden"
        >
            {/* Iluminação de fundo dinâmica */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                    className="w-[460px] h-[460px] md:w-[700px] md:h-[500px] rounded-full blur-[150px] opacity-15 transition-colors duration-700"
                    style={{ backgroundColor: activeAccent.hex }}
                />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Cabeçalho */}
                <div className="text-center mb-16">
                    <Motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="inline-block"
                    >
                        <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400/80 block mb-2">
                            {t.experience.tag}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500 tracking-tight">
                            {t.experience.title}
                        </h2>
                        <div
                            className="h-1 w-24 mx-auto mt-4 rounded-full transition-colors duration-500"
                            style={{
                                backgroundColor: activeAccent.hex,
                                boxShadow: `0 0 15px ${activeAccent.hex}`,
                            }}
                        />
                        <p className="text-gray-400 mt-4 text-sm md:text-base max-w-xl mx-auto">
                            {t.experience.subtitle}
                        </p>
                    </Motion.div>
                </div>

                {/* Layout Master-Detail: Abas Laterais (Empresas) + Dossiê Completo */}
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    {/* Coluna Esquerda: Abas Seletoras de Experiência */}
                    <div className="lg:col-span-4 flex flex-col gap-3">
                        {items.map((item, idx) => {
                            const isSelected = activeTab === idx;
                            const accent = ROLE_ACCENTS[idx % ROLE_ACCENTS.length];

                            return (
                                <Motion.button
                                    key={item.id}
                                    type="button"
                                    initial={{ opacity: 0, x: -24 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                                    onClick={() => setActiveTab(idx)}
                                    style={{
                                        borderColor: isSelected
                                            ? `rgba(${accent.rgb}, 0.65)`
                                            : "rgba(255,255,255,0.08)",
                                        boxShadow: isSelected
                                            ? `0 0 28px rgba(${accent.rgb}, 0.16), inset 0 0 20px rgba(${accent.rgb}, 0.06)`
                                            : "none",
                                    }}
                                    className={`
                                        group relative w-full text-left p-5 rounded-2xl border backdrop-blur-xl
                                        transition-all duration-300 cursor-pointer overflow-hidden
                                        ${isSelected ? "bg-slate-950/85" : "bg-black/40 hover:bg-white/[0.04]"}
                                    `}
                                >
                                    {/* Barra lateral luminosa ativa */}
                                    <span
                                        style={{
                                            backgroundColor: accent.hex,
                                            boxShadow: `0 0 12px ${accent.hex}`,
                                        }}
                                        className={`absolute left-0 top-0 bottom-0 w-1 transition-opacity duration-300 ${
                                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                                        }`}
                                    />

                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                        <span className="text-[11px] font-mono text-gray-400 tracking-wider uppercase">
                                            {item.period}
                                        </span>
                                        {item.current && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                                {t.experience.presentBadge}
                                            </span>
                                        )}
                                    </div>

                                    <h3
                                        className={`text-base md:text-lg font-bold transition-colors leading-snug ${
                                            isSelected ? "text-white" : "text-gray-300 group-hover:text-white"
                                        }`}
                                    >
                                        {item.company}
                                    </h3>

                                    <p
                                        style={{ color: isSelected ? accent.hex : undefined }}
                                        className={`text-xs md:text-sm font-medium mt-1 line-clamp-1 ${
                                            isSelected ? "" : "text-gray-400"
                                        }`}
                                    >
                                        {item.role}
                                    </p>

                                    <div className="flex items-center gap-2 mt-2.5 text-[11px] text-gray-500 font-mono">
                                        <span>{item.type}</span>
                                        <span>•</span>
                                        <span>{item.location}</span>
                                    </div>
                                </Motion.button>
                            );
                        })}
                    </div>

                    {/* Coluna Direita: Painel Detalhado da Experiência Selecionada */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <Motion.div
                                key={activeItem.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.28 }}
                                style={{
                                    borderColor: `rgba(${activeAccent.rgb}, 0.35)`,
                                    boxShadow: `0 0 45px rgba(${activeAccent.rgb}, 0.10)`,
                                }}
                                className="relative rounded-3xl bg-black/55 backdrop-blur-xl border p-6 md:p-9 overflow-hidden"
                            >
                                {/* Brilho decorativo de canto */}
                                <div
                                    style={{ backgroundColor: activeAccent.hex }}
                                    className="absolute -top-20 -right-20 w-52 h-52 rounded-full blur-3xl opacity-15 pointer-events-none"
                                />

                                {/* Topo do Card: Cargo, Empresa, Badges */}
                                <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/10">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${activeAccent.badgeClass}`}
                                            >
                                                {activeItem.type}
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-xs font-mono text-gray-300 bg-white/5 border border-white/10">
                                                {activeItem.location}
                                            </span>
                                            {activeItem.award && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                                    <span>🏆</span>
                                                    <span>{activeItem.award}</span>
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight pt-1">
                                            {activeItem.role}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                                            <span
                                                style={{ color: activeAccent.hex }}
                                                className="font-semibold text-base"
                                            >
                                                {activeItem.company}
                                            </span>
                                            <span className="text-gray-600">•</span>
                                            <span className="font-mono text-gray-400 text-xs md:text-sm">
                                                {activeItem.periodFull}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Resumo */}
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-6">
                                    {activeItem.summary}
                                </p>

                                {/* Destaque de Produto (ex: WonderWord AI) se houver */}
                                {activeItem.featuredProject && (
                                    <div
                                        style={{
                                            borderColor: `rgba(${activeAccent.rgb}, 0.35)`,
                                            background: `linear-gradient(135deg, rgba(${activeAccent.rgb}, 0.10), rgba(15,23,42,0.75))`,
                                        }}
                                        className="mt-6 p-4 md:p-5 rounded-2xl border relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span
                                                style={{ backgroundColor: activeAccent.hex }}
                                                className="w-2 h-2 rounded-full"
                                            />
                                            <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400">
                                                {t.experience.projectSpotlightLabel}
                                            </span>
                                        </div>
                                        <h4 className="text-white font-bold text-base md:text-lg">
                                            {activeItem.featuredProject.name}
                                        </h4>
                                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed mt-1">
                                            {activeItem.featuredProject.description}
                                        </p>
                                    </div>
                                )}

                                {/* Lista de Responsabilidades & Conquistas */}
                                <ul className="mt-6 space-y-3">
                                    {activeItem.highlights.map((bullet, bIdx) => (
                                        <li
                                            key={bIdx}
                                            className="flex items-start gap-3 text-gray-300 text-sm md:text-[15px] leading-relaxed"
                                        >
                                            <span
                                                style={{
                                                    backgroundColor: activeAccent.hex,
                                                    boxShadow: `0 0 8px ${activeAccent.hex}`,
                                                }}
                                                className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0"
                                            />
                                            <span>{bullet}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Stack Tecnológica da Experiência */}
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <div className="text-[11px] font-mono uppercase tracking-widest text-gray-400 mb-3">
                                        {t.experience.techLabel}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {activeItem.skills.map((tech) => (
                                            <span
                                                key={tech}
                                                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${activeAccent.techClass}`}
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
