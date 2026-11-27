import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useWindowSize } from "../hooks/useWindowSize";

const GH_TECH_BASE = "https://raw.githubusercontent.com/Kayke-Queiroz/Kayke-Queiroz/main/tech";

const skills = [
    // AI & Automation
    { name: "LangChain", category: "AI & Automation", icon: `${GH_TECH_BASE}/langchain.svg` },
    { name: "Claude", category: "AI & Automation", icon: `${GH_TECH_BASE}/claude.svg` },
    { name: "OpenAI API", category: "AI & Automation", icon: `${GH_TECH_BASE}/gpt.svg` },
    { name: "Gemini", category: "AI & Automation", icon: `${GH_TECH_BASE}/gemini.svg` },
    { name: "Hugging Face", category: "AI & Automation", icon: `${GH_TECH_BASE}/huggingface.svg` },
    { name: "n8n", category: "AI & Automation", icon: `${GH_TECH_BASE}/n8n.svg` },

    // Languages
    { name: "Python", category: "Languages", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { name: "TypeScript", category: "Languages", icon: `${GH_TECH_BASE}/ts.svg` },
    { name: "JavaScript", category: "Languages", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "Java", category: "Languages", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
    { name: "C++", category: "Languages", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
    { name: "HTML", category: "Languages", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS", category: "Languages", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },

    // Frameworks & Backend
    { name: "FastAPI", category: "Frameworks", icon: `${GH_TECH_BASE}/fastapi.svg` },
    { name: "Node.js", category: "Frameworks", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "React", category: "Frameworks", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Prisma", category: "Frameworks", icon: `${GH_TECH_BASE}/prisma.svg`, glowLight: true },
    { name: "Tailwind", category: "Frameworks", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Strapi", category: "Frameworks", icon: `${GH_TECH_BASE}/Strapi.svg` },

    // Tools
    { name: "Git", category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "GitHub", category: "Tools", icon: `${GH_TECH_BASE}/github2.svg` },
    { name: "Postman", category: "Tools", icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
    { name: "Antigravity", category: "Tools", icon: `${GH_TECH_BASE}/anti.svg` },
    { name: "Figma", category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    { name: "Expo Go", category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/expo/expo-original.svg", darkIcon: true },
    { name: "Windows", category: "Tools", icon: `${GH_TECH_BASE}/windows.svg` },

    // Cloud, Databases & Platforms
    { name: "PostgreSQL", category: "Platforms", icon: `${GH_TECH_BASE}/postgre.svg` },
    { name: "Docker", category: "Platforms", icon: `${GH_TECH_BASE}/docker.svg` },
    { name: "AWS", category: "Platforms", icon: `${GH_TECH_BASE}/aws.svg`, glowLight: true },
    { name: "Google Cloud", category: "Platforms", icon: `${GH_TECH_BASE}/google.svg` },
    { name: "FireBase", category: "Platforms", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
    { name: "Vercel", category: "Platforms", icon: `${GH_TECH_BASE}/Vercel.svg`, glowLight: true },
    { name: "WordPress", category: "Platforms", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg" },
];

const categoryStyles = {
    "AI & Automation": {
        hex: "#22d3ee",
        rgb: "34, 211, 238",
        textClass: "text-cyan-300",
        borderClass: "border-cyan-400/60",
        bgClass: "bg-cyan-950/40",
        pillActiveClass: "border-cyan-400 bg-cyan-500/20 text-cyan-200",
    },
    "Languages": {
        hex: "#3b82f6",
        rgb: "59, 130, 246",
        textClass: "text-blue-300",
        borderClass: "border-blue-500/50",
        bgClass: "bg-blue-950/40",
        pillActiveClass: "border-blue-400 bg-blue-500/20 text-blue-200",
    },
    "Frameworks": {
        hex: "#a855f7",
        rgb: "168, 85, 247",
        textClass: "text-purple-300",
        borderClass: "border-purple-500/50",
        bgClass: "bg-purple-950/40",
        pillActiveClass: "border-purple-400 bg-purple-500/20 text-purple-200",
    },
    "Tools": {
        hex: "#f97316",
        rgb: "249, 115, 22",
        textClass: "text-orange-300",
        borderClass: "border-orange-500/50",
        bgClass: "bg-orange-950/40",
        pillActiveClass: "border-orange-400 bg-orange-500/20 text-orange-200",
    },
    "Platforms": {
        hex: "#22c55e",
        rgb: "34, 197, 94",
        textClass: "text-emerald-300",
        borderClass: "border-emerald-500/50",
        bgClass: "bg-emerald-950/40",
        pillActiveClass: "border-emerald-400 bg-emerald-500/20 text-emerald-200",
    },
};

// Matemática 3D (Matriz ortonormal 3x3 livre de gimbal lock)
const createIdentityMatrix = () => [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
];

const multiplyMatrices = (a, b) => [
    a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
    a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
    a[0] * b[2] + a[1] * b[5] + a[2] * b[8],

    a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
    a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
    a[3] * b[2] + a[4] * b[5] + a[5] * b[8],

    a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
    a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
    a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
];

const applyMatrix = (m, p) => ({
    x: m[0] * p.x + m[1] * p.y + m[2] * p.z,
    y: m[3] * p.x + m[4] * p.y + m[5] * p.z,
    z: m[6] * p.x + m[7] * p.y + m[8] * p.z,
});

const createScreenRotationMatrix = (alpha, beta) => {
    const ca = Math.cos(alpha);
    const sa = Math.sin(alpha);
    const cb = Math.cos(beta);
    const sb = Math.sin(beta);

    const ry = [
        ca, 0, sa,
        0, 1, 0,
        -sa, 0, ca,
    ];
    const rx = [
        1, 0, 0,
        0, cb, sb,
        0, -sb, cb,
    ];
    return multiplyMatrices(rx, ry);
};

const createAxisAngleMatrix = (kx, ky, kz, theta) => {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const t = 1 - c;
    return [
        t * kx * kx + c, t * kx * ky - s * kz, t * kx * kz + s * ky,
        t * kx * ky + s * kz, t * ky * ky + c, t * ky * kz - s * kx,
        t * kx * kz - s * ky, t * ky * kz + s * kx, t * kz * kz + c,
    ];
};

const orthonormalize = (m) => {
    let x0 = m[0], x1 = m[1], x2 = m[2];
    const lenX = Math.hypot(x0, x1, x2) || 1;
    x0 /= lenX; x1 /= lenX; x2 /= lenX;

    let y0 = m[3], y1 = m[4], y2 = m[5];
    const dotXY = x0 * y0 + x1 * y1 + x2 * y2;
    y0 -= dotXY * x0; y1 -= dotXY * x1; y2 -= dotXY * x2;
    const lenY = Math.hypot(y0, y1, y2) || 1;
    y0 /= lenY; y1 /= lenY; y2 /= lenY;

    const z0 = x1 * y2 - x2 * y1;
    const z1 = x2 * y0 - x0 * y2;
    const z2 = x0 * y1 - x1 * y0;

    return [x0, x1, x2, y0, y1, y2, z0, z1, z2];
};

export default function Skills() {
    const { t } = useLanguage();
    const { width = 1200 } = useWindowSize();

    const [selectedIndex, setSelectedIndex] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [isDraggingUI, setIsDraggingUI] = useState(false);

    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    // Esfera ampliada para acomodar as 33 bolinhas com presença visual forte
    const sphereConfig = useMemo(() => {
        if (isMobile) {
            return { radius: 152, orbSize: 52, containerSize: 375, fov: 490 };
        }
        if (isTablet) {
            return { radius: 220, orbSize: 64, containerSize: 530, fov: 680 };
        }
        return { radius: 280, orbSize: 76, containerSize: 670, fov: 840 };
    }, [isMobile, isTablet]);

    // Pontos distribuídos uniformemente em esfera de Fibonacci
    const basePoints = useMemo(() => {
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const n = skills.length;
        return skills.map((_, i) => {
            const y = 1 - ((i + 0.5) / n) * 2;
            const r = Math.sqrt(Math.max(0, 1 - y * y));
            const theta = goldenAngle * i;
            return {
                x: Math.cos(theta) * r,
                y,
                z: Math.sin(theta) * r,
            };
        });
    }, []);

    // Conexões entre vizinhos próximos na superfície da esfera
    const edges = useMemo(() => {
        const pairs = [];
        for (let i = 0; i < basePoints.length; i++) {
            for (let j = i + 1; j < basePoints.length; j++) {
                const dx = basePoints[i].x - basePoints[j].x;
                const dy = basePoints[i].y - basePoints[j].y;
                const dz = basePoints[i].z - basePoints[j].z;
                const dist = Math.hypot(dx, dy, dz);
                if (dist < 0.72) {
                    pairs.push([i, j]);
                }
            }
        }
        return pairs;
    }, [basePoints]);

    // Anéis meridianos da esfera para percepção 3D nítida
    const wireframeRings = useMemo(() => {
        const segments = 56;
        const rings = [];
        for (let ringType = 0; ringType < 3; ringType++) {
            const pts = [];
            for (let s = 0; s <= segments; s++) {
                const a = (s / segments) * Math.PI * 2;
                if (ringType === 0) pts.push({ x: Math.cos(a), y: 0, z: Math.sin(a) });
                if (ringType === 1) pts.push({ x: Math.cos(a), y: Math.sin(a), z: 0 });
                if (ringType === 2) pts.push({ x: 0, y: Math.cos(a), z: Math.sin(a) });
            }
            rings.push(pts);
        }
        return rings;
    }, []);

    const orbRefs = useRef([]);
    const canvasRef = useRef(null);
    const matrixRef = useRef(createIdentityMatrix());
    // Velocidade mais suave e cadenciada
    const velocityRef = useRef({ vx: 0.0011, vy: 0.00035 });
    const dragRef = useRef({
        active: false,
        pointerId: null,
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0,
        movedDistance: 0,
        lastMoveTime: 0,
    });
    const focusTargetRef = useRef(null);
    const frameCounterRef = useRef(0);

    const uiStateRef = useRef({
        selectedIndex,
        hoveredIndex,
        activeCategory,
        sphereConfig,
    });

    useEffect(() => {
        uiStateRef.current = {
            selectedIndex,
            hoveredIndex,
            activeCategory,
            sphereConfig,
        };
    }, [selectedIndex, hoveredIndex, activeCategory, sphereConfig]);

    const selectSkill = useCallback((index) => {
        setSelectedIndex((prev) => {
            const next = prev === index ? null : index;
            focusTargetRef.current = next;
            if (next !== null) {
                velocityRef.current = { vx: 0, vy: 0 };
            }
            return next;
        });
    }, []);

    const stepSkill = useCallback((direction) => {
        setSelectedIndex((prev) => {
            const base = prev === null ? 0 : prev + direction;
            const next = ((base % skills.length) + skills.length) % skills.length;
            focusTargetRef.current = next;
            velocityRef.current = { vx: 0, vy: 0 };
            return next;
        });
    }, []);

    // Loop 60fps para física 3D, projeção das bolinhas e canvas holográfico
    useEffect(() => {
        let animationFrameId;

        const renderLoop = () => {
            const {
                selectedIndex: selIdx,
                hoveredIndex: hovIdx,
                activeCategory: actCat,
                sphereConfig: cfg,
            } = uiStateRef.current;

            const drag = dragRef.current;
            const focusIdx = focusTargetRef.current;

            // 1. Atualização da rotação (foco suave ao clicar OU inércia + rotação lenta quando ocioso)
            if (!drag.active) {
                if (focusIdx !== null) {
                    const targetPoint = applyMatrix(matrixRef.current, basePoints[focusIdx]);
                    const clampedZ = Math.max(-1, Math.min(1, targetPoint.z));
                    const angleRemaining = Math.acos(clampedZ);

                    if (angleRemaining < 0.012) {
                        focusTargetRef.current = null;
                    } else {
                        let kx = targetPoint.y;
                        let ky = -targetPoint.x;
                        const norm = Math.hypot(kx, ky);

                        if (norm < 1e-4) {
                            kx = 0;
                            ky = 1;
                        } else {
                            kx /= norm;
                            ky /= norm;
                        }

                        const stepAngle = Math.min(angleRemaining * 0.09, 0.10);
                        const stepRot = createAxisAngleMatrix(kx, ky, 0, stepAngle);
                        matrixRef.current = multiplyMatrices(stepRot, matrixRef.current);
                    }
                } else {
                    // Giro ocioso mais lento e suave
                    const idleSpeedX = selIdx !== null ? 0 : 0.0011;
                    const idleSpeedY = selIdx !== null ? 0 : 0.00035;

                    velocityRef.current.vx = velocityRef.current.vx * 0.94 + idleSpeedX * 0.06;
                    velocityRef.current.vy = velocityRef.current.vy * 0.94 + idleSpeedY * 0.06;

                    if (Math.abs(velocityRef.current.vx) > 0.00003 || Math.abs(velocityRef.current.vy) > 0.00003) {
                        const rot = createScreenRotationMatrix(velocityRef.current.vx, velocityRef.current.vy);
                        matrixRef.current = multiplyMatrices(rot, matrixRef.current);
                    }
                }
            }

            frameCounterRef.current += 1;
            if (frameCounterRef.current % 60 === 0) {
                matrixRef.current = orthonormalize(matrixRef.current);
            }

            // 2. Projetar pontos das skills em 3D -> 2D
            const projected = basePoints.map((pt, i) => {
                const rotated = applyMatrix(matrixRef.current, pt);
                const worldX = rotated.x * cfg.radius;
                const worldY = rotated.y * cfg.radius;
                const worldZ = rotated.z * cfg.radius;

                const perspective = cfg.fov / (cfg.fov - worldZ);
                const screenX = worldX * perspective;
                const screenY = worldY * perspective;
                const depthNorm = (rotated.z + 1) / 2;

                return {
                    index: i,
                    screenX,
                    screenY,
                    rotatedZ: rotated.z,
                    perspective,
                    depthNorm,
                };
            });

            // 3. Desenhar núcleo esférico + anéis 3D + linhas de constelação no Canvas
            const canvas = canvasRef.current;
            if (canvas) {
                const dpr = window.devicePixelRatio || 1;
                const targetW = Math.floor(cfg.containerSize * dpr);
                const targetH = Math.floor(cfg.containerSize * dpr);
                if (canvas.width !== targetW || canvas.height !== targetH) {
                    canvas.width = targetW;
                    canvas.height = targetH;
                }

                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.save();
                    ctx.scale(dpr, dpr);
                    ctx.clearRect(0, 0, cfg.containerSize, cfg.containerSize);

                    const cx = cfg.containerSize / 2;
                    const cy = cfg.containerSize / 2;

                    const activeSkill = selIdx !== null ? skills[selIdx] : null;
                    const accentRgb = activeSkill
                        ? categoryStyles[activeSkill.category].rgb
                        : actCat
                            ? categoryStyles[actCat].rgb
                            : "34, 211, 238";

                    const coreGrad = ctx.createRadialGradient(cx, cy, cfg.radius * 0.05, cx, cy, cfg.radius * 1.12);
                    coreGrad.addColorStop(0, `rgba(${accentRgb}, 0.16)`);
                    coreGrad.addColorStop(0.55, `rgba(${accentRgb}, 0.06)`);
                    coreGrad.addColorStop(0.92, "rgba(15, 23, 42, 0.08)");
                    coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

                    ctx.fillStyle = coreGrad;
                    ctx.beginPath();
                    ctx.arc(cx, cy, cfg.radius * 1.12, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.strokeStyle = `rgba(${accentRgb}, 0.15)`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(cx, cy, cfg.radius * 1.01, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.lineWidth = 1;
                    wireframeRings.forEach((ring) => {
                        ctx.beginPath();
                        ring.forEach((pt, idx) => {
                            const rPt = applyMatrix(matrixRef.current, pt);
                            const wz = rPt.z * cfg.radius;
                            const persp = cfg.fov / (cfg.fov - wz);
                            const sx = cx + rPt.x * cfg.radius * persp;
                            const sy = cy + rPt.y * cfg.radius * persp;
                            if (idx === 0) ctx.moveTo(sx, sy);
                            else ctx.lineTo(sx, sy);
                        });
                        ctx.strokeStyle = `rgba(${accentRgb}, 0.09)`;
                        ctx.stroke();
                    });

                    edges.forEach(([i, j]) => {
                        const a = projected[i];
                        const b = projected[j];
                        const avgDepth = (a.depthNorm + b.depthNorm) / 2;
                        const isConnectedToSelected = selIdx !== null && (i === selIdx || j === selIdx);

                        const alpha = isConnectedToSelected
                            ? 0.48 * (0.4 + avgDepth * 0.6)
                            : 0.12 * avgDepth;

                        if (alpha > 0.02) {
                            ctx.strokeStyle = isConnectedToSelected
                                ? `rgba(${accentRgb}, ${alpha})`
                                : `rgba(148, 163, 184, ${alpha})`;
                            ctx.lineWidth = isConnectedToSelected ? 1.6 : 0.8;
                            ctx.beginPath();
                            ctx.moveTo(cx + a.screenX, cy + a.screenY);
                            ctx.lineTo(cx + b.screenX, cy + b.screenY);
                            ctx.stroke();
                        }
                    });

                    ctx.restore();
                }
            }

            // 4. Atualizar DOM de cada bolinha
            projected.forEach((p) => {
                const el = orbRefs.current[p.index];
                if (!el) return;

                const skill = skills[p.index];
                const isSelected = selIdx === p.index;
                const isHovered = hovIdx === p.index;
                const matchesCategory = actCat === null || skill.category === actCat;

                let scale = 0.58 + p.depthNorm * 0.50;
                if (isSelected) scale *= 1.35;
                else if (isHovered) scale *= 1.16;

                let opacity = 0.22 + p.depthNorm * 0.78;
                if (selIdx !== null && !isSelected) {
                    opacity *= 0.44;
                }
                if (!matchesCategory && !isSelected) {
                    opacity *= 0.26;
                }

                const zIndex = isSelected
                    ? 300
                    : isHovered
                        ? 260
                        : Math.round(p.depthNorm * 200) + 10;

                el.style.transform = `translate3d(${p.screenX.toFixed(2)}px, ${p.screenY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
                el.style.opacity = opacity.toFixed(3);
                el.style.zIndex = String(zIndex);
            });

            animationFrameId = requestAnimationFrame(renderLoop);
        };

        animationFrameId = requestAnimationFrame(renderLoop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [basePoints, edges, wireframeRings]);

    const handlePointerDown = (e) => {
        if (e.button !== undefined && e.button !== 0) return;

        dragRef.current = {
            active: true,
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            lastX: e.clientX,
            lastY: e.clientY,
            movedDistance: 0,
            lastMoveTime: performance.now(),
        };
        focusTargetRef.current = null;
        velocityRef.current = { vx: 0, vy: 0 };
        setIsDraggingUI(true);
    };

    const handlePointerMove = (e) => {
        const drag = dragRef.current;
        if (!drag.active || drag.pointerId !== e.pointerId) return;

        const dx = e.clientX - drag.lastX;
        const dy = e.clientY - drag.lastY;
        drag.lastX = e.clientX;
        drag.lastY = e.clientY;
        drag.movedDistance += Math.hypot(dx, dy);
        drag.lastMoveTime = performance.now();

        // Sensibilidade reduzida para um giro manual mais controlado e suave
        const sensitivity = isMobile ? 0.0052 : 0.0036;
        const alpha = dx * sensitivity;
        const beta = dy * sensitivity;

        const rot = createScreenRotationMatrix(alpha, beta);
        matrixRef.current = multiplyMatrices(rot, matrixRef.current);

        velocityRef.current = {
            vx: Math.max(-0.045, Math.min(0.045, alpha)),
            vy: Math.max(-0.045, Math.min(0.045, beta)),
        };
    };

    const handlePointerUpOrCancel = (e) => {
        const drag = dragRef.current;
        if (!drag.active || drag.pointerId !== e.pointerId) return;

        if (performance.now() - drag.lastMoveTime > 90) {
            velocityRef.current = { vx: 0, vy: 0 };
        }

        drag.active = false;
        drag.pointerId = null;
        setIsDraggingUI(false);
    };

    const handleSphereBackgroundClick = () => {
        if (dragRef.current.movedDistance < 6 && selectedIndex !== null) {
            setSelectedIndex(null);
            focusTargetRef.current = null;
        }
    };

    const categoryLabels = {
        "AI & Automation": t.skills.categories.ai,
        "Languages": t.skills.categories.languages,
        "Frameworks": t.skills.categories.frameworks,
        "Tools": t.skills.categories.tools,
        "Platforms": t.skills.categories.platforms,
    };

    const selectedSkill = selectedIndex !== null ? skills[selectedIndex] : null;
    const selectedStyle = selectedSkill ? categoryStyles[selectedSkill.category] : null;

    return (
        <section
            id="skills"
            className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden z-0 py-24 px-4 select-none"
        >
            {/* Luzes de ambiente sutis ao fundo */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                    className="w-[500px] h-[500px] md:w-[760px] md:h-[760px] rounded-full blur-[140px] opacity-20 transition-colors duration-700"
                    style={{
                        backgroundColor: selectedStyle ? selectedStyle.hex : "#22d3ee",
                    }}
                />
            </div>

            {/* Cabeçalho da Seção */}
            <div className="z-20 text-center max-w-2xl mx-auto mb-2 md:mb-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-xl">
                    {t.skills.title}
                </h2>
                <div
                    className="w-16 h-1 mx-auto mt-3 rounded-full transition-colors duration-500"
                    style={{
                        backgroundColor: selectedStyle ? selectedStyle.hex : "#06b6d4",
                        boxShadow: `0 0 14px ${selectedStyle ? selectedStyle.hex : "#22d3ee"}`,
                    }}
                />
                <p className="text-gray-400 text-xs md:text-sm mt-4 font-mono tracking-wide">
                    {t.skills.subtitle}
                </p>
            </div>

            {/* Palco da Esfera 3D Interativa Ampliada */}
            <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUpOrCancel}
                onPointerCancel={handlePointerUpOrCancel}
                onPointerLeave={handlePointerUpOrCancel}
                onClick={handleSphereBackgroundClick}
                style={{
                    width: sphereConfig.containerSize,
                    height: sphereConfig.containerSize,
                    touchAction: "none",
                }}
                className={`relative flex items-center justify-center my-2 ${
                    isDraggingUI ? "cursor-grabbing" : "cursor-grab"
                }`}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        width: sphereConfig.containerSize,
                        height: sphereConfig.containerSize,
                    }}
                    className="absolute inset-0 pointer-events-none z-0"
                />

                {skills.map((skill, index) => {
                    const style = categoryStyles[skill.category] || categoryStyles["Tools"];
                    const isSelected = selectedIndex === index;
                    const isHovered = hoveredIndex === index;

                    return (
                        <button
                            key={skill.name}
                            type="button"
                            ref={(el) => {
                                orbRefs.current[index] = el;
                            }}
                            aria-label={skill.name}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex((prev) => (prev === index ? null : prev))}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (dragRef.current.movedDistance < 7) {
                                    selectSkill(index);
                                }
                            }}
                            style={{
                                width: sphereConfig.orbSize,
                                height: sphereConfig.orbSize,
                                marginLeft: -sphereConfig.orbSize / 2,
                                marginTop: -sphereConfig.orbSize / 2,
                                background: isSelected
                                    ? `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.34), rgba(${style.rgb}, 0.42) 55%, rgba(2,6,23,0.92) 100%)`
                                    : `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.18), rgba(${style.rgb}, 0.20) 58%, rgba(2,6,23,0.88) 100%)`,
                                borderColor: isSelected
                                    ? style.hex
                                    : isHovered
                                        ? `rgba(${style.rgb}, 0.9)`
                                        : `rgba(${style.rgb}, 0.48)`,
                                boxShadow: isSelected
                                    ? `0 0 32px rgba(${style.rgb}, 0.85), 0 0 60px rgba(${style.rgb}, 0.4), inset 0 0 18px rgba(255,255,255,0.35)`
                                    : isHovered
                                        ? `0 0 20px rgba(${style.rgb}, 0.55), inset 0 0 12px rgba(255,255,255,0.2)`
                                        : `0 6px 18px rgba(0,0,0,0.55), inset 0 1px 10px rgba(255,255,255,0.12)`,
                                willChange: "transform, opacity",
                            }}
                            className={`
                                absolute top-1/2 left-1/2
                                rounded-full border-2
                                flex items-center justify-center
                                backdrop-blur-md
                                transition-[border-color,box-shadow] duration-300
                                focus:outline-none
                                ${isDraggingUI ? "cursor-grabbing" : "cursor-pointer"}
                            `}
                        >
                            {isSelected && (
                                <span
                                    className="absolute -inset-2 rounded-full border-2 animate-ping opacity-40 pointer-events-none"
                                    style={{ borderColor: style.hex }}
                                />
                            )}

                            <span className="absolute top-1.5 left-1/4 w-1/2 h-2 rounded-full bg-white/20 blur-[1px] pointer-events-none" />

                            <div className="relative z-10 w-[56%] h-[56%] flex items-center justify-center pointer-events-none">
                                <img
                                    src={skill.icon}
                                    alt={skill.name}
                                    draggable={false}
                                    className={`w-full h-full object-contain ${
                                        skill.darkIcon
                                            ? "brightness-0 invert drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                                            : skill.glowLight
                                                ? "drop-shadow-[0_0_4px_rgba(255,255,255,0.55)]"
                                                : "drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                                    }`}
                                />
                            </div>

                            {(isSelected || (isHovered && !isDraggingUI)) && (
                                <div
                                    style={{
                                        borderColor: `rgba(${style.rgb}, 0.65)`,
                                        boxShadow: isSelected
                                            ? `0 8px 25px rgba(0,0,0,0.8), 0 0 16px rgba(${style.rgb}, 0.45)`
                                            : "0 4px 14px rgba(0,0,0,0.7)",
                                    }}
                                    className="absolute top-full mt-2.5 px-3 py-1 rounded-full bg-slate-950/95 border backdrop-blur-md whitespace-nowrap pointer-events-none flex items-center gap-1.5 z-50"
                                >
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{
                                            backgroundColor: style.hex,
                                            boxShadow: `0 0 8px ${style.hex}`,
                                        }}
                                    />
                                    <span className="text-white font-bold text-xs tracking-wide">
                                        {skill.name}
                                    </span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Painel HUD da Habilidade Destacada */}
            <div className="z-30 w-full max-w-md min-h-[88px] flex items-center justify-center mt-2 mb-6 px-2">
                <AnimatePresence mode="wait">
                    {selectedSkill && selectedStyle ? (
                        <Motion.div
                            key={selectedSkill.name}
                            initial={{ opacity: 0, y: 12, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.22 }}
                            style={{
                                borderColor: `rgba(${selectedStyle.rgb}, 0.5)`,
                                boxShadow: `0 0 30px rgba(${selectedStyle.rgb}, 0.2), inset 0 0 20px rgba(${selectedStyle.rgb}, 0.08)`,
                            }}
                            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-950/85 border backdrop-blur-xl"
                        >
                            <button
                                type="button"
                                onClick={() => stepSkill(-1)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                                aria-label="Previous skill"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                <div
                                    style={{
                                        borderColor: `rgba(${selectedStyle.rgb}, 0.55)`,
                                        background: `radial-gradient(circle at 30% 30%, rgba(${selectedStyle.rgb}, 0.3), rgba(2,6,23,0.9))`,
                                        boxShadow: `0 0 18px rgba(${selectedStyle.rgb}, 0.35)`,
                                    }}
                                    className="w-12 h-12 rounded-full border flex items-center justify-center shrink-0 p-2.5"
                                >
                                    <img
                                        src={selectedSkill.icon}
                                        alt={selectedSkill.name}
                                        className={`w-full h-full object-contain ${
                                            selectedSkill.darkIcon
                                                ? "brightness-0 invert"
                                                : selectedSkill.glowLight
                                                    ? "drop-shadow-[0_0_4px_rgba(255,255,255,0.55)]"
                                                    : ""
                                        }`}
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                                            {t.skills.selectedLabel}
                                        </span>
                                        <span className="text-[10px] font-mono text-gray-500">
                                            #{String(selectedIndex + 1).padStart(2, "0")}/{skills.length}
                                        </span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-white truncate">
                                        {selectedSkill.name}
                                    </h3>
                                    <span
                                        style={{ color: selectedStyle.hex }}
                                        className="text-xs font-semibold tracking-wider uppercase"
                                    >
                                        {categoryLabels[selectedSkill.category] || selectedSkill.category}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => stepSkill(1)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                                    aria-label="Next skill"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedIndex(null);
                                        focusTargetRef.current = null;
                                    }}
                                    title={t.skills.clearSelection}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 border border-white/10 hover:border-red-500/30 transition-colors cursor-pointer"
                                    aria-label={t.skills.clearSelection}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </Motion.div>
                    ) : (
                        <Motion.div
                            key="prompt"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-gray-400 text-xs md:text-sm"
                        >
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            <span>{t.skills.clickPrompt}</span>
                        </Motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Legenda de Categorias */}
            <div className="relative z-20 flex flex-wrap justify-center gap-2.5 md:gap-4 px-2 max-w-4xl">
                {Object.entries(categoryStyles).map(([category, style]) => {
                    const isCatActive = activeCategory === category;
                    return (
                        <button
                            key={category}
                            type="button"
                            onClick={() =>
                                setActiveCategory((prev) => (prev === category ? null : category))
                            }
                            style={{
                                borderColor: isCatActive ? style.hex : "rgba(255,255,255,0.1)",
                                boxShadow: isCatActive ? `0 0 16px rgba(${style.rgb}, 0.3)` : "none",
                            }}
                            className={`
                                flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-sm
                                transition-all duration-300 cursor-pointer
                                ${isCatActive ? style.pillActiveClass : "bg-black/40 hover:bg-white/10"}
                            `}
                        >
                            <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{
                                    backgroundColor: style.hex,
                                    boxShadow: `0 0 8px ${style.hex}`,
                                }}
                            />
                            <span className={`text-xs font-medium uppercase tracking-wider ${style.textClass}`}>
                                {categoryLabels[category] || category}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
