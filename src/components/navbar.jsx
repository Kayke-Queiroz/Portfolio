import { useState, useId } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { jumpToSection, jumpToTop } from '../utils/scrollToSection';

const BrazilFlag = ({ className = "w-7 h-5" }) => (
  <svg
    viewBox="0 0 28 20"
    className={`${className} rounded-[4px] shadow-sm shrink-0`}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="28" height="20" rx="2.5" fill="#009B3A" />
    <polygon points="14,2.2 25.4,10 14,17.8 2.6,10" fill="#FEDF00" />
    <circle cx="14" cy="10" r="4.6" fill="#002776" />
    <path
      d="M9.6 8.9C11.9 8.1 15.8 8.5 18.4 10.6"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const USAFlag = ({ className = "w-7 h-5" }) => {
  const clipId = useId();
  return (
    <svg
      viewBox="0 0 28 20"
      className={`${className} rounded-[4px] shadow-sm shrink-0`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="28" height="20" rx="2.5" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="28" height="20" fill="#FFFFFF" />
        <rect y="0" width="28" height="1.54" fill="#B22234" />
        <rect y="3.08" width="28" height="1.54" fill="#B22234" />
        <rect y="6.15" width="28" height="1.54" fill="#B22234" />
        <rect y="9.23" width="28" height="1.54" fill="#B22234" />
        <rect y="12.31" width="28" height="1.54" fill="#B22234" />
        <rect y="15.38" width="28" height="1.54" fill="#B22234" />
        <rect y="18.46" width="28" height="1.54" fill="#B22234" />
        <rect width="12" height="10.77" fill="#3C3B6E" />
        <g fill="#FFFFFF">
          <circle cx="2.2" cy="2" r="0.65" />
          <circle cx="4.7" cy="2" r="0.65" />
          <circle cx="7.2" cy="2" r="0.65" />
          <circle cx="9.7" cy="2" r="0.65" />
          <circle cx="3.45" cy="3.7" r="0.65" />
          <circle cx="5.95" cy="3.7" r="0.65" />
          <circle cx="8.45" cy="3.7" r="0.65" />
          <circle cx="2.2" cy="5.4" r="0.65" />
          <circle cx="4.7" cy="5.4" r="0.65" />
          <circle cx="7.2" cy="5.4" r="0.65" />
          <circle cx="9.7" cy="5.4" r="0.65" />
          <circle cx="3.45" cy="7.1" r="0.65" />
          <circle cx="5.95" cy="7.1" r="0.65" />
          <circle cx="8.45" cy="7.1" r="0.65" />
          <circle cx="2.2" cy="8.8" r="0.65" />
          <circle cx="4.7" cy="8.8" r="0.65" />
          <circle cx="7.2" cy="8.8" r="0.65" />
          <circle cx="9.7" cy="8.8" r="0.65" />
        </g>
      </g>
    </svg>
  );
};

const Navbar = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { key: 'curriculum', label: t.navbar.curriculum, path: '/curriculo', isRoute: true },
    { key: 'experience', label: t.navbar.experience, sectionId: 'experiencia' },
    { key: 'skills', label: t.navbar.skills, sectionId: 'skills' },
    { key: 'projects', label: t.navbar.projects, sectionId: 'projetos' },
    { key: 'contact', label: t.navbar.contact, sectionId: 'contatar' },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogoClick = (e) => {
    closeMenu();
    if (location.pathname === '/') {
      e.preventDefault();
      jumpToTop();
    }
  };

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    closeMenu();

    if (location.pathname === '/') {
      jumpToSection(sectionId);
    } else {
      sessionStorage.setItem('pendingSectionJump', sectionId);
      sessionStorage.setItem('skipFramesLock', 'true');
      navigate('/');
    }
  };

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-nav
        bg-slate-950/80 backdrop-blur-xl
        border-b border-white/10
        shadow-[0_4px_30px_rgba(0,0,0,0.45)]
      "
    >
      <nav
        className="
          max-w-[1600px] mx-auto
          flex items-center justify-between
          px-6 h-16 md:h-20
        "
      >
        {/* Logo (Left) */}
        <Link
          to="/"
          onClick={handleLogoClick}
          className="
            text-xl sm:text-2xl md:text-3xl font-bold tracking-widest text-cyan-400
            drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]
            uppercase
            hover:text-cyan-300 transition-colors cursor-pointer
            z-50
          "
        >
          Kayke.Santos
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-5 lg:gap-7">
          {/* Internal Links */}
          <ul className="flex items-center gap-5 lg:gap-7 text-sm lg:text-base font-medium text-gray-300">
            {navItems.map((item) => {
              const isActiveRoute = item.isRoute && location.pathname === item.path;
              return (
                <li key={item.key} className="relative group">
                  {item.isRoute ? (
                    <Link
                      to={item.path}
                      className={`transition-colors duration-300 group-hover:text-cyan-400 ${
                        isActiveRoute ? 'text-cyan-400 font-semibold' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={`/#${item.sectionId}`}
                      onClick={(e) => handleSectionClick(e, item.sectionId)}
                      className="transition-colors duration-300 group-hover:text-cyan-400 cursor-pointer"
                    >
                      {item.label}
                    </a>
                  )}
                  {/* Linha animada */}
                  <span
                    className={`
                      absolute left-0 -bottom-1
                      h-[2px] bg-cyan-400
                      transition-all duration-300
                      shadow-[0_0_8px_rgba(34,211,238,0.8)]
                      ${isActiveRoute ? 'w-full' : 'w-0 group-hover:w-full'}
                    `}
                  />
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          <div className="w-px h-6 bg-white/15" />

          {/* Language Toggle com Bandeiras Reais em SVG */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={language === 'pt' ? 'Switch to English (US)' : 'Mudar para Português (BR)'}
            aria-label={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
            className="
              group flex items-center gap-2 px-2.5 py-1.5 rounded-full
              bg-white/5 hover:bg-white/10
              border border-white/10 hover:border-cyan-400/50
              transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer
            "
          >
            {language === 'pt' ? (
              <>
                <USAFlag className="w-6 h-[17px]" />
                <span className="text-xs font-mono font-bold text-gray-300 group-hover:text-cyan-300">
                  EN
                </span>
              </>
            ) : (
              <>
                <BrazilFlag className="w-6 h-[17px]" />
                <span className="text-xs font-mono font-bold text-gray-300 group-hover:text-cyan-300">
                  PT
                </span>
              </>
            )}
          </button>

          {/* Social Icons (GitHub/LinkedIn) */}
          <div className="flex gap-3">
            {/* GitHub */}
            <a
              href="https://github.com/Kayke-Queiroz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="group w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-white/10 transition-all"
            >
              <svg viewBox="0 0 98 96" className="w-5 h-5 fill-gray-300 group-hover:fill-cyan-400 transition-colors" xmlns="http://www.w3.org/2000/svg">
                <path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 0 48.9043 0C21.8203 0 0 22.1074 0 49.1914C0 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/kaykequeiroz/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="group w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-white/10 transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-300 group-hover:fill-cyan-400 transition-colors" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden text-white z-50 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Mobile Dropdown Menu */}
        <div
          className={`
              absolute top-full left-0 w-full
              bg-[#020617]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-cyan-900/20
              flex flex-col items-center py-6 gap-5
              transition-all duration-300 origin-top md:hidden
              ${isMenuOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-0 invisible'}
           `}
        >
          <ul className="flex flex-col items-center gap-4 w-full">
            {navItems.map((item) => (
              <li key={item.key} className="w-full text-center">
                {item.isRoute ? (
                  <Link
                    to={item.path}
                    className="block py-2 text-lg font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition-all"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={`/#${item.sectionId}`}
                    className="block py-2 text-lg font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition-all cursor-pointer"
                    onClick={(e) => handleSectionClick(e, item.sectionId)}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="w-1/3 h-px bg-white/10" />

          {/* Footer Mobile: Bandeira SVG + Redes Sociais */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={toggleLanguage}
              title={language === 'pt' ? 'Switch to English (US)' : 'Mudar para Português (BR)'}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 hover:border-cyan-400/50 transition-all"
            >
              {language === 'pt' ? (
                <>
                  <USAFlag className="w-7 h-5" />
                  <span className="text-xs font-mono font-bold text-gray-200">EN</span>
                </>
              ) : (
                <>
                  <BrazilFlag className="w-7 h-5" />
                  <span className="text-xs font-mono font-bold text-gray-200">PT</span>
                </>
              )}
            </button>

            <div className="w-px h-6 bg-white/20" />

            <div className="flex gap-5">
              <a
                href="https://github.com/Kayke-Queiroz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 98 96" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 0 48.9043 0C21.8203 0 0 22.1074 0 49.1914C0 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/kaykequeiroz/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      </nav>
    </header>
  );
};

export default Navbar;
