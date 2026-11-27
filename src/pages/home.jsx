import { useState, useEffect, lazy, Suspense } from 'react'
import useLoading from '../hooks/useLoading'
import Loading from '../components/loading'
import Frames from '../components/frames'
import Navbar from '../components/navbar'
import HeroOverlay from '../components/HeroOverlay'
import HeroMessages from '../components/HeroMessages'
import BackgroundParticles from '../components/BackgroundParticles'
import { jumpToSection } from '../utils/scrollToSection'

// Lazy load components that are below the fold (avoids blocking initial render/download)
const About = lazy(() => import('../components/About'))
const Journey = lazy(() => import('../components/Journey'))
const Experience = lazy(() => import('../components/Experience'))
const Skills = lazy(() => import('../components/Skills'))
const Certificates = lazy(() => import('../components/Certificates'))
const Projects = lazy(() => import('../components/Projects'))
const Contact = lazy(() => import('../components/Contact'))
const Footer = lazy(() => import('../components/Footer'))

const ENABLE_LOADING = true

export default function Home() {
    const [skipLoadingForJump] = useState(
        () => Boolean(sessionStorage.getItem('pendingSectionJump'))
    )
    const isLoading = useLoading(2000)
    const shouldShowLoading = ENABLE_LOADING && isLoading && !skipLoadingForJump
    const [showParticles, setShowParticles] = useState(false)

    // Executa salto direto caso venha da página /curriculo clicando em seção do Header
    useEffect(() => {
        const pendingSection = sessionStorage.getItem('pendingSectionJump')
        if (pendingSection) {
            sessionStorage.removeItem('pendingSectionJump')
            jumpToSection(pendingSection)
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            // Show particles after scrolling past Hero (approx 100vh)
            const threshold = window.innerHeight * 0.8;
            setShowParticles(window.scrollY > threshold);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll lock when loading is visible
    useEffect(() => {
        if (shouldShowLoading) {
            document.body.style.overflow = 'hidden';
            window.scrollTo(0, 0);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [shouldShowLoading]);

    return (
        <>
            {/* 1. Loading screen runs as an overlay to allow background fetching */}
            {shouldShowLoading && <Loading />}

            <Navbar />
            <HeroOverlay />
            <Frames />
            <HeroMessages />

            {/* Background Particles - Visible only after Hero */}
            <BackgroundParticles show={showParticles} />

            {/* Small space above content */}
            <div className="relative z-content mt-[450px]">
                {/* 2. Suspense boundary for components below the fold */}
                <Suspense fallback={<div style={{ height: '100vh', background: 'transparent' }} />}>
                    <About />
                    <Journey />
                    <Experience />
                    <Skills />
                    <Projects />
                    <Certificates />
                    <Contact />
                    <Footer />
                </Suspense>
            </div>
        </>
    )
}
