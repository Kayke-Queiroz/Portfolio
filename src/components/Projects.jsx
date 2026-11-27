import { useState } from "react";
import {
    motion as Motion,
    AnimatePresence,
    useMotionValue,
    useTransform,
    animate,
} from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useWindowSize } from "../hooks/useWindowSize";

const PROJECTS_META = {
    wonderword: {
        status: "done",
        tech: ["Next.js 14", "TypeScript", "FastAPI", "Claude API", "WhisperX", "Supabase"],
        github: "https://github.com/Kayke-Queiroz/WonderWordAI",
        url: "https://wonder-word-ai.vercel.app/",
        images: [
            "/assets/projects/wonder11.png",
            "/assets/projects/wonder2.png",
            "/assets/projects/wonder3.png",
        ],
    },
    odsmonitor: {
        status: "done",
        tech: ["React Native", "Expo", "TypeScript", "Firebase", "Qwen 2.5 LLM", "Hugging Face"],
        github: "https://github.com/Kayke-Queiroz/ODSMonitor",
        url: "https://ods-monitor.vercel.app/",
        images: [
            "/assets/projects/ods1.png",
            "/assets/projects/ods2.png",
            "/assets/projects/ods3.png",
        ],
    },
    smartweather: {
        status: "done",
        tech: ["React 19", "TypeScript", "Tailwind CSS 4", "Strapi 5", "Gemini 2.0", "Leaflet"],
        github: "https://github.com/Kayke-Queiroz/SmartWeather",
        url: "https://smart-weather-sigma.vercel.app/",
        images: [
            "/assets/projects/weather1.jpg",
            "/assets/projects/weather2.jpg",
        ],
    },
    smartmail: {
        status: "done",
        tech: ["n8n", "OpenAI GPT-4o-mini", "Gmail API", "Google Docs API", "OAuth2", "AI Automation"],
        github: "https://github.com/Kayke-Queiroz/SmartMail-n8n-AI",
        url: null,
        images: [
            "/assets/projects/n8nflow.png",
        ],
    },
    universe3d: {
        status: "dev",
        tech: ["Three.js", "WebGL", "GLTF / PBR", "JavaScript ES6+", "Glassmorphism", "Vite"],
        github: "https://github.com/Kayke-Queiroz/Portifolio-3D-universe",
        url: "#",
        images: [
            "/assets/projects/universe.PNG",
            "/assets/projects/universe2.PNG",
        ],
    },
    portfolio: {
        status: "done",
        tech: ["React 19", "Tailwind CSS", "Framer Motion", "Canvas 3D", "Vite", "Vercel"],
        github: "https://github.com/Kayke-Queiroz/Repository",
        url: "https://kaykesantos.vercel.app/",
        images: [
            "/assets/projects/portifolioimg.PNG",
        ],
    },
    books: {
        status: "done",
        tech: ["JavaScript", "Google Books API", "Firebase", "Cloud Auth", "HTML5 & CSS3"],
        github: "https://github.com/Kayke-Queiroz/Acervo-Digital-de-Livros",
        url: "https://leitura-para-todos-a18e8.web.app/",
        images: [
            "/assets/projects/book1.PNG",
            "/assets/projects/book2.PNG",
        ],
    },
};

const wrap = (min, max, v) => {
    const range = max - min;
    return ((((v - min) % range) + range) % range) + min;
};

const ProjectCard = ({
    project,
    index,
    totalItems,
    x,
    cardWidth,
    cardHeight,
    cardGap,
    isFlipped,
    onToggleFlip,
    onCenterCard,
    onOpenLightbox,
    t,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMidFlip, setIsMidFlip] = useState(false);
    const [imgIndex, setImgIndex] = useState(0);

    const meta = PROJECTS_META[project.id] || {
        status: "done",
        tech: [],
        github: "#",
        url: "#",
        images: [],
    };

    const images = meta.images;
    const hasMultipleImages = images.length > 1;
    const safeImgIndex = images.length > 0 ? imgIndex % images.length : 0;
    const currentImage = images[safeImgIndex];

    const step = cardWidth + cardGap;
    const totalWidth = totalItems * step;
    const baseOffset = index * step;

    const rawPosition = useTransform(x, (currentX) => {
        const raw = baseOffset + currentX;
        const wrapped = wrap(-totalWidth / 2, totalWidth / 2, raw);
        return Math.abs(wrapped) < 1 ? 0 : Math.round(wrapped);
    });

    const dist = useTransform(rawPosition, (pos) => Math.abs(pos));

    const scale = useTransform(dist, (d) => {
        if (d < 8) return 1;
        const maxDistance = totalWidth / 2;
        const s = 1 - (d / maxDistance) * 0.34;
        return Math.max(s, 0.68);
    });

    const opacity = useTransform(dist, (d) => {
        const visibleZone = step * 1.45;
        if (d <= visibleZone) return 1;
        const fade = 1 - (d - visibleZone) / (step * 0.9);
        return Math.max(fade, 0);
    });

    const zIndex = useTransform(dist, (d) => 120 - Math.floor(d / 10));

    const isDev = meta.status === "dev";
    const statusLabel = isDev ? t.projects.status.dev : t.projects.status.done;

    const handleCardClick = () => {
        const currentPos = rawPosition.get();
        // Se o card clicado estiver na lateral, traz suavemente para o centro e gira
        if (Math.abs(currentPos) > 25) {
            onCenterCard(currentPos);
            if (!isFlipped) {
                setIsMidFlip(true);
                onToggleFlip(project.id);
            }
        } else {
            setIsMidFlip(true);
            onToggleFlip(project.id);
        }
    };

    const handlePrevImg = (e) => {
        e.stopPropagation();
        setImgIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNextImg = (e) => {
        e.stopPropagation();
        setImgIndex((prev) => (prev + 1) % images.length);
    };

    const use3DLayer = isFlipped || isMidFlip;

    return (
        <Motion.div
            style={{
                width: cardWidth,
                height: cardHeight,
                x: rawPosition,
                scale,
                opacity,
                zIndex: isFlipped ? 260 : isHovered ? 220 : zIndex,
                left: "50%",
                marginLeft: -Math.round(cardWidth / 2),
                perspective: use3DLayer ? "1300px" : undefined,
            }}
            className="absolute top-4 pointer-events-auto select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.65, type: "spring", stiffness: 230, damping: 24 }}
                onAnimationComplete={() => {
                    if (!isFlipped) {
                        setIsMidFlip(false);
                    }
                }}
                onClick={handleCardClick}
                style={{ transformStyle: use3DLayer ? "preserve-3d" : "flat" }}
                className="w-full h-full relative cursor-pointer group"
            >
                {/* ==========================================
                    FRENTE DO CARD (INFORMAÇÕES DO PROJETO)
                   ========================================== */}
                <div
                    style={
                        use3DLayer
                            ? {
                                  backfaceVisibility: "hidden",
                                  WebkitBackfaceVisibility: "hidden",
                                  transform: "rotateY(0deg)",
                                  pointerEvents: isFlipped ? "none" : "auto",
                              }
                            : undefined
                    }
                    className="
                        absolute inset-0 rounded-2xl
                        border border-white/10
                        flex flex-col overflow-hidden
                        shadow-[0_15px_45px_rgba(0,0,0,0.65)]
                        transition-[border-color,box-shadow] duration-300
                        group-hover:border-cyan-400/65 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_32px_rgba(34,211,238,0.24)]
                    "
                >
                    {/* Camada de fundo isolada para não afetar a nitidez das fontes */}
                    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xl pointer-events-none -z-10" />
                    {/* Faixa superior com miniatura desfocada/preview sutil + badges */}
                    <div className="relative h-36 md:h-40 w-full overflow-hidden border-b border-white/10 shrink-0">
                        {currentImage && (
                            <img
                                src={currentImage}
                                alt={project.name}
                                className="w-full h-full object-cover object-top opacity-45 group-hover:opacity-65 group-hover:scale-105 transition-all duration-500"
                                draggable={false}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-black/30" />

                        {/* Status Badge (Esquerda) */}
                        <div
                            className={`
                                absolute top-3 left-3 px-2.5 py-1 rounded-full border backdrop-blur-md
                                text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5
                                ${isDev
                                    ? "bg-amber-500/15 border-amber-400/40 text-amber-300"
                                    : "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"}
                            `}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${isDev ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                                    }`}
                            />
                            {statusLabel}
                        </div>

                        {/* Dica de Clique para Girar (Direita) */}
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/65 border border-cyan-400/35 backdrop-blur-md text-[10px] font-mono font-semibold text-cyan-300 flex items-center gap-1.5 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/70 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>
                                {t.projects.flipHint} ({images.length})
                            </span>
                        </div>
                    </div>

                    {/* Corpo do Card */}
                    <div className="p-6 md:p-7 flex flex-col flex-1 relative z-10">
                        <h3 className="text-2xl md:text-[26px] font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight leading-snug">
                            {project.name}
                        </h3>
                        {project.subtitle && (
                            <p className="text-xs md:text-[13px] font-mono text-cyan-400/85 mt-1 mb-3 truncate">
                                {project.subtitle}
                            </p>
                        )}

                        <p className="text-gray-300/90 text-xs md:text-sm leading-relaxed mb-5 line-clamp-6">
                            {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                            {meta.tech.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/25"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {/* Botões Inferiores */}
                        <div className="flex gap-3 pt-3 border-t border-white/10">
                            {meta.url === "#" ? (
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-amber-300/80 font-bold flex items-center justify-center gap-1.5 text-xs md:text-sm cursor-default"
                                >
                                    <span>🚧</span>
                                    <span>{t.projects.status.soon}</span>
                                </div>
                            ) : meta.url ? (
                                <a
                                    href={meta.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold flex items-center justify-center gap-1.5 text-xs md:text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 transition-all cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    {t.projects.viewProject}
                                </a>
                            ) : null}

                            <a
                                href={meta.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-1.5 text-xs md:text-sm font-bold text-white transition-all duration-300 hover:bg-white/10 hover:border-cyan-400/40 active:scale-95 cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                {t.projects.github}
                            </a>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 blur-[55px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/15 blur-[55px] rounded-full pointer-events-none" />
                </div>

                {/* ==========================================
                    VERSO DO CARD (GALERIA DE TELAS IGUAL CERTIFICADOS)
                   ========================================== */}
                <div
                    style={{
                        display: use3DLayer ? "flex" : "none",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        pointerEvents: isFlipped ? "auto" : "none",
                    }}
                    className="
                        absolute inset-0 rounded-2xl overflow-hidden
                        bg-slate-950 border-2 border-cyan-400/70
                        shadow-[0_0_40px_rgba(34,211,238,0.28)]
                        flex flex-col
                    "
                >
                    {/* Topo do Verso: Nome do Projeto + Contador + Ampliar + Fechar */}
                    <div className="flex items-center justify-between gap-2 px-4 py-3 bg-slate-950/90 border-b border-white/10 z-20 shrink-0">
                        <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">
                                {project.name}
                            </h4>
                            {hasMultipleImages && (
                                <span className="text-[10px] font-mono text-cyan-400">
                                    Tela {safeImgIndex + 1} / {images.length}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                            {/* Botão Ampliar Lightbox */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenLightbox({
                                        name: project.name,
                                        images,
                                        initialIndex: safeImgIndex,
                                    });
                                }}
                                title={t.projects.expandImage}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/25 text-gray-300 hover:text-cyan-300 border border-white/15 transition-colors cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </button>

                            {/* Botão Voltar (Desvirar Card) */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMidFlip(true);
                                    onToggleFlip(project.id);
                                }}
                                title={t.projects.backToDetails}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/75 text-gray-300 hover:text-white border border-white/15 transition-all cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Área Central: Visualizador da Imagem com Botões de Passar */}
                    <div className="relative flex-1 w-full overflow-hidden bg-black flex items-center justify-center">
                        {/* Fundo ambiente desfocado para preencher qualquer proporção (16:9 web ou 9:16 mobile) */}
                        {currentImage && (
                            <img
                                src={currentImage}
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
                                draggable={false}
                            />
                        )}

                        {/* Imagem Principal Nítida */}
                        <AnimatePresence mode="wait">
                            <Motion.img
                                key={`${project.id}-${safeImgIndex}`}
                                src={currentImage}
                                alt={`${project.name} - ${safeImgIndex + 1}`}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.22 }}
                                draggable={false}
                                className="relative z-10 w-full h-full object-contain p-2.5 drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)]"
                            />
                        </AnimatePresence>

                        {/* Botões de Passar Imagem (apenas quando houver mais de 1 imagem) */}
                        {hasMultipleImages && (
                            <>
                                <button
                                    type="button"
                                    onClick={handlePrevImg}
                                    aria-label="Previous screenshot"
                                    className="
                                        absolute left-2.5 top-1/2 -translate-y-1/2 z-20
                                        w-9 h-9 rounded-full
                                        bg-black/70 hover:bg-cyan-500/80
                                        border border-white/20 hover:border-cyan-300
                                        text-white flex items-center justify-center
                                        backdrop-blur-md shadow-lg
                                        transition-all active:scale-90 cursor-pointer
                                    "
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleNextImg}
                                    aria-label="Next screenshot"
                                    className="
                                        absolute right-2.5 top-1/2 -translate-y-1/2 z-20
                                        w-9 h-9 rounded-full
                                        bg-black/70 hover:bg-cyan-500/80
                                        border border-white/20 hover:border-cyan-300
                                        text-white flex items-center justify-center
                                        backdrop-blur-md shadow-lg
                                        transition-all active:scale-90 cursor-pointer
                                    "
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {/* Indicadores (bolinhas) das imagens */}
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 border border-white/10 backdrop-blur-md"
                                >
                                    {images.map((_, dotIdx) => (
                                        <button
                                            key={dotIdx}
                                            type="button"
                                            onClick={() => setImgIndex(dotIdx)}
                                            aria-label={`Screenshot ${dotIdx + 1}`}
                                            className={`h-2 rounded-full transition-all cursor-pointer ${dotIdx === safeImgIndex
                                                    ? "w-5 bg-cyan-400 shadow-[0_0_8px_cyan]"
                                                    : "w-2 bg-white/35 hover:bg-white/60"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Barra de Ação Inferior no Verso */}
                    <div className="flex items-center gap-2.5 p-3.5 bg-slate-950/95 border-t border-white/10 z-20 shrink-0">
                        {meta.url === "#" ? (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 py-2 rounded-full bg-white/5 border border-white/10 text-amber-300/85 text-xs font-bold flex items-center justify-center gap-1.5 cursor-default"
                            >
                                <span>🚧</span>
                                <span>{t.projects.status.soon}</span>
                            </div>
                        ) : meta.url ? (
                            <a
                                href={meta.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300 flex justify-center items-center gap-1.5 border border-cyan-400/30 cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                {t.projects.viewProject}
                            </a>
                        ) : null}

                        <a
                            href={meta.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`${meta.url ? "px-4" : "flex-1 justify-center px-4"} py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-colors flex items-center gap-1.5 cursor-pointer`}
                        >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            {t.projects.github}
                        </a>
                    </div>
                </div>
            </Motion.div>
        </Motion.div>
    );
};

export default function Projects() {
    const x = useMotionValue(0);
    const { t } = useLanguage();
    const { width = 1200 } = useWindowSize();
    const [flippedId, setFlippedId] = useState(null);
    const [lightbox, setLightbox] = useState(null);

    const projectsList = t.projects.list;

    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;
    const cardWidth = isMobile ? Math.min(width - 28, 360) : isTablet ? 430 : 480;
    const cardHeight = isMobile ? 510 : isTablet ? 540 : 570;
    const cardGap = isMobile ? 24 : isTablet ? 36 : 52;
    const step = cardWidth + cardGap;

    const slideBy = (delta) => {
        setFlippedId(null);
        animate(x, x.get() + delta, {
            type: "spring",
            stiffness: 190,
            damping: 26,
        });
    };

    const handleNext = () => slideBy(-step);
    const handlePrev = () => slideBy(step);

    const handleCenterCard = (currentCardOffset) => {
        animate(x, x.get() - currentCardOffset, {
            type: "spring",
            stiffness: 200,
            damping: 26,
        });
    };

    const handleToggleFlip = (id) => {
        setFlippedId((prev) => (prev === id ? null : id));
    };

    return (
        <section
            id="projetos"
            className="relative w-full flex flex-col items-center justify-center overflow-hidden py-24"
        >
            {/* Título da Seção */}
            <div className="z-10 text-center max-w-3xl mx-auto mb-10 px-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-xl">
                    {t.projects.title}
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto mt-4 rounded-full shadow-[0_0_15px_cyan]" />
                <p className="text-gray-400 mt-5 text-sm md:text-base leading-relaxed">
                    {t.projects.subtitle}
                </p>
            </div>

            {/* Palco do Carrossel de Projetos */}
            <div
                style={{ height: cardHeight + 40 }}
                className="relative w-full flex items-center justify-center"
            >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                    {projectsList.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                            totalItems={projectsList.length}
                            x={x}
                            cardWidth={cardWidth}
                            cardHeight={cardHeight}
                            cardGap={cardGap}
                            isFlipped={flippedId === project.id}
                            onToggleFlip={handleToggleFlip}
                            onCenterCard={handleCenterCard}
                            onOpenLightbox={(data) =>
                                setLightbox({ ...data, index: data.initialIndex })
                            }
                            t={t}
                        />
                    ))}
                </div>
            </div>

            {/* Controles de Navegação do Carrossel */}
            <div className="relative z-50 flex items-center justify-center gap-4 mt-6">
                <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous project"
                    className="p-3.5 rounded-full bg-white/5 border border-white/15 text-white hover:bg-cyan-500/20 hover:border-cyan-400/60 transition-all backdrop-blur-md group flex items-center justify-center cursor-pointer active:scale-95 shadow-lg"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Atalhos diretos por projeto */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/45 border border-white/10 backdrop-blur-md">
                    {projectsList.map((proj, idx) => {
                        const isThisFlipped = flippedId === proj.id;
                        return (
                            <button
                                key={proj.id}
                                type="button"
                                title={proj.name}
                                onClick={() => {
                                    const totalW = projectsList.length * step;
                                    const curOffset = wrap(-totalW / 2, totalW / 2, idx * step + x.get());
                                    handleCenterCard(curOffset);
                                    setFlippedId(null);
                                }}
                                className={`h-2.5 rounded-full transition-all cursor-pointer ${isThisFlipped
                                        ? "w-6 bg-cyan-400 shadow-[0_0_10px_cyan]"
                                        : "w-2.5 bg-white/30 hover:bg-cyan-400/75"
                                    }`}
                            />
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next project"
                    className="p-3.5 rounded-full bg-white/5 border border-white/15 text-white hover:bg-cyan-500/20 hover:border-cyan-400/60 transition-all backdrop-blur-md group flex items-center justify-center cursor-pointer active:scale-95 shadow-lg"
                >
                    <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Modal Lightbox (Tela Cheia opcional ao clicar no ícone de expandir) */}
            <AnimatePresence>
                {lightbox && (
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                        className="fixed inset-0 z-hud bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-5xl w-full max-h-[88dvh] flex flex-col items-center"
                        >
                            <div className="w-full flex items-center justify-between mb-3 px-2">
                                <div className="text-white font-bold text-base md:text-lg">
                                    {lightbox.name}
                                    {lightbox.images.length > 1 && (
                                        <span className="ml-3 text-xs font-mono text-cyan-400">
                                            {lightbox.index + 1} / {lightbox.images.length}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setLightbox(null)}
                                    className="p-2 rounded-full bg-white/10 hover:bg-red-500/70 text-white transition-colors cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="relative w-full flex items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-slate-950/80 p-2">
                                <img
                                    src={lightbox.images[lightbox.index]}
                                    alt={lightbox.name}
                                    className="max-h-[75dvh] w-auto object-contain rounded-lg"
                                />

                                {lightbox.images.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setLightbox((prev) => ({
                                                    ...prev,
                                                    index:
                                                        (prev.index - 1 + prev.images.length) %
                                                        prev.images.length,
                                                }))
                                            }
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-cyan-500/80 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setLightbox((prev) => ({
                                                    ...prev,
                                                    index: (prev.index + 1) % prev.images.length,
                                                }))
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-cyan-500/80 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
