import { useState, useEffect } from "react";
import { useScrollHide } from "../hooks/useScrollHide";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import { jumpToSection, playHeroAnimation } from "../utils/scrollToSection";

export default function HeroOverlay() {
  const hidden = useScrollHide(0.3);
  const [instantBypass, setInstantBypass] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onBypass = () => setInstantBypass(true);
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.25) {
        setInstantBypass(false);
      }
    };
    window.addEventListener("navBypassFrames", onBypass);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("navBypassFrames", onBypass);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isHidden = hidden || instantBypass;

  return (
    <section
      className={`
        fixed top-0 left-0 w-full h-[100dvh] z-hero
        flex items-center
        ${instantBypass ? "transition-none" : "transition-all duration-500 ease-out"}
        ${isHidden
          ? "opacity-0 -translate-y-16 pointer-events-none"
          : "opacity-100 translate-y-0"}
      `}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-16 w-full flex flex-col-reverse md:flex-row justify-center md:justify-between items-center gap-5 md:gap-0 mt-14 md:mt-0">

        {/* Left Content */}
        <div className="max-w-2xl space-y-4 md:space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            {t.hero.title}
          </h1>

          <p className="text-lg md:text-xl text-cyan-400 font-medium">
            {t.hero.role}
          </p>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto md:mx-0">
            {t.hero.description}
          </p>

          <div className="flex justify-center md:justify-start gap-4 pt-2 md:pt-4">
            <Link
              to="/curriculo"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-sm md:text-base flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {t.hero.viewProjects}
            </Link>

            <a
              href="/#contatar"
              onClick={(e) => {
                e.preventDefault();
                jumpToSection("contatar");
              }}
              className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white font-bold backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-95 cursor-pointer text-sm md:text-base flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {t.hero.contactMe}
            </a>
          </div>
        </div>

        {/* Right Column: Floating Image + Animation Button */}
        <div className="flex flex-col items-center gap-4 md:gap-5">
          <div className="relative group animate-float">
            {/* Glow Effect Layer */}
            <div className="absolute -inset-px bg-gradient-to-b from-cyan-400 to-blue-600 rounded-[2rem] opacity-80 blur-md group-hover:opacity-100 transition duration-500" />

            {/* Image Container */}
            <div className="relative w-44 h-[240px] sm:w-60 sm:h-[360px] md:w-72 md:h-[420px] rounded-[2rem] bg-gray-900 border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
              <img
                src="/assets/icone.jpg"
                alt={t.hero.imageAlt}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>
          </div>

          {/* Botão Animation logo abaixo da imagem flutuante */}
          <button
            type="button"
            onClick={() => playHeroAnimation(5600)}
            className="
              group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full
              bg-slate-950/80 hover:bg-cyan-500/15
              border border-cyan-400/45 hover:border-cyan-400
              text-cyan-300 hover:text-white font-mono text-xs md:text-sm font-bold uppercase tracking-widest
              shadow-[0_0_20px_rgba(34,211,238,0.22)] hover:shadow-[0_0_28px_rgba(34,211,238,0.45)]
              backdrop-blur-md transition-all duration-300 active:scale-95 cursor-pointer
            "
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
            </span>
            <svg
              className="w-4 h-4 text-cyan-400 group-hover:translate-y-0.5 transition-transform"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>{t.hero.animationBtn}</span>
          </button>
        </div>

      </div>
    </section>
  );
}
