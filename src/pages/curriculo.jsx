import Navbar from "../components/navbar";
import { useLanguage } from "../context/LanguageContext";
import TechParticles from "../components/TechParticles";
import { motion as Motion } from "framer-motion";
import Footer from "../components/Footer";

export default function Curriculo() {
    const { t, language } = useLanguage();

    const pdfBaseUrl = `/assets/documents/${encodeURIComponent(t.curriculum.filename)}`;
    // view=FitH já abre preenchendo toda a largura do painel, mantendo a barra nativa (zoom +/-) ativa
    const pdfViewerUrl = `${pdfBaseUrl}#navpanes=0&view=FitH`;

    // A4 (595x842) em PT e US Letter (612x792) em EN, com espaço extra no topo para a barra de zoom do leitor
    const paperAspectClass =
        language === "pt" ? "aspect-[595/885]" : "aspect-[612/835]";

    return (
        <div className="relative min-h-[100dvh] bg-black text-white overflow-x-hidden">
            {/* Background Particles */}
            <div className="fixed inset-0 z-0">
                <TechParticles
                    options={{
                        color: "#22d3ee",
                        connectDistance: 130,
                        particleCount: 80,
                        mouseDistance: 200,
                    }}
                    className="opacity-40"
                />
            </div>

            <Navbar />

            <div className="relative z-10 pt-28 md:pt-32 pb-20 px-4 md:px-10 flex flex-col items-center">
                {/* Header */}
                <Motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 drop-shadow-sm">
                        {t.curriculum.title}
                    </h1>
                    <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full shadow-[0_0_15px_cyan]" />
                </Motion.div>

                {/* Container Principal do Painel */}
                <div className="flex flex-col gap-5 items-center w-full max-w-[940px]">
                    {/* Action Bar (Download) */}
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-full flex justify-end"
                    >
                        <a
                            href={pdfBaseUrl}
                            download={t.curriculum.filename}
                            className="
                                flex items-center gap-3 px-6 py-3 rounded-full 
                                bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm tracking-wider uppercase
                                shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]
                                transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95
                                border border-cyan-400/30 backdrop-blur-md
                            "
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {t.curriculum.download}
                        </a>
                    </Motion.div>

                    {/* Painel Exato na Proporção de Cada Currículo (PT A4 / EN Letter) */}
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className={`
                            relative w-full ${paperAspectClass}
                            bg-slate-950 text-black
                            rounded-xl border border-white/15
                            shadow-[0_0_60px_rgba(0,0,0,0.75)]
                            overflow-hidden
                        `}
                    >
                        <iframe
                            key={t.curriculum.filename}
                            src={pdfViewerUrl}
                            className="absolute inset-0 w-full h-full border-0 block"
                            title="Curriculum Preview"
                        />
                    </Motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
