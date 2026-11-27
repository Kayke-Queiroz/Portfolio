import { useState, useEffect, useRef } from 'react';

const SCROLL_HEIGHT_MULTIPLIER = 2; // 200vh
const END_THRESHOLD = 0.99;
const STICKY_EXTRA_RANGE = 0.005; // 0.5% a mais depois do 99%
const RESET_BELOW = 0.8; // se voltar muito, reseta o "travamento" final

const Frames = () => {
  const canvasRef = useRef(null);
  const bypassRef = useRef(false);
  const autoAnimatingRef = useRef(false);
  const lockTimerRef = useRef(null);

  const [frames, setFrames] = useState([]);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [lockScrollY, setLockScrollY] = useState(0);
  const [isBypassed, setIsBypassed] = useState(false);

  // ===============================
  // LISTENER DE SALTO DIRETO PELO HEADER
  // ===============================
  useEffect(() => {
    const handleBypass = () => {
      bypassRef.current = true;
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
      setIsBypassed(true);
      setIsScrollLocked(false);
      setHasReachedEnd(true);
      setScrollPercent(1);
    };

    const handleStartAutoAnim = () => {
      bypassRef.current = false;
      autoAnimatingRef.current = true;
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
      setIsBypassed(false);
      setIsScrollLocked(false);
    };

    const handleEndAutoAnim = () => {
      autoAnimatingRef.current = false;
    };

    window.addEventListener('navBypassFrames', handleBypass);
    window.addEventListener('navStartHeroAnimation', handleStartAutoAnim);
    window.addEventListener('navEndHeroAnimation', handleEndAutoAnim);
    return () => {
      window.removeEventListener('navBypassFrames', handleBypass);
      window.removeEventListener('navStartHeroAnimation', handleStartAutoAnim);
      window.removeEventListener('navEndHeroAnimation', handleEndAutoAnim);
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
      }
    };
  }, []);

  // ===============================
  // CARREGAMENTO DAS IMAGENS (BATCHED)
  // ===============================
  useEffect(() => {
    const loadImages = async () => {
      const frameModules = import.meta.glob(
        '../assets/videos/frames/*.jpg',
        { eager: true }
      );

      const sortedPaths = Object.keys(frameModules).sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || 0, 10);
        const numB = parseInt(b.match(/\d+/)?.[0] || 0, 10);
        return numA - numB;
      });

      const imageUrls = sortedPaths.map((path) => frameModules[path].default);

      // A. Carregar PRIMEIRO frame imediatamente para não deixar tela preta
      const firstImage = new Image();
      firstImage.src = imageUrls[0];
      firstImage.onload = () => {
        setFrames((prev) => (prev.length > 1 ? prev : [firstImage]));
      };

      await new Promise((resolve) => setTimeout(resolve, 100));

      // B. Carregar todos os frames em background
      const BATCH_SIZE = 20;
      const loaded = new Array(imageUrls.length);

      const loadImage = (url) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
        });

      for (let i = 0; i < imageUrls.length; i += BATCH_SIZE) {
        const batch = imageUrls.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(batch.map(loadImage));

        batchResults.forEach((img, idx) => {
          if (img) loaded[i + idx] = img;
        });

        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      const validImages = loaded.filter(Boolean);
      setFrames(validImages);
    };

    loadImages();
  }, []);

  // ===============================
  // NATIVE SCROLL CONTROLLER
  // ===============================
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const totalScrollHeight = SCROLL_HEIGHT_MULTIPLIER * window.innerHeight;
          const scrollTop = window.scrollY;
          const rawPercent = Math.min(1, Math.max(0, scrollTop / totalScrollHeight));

          // Verifica se o usuário clicou em algum botão de navegação rápida
          if (sessionStorage.getItem('skipFramesLock') === 'true') {
            sessionStorage.removeItem('skipFramesLock');
            bypassRef.current = true;
            setIsBypassed(true);
            setIsScrollLocked(false);
          }

          if (bypassRef.current) {
            // Se o usuário voltou manualmente lá para o topo do site, reativa a animação
            if (rawPercent < RESET_BELOW) {
              bypassRef.current = false;
              setIsBypassed(false);
              setHasReachedEnd(false);
              setScrollPercent(rawPercent);
            } else {
              setHasReachedEnd(true);
              setScrollPercent(1);
            }
            ticking = false;
            return;
          }

          // Enquanto estiver travado no final normal da animação, mantém a posição
          if (isScrollLocked) {
            window.scrollTo({ top: lockScrollY, behavior: 'instant' });
            ticking = false;
            return;
          }

          const wasAtEnd = hasReachedEnd;
          let nextHasReachedEnd = hasReachedEnd;

          if (nextHasReachedEnd && rawPercent < RESET_BELOW) {
            nextHasReachedEnd = false;
          }

          const becomingEndNow = !nextHasReachedEnd && rawPercent >= END_THRESHOLD;

          if (becomingEndNow) {
            nextHasReachedEnd = true;
            if (!autoAnimatingRef.current) {
              setIsScrollLocked(true);
              setLockScrollY(scrollTop);
              if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
              lockTimerRef.current = setTimeout(() => {
                setIsScrollLocked(false);
                lockTimerRef.current = null;
              }, 1000);
            }
          }

          if (nextHasReachedEnd !== hasReachedEnd) {
            setHasReachedEnd(nextHasReachedEnd);
          }

          const stickyEnd = END_THRESHOLD + STICKY_EXTRA_RANGE;
          const canFinish = wasAtEnd && rawPercent >= stickyEnd;

          let effectivePercent;

          if (!nextHasReachedEnd) {
            effectivePercent = rawPercent;
          } else if (!canFinish) {
            effectivePercent = END_THRESHOLD;
          } else {
            effectivePercent = rawPercent;
          }

          setScrollPercent(effectivePercent);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasReachedEnd, isScrollLocked, lockScrollY]);

  // ===============================
  // CANVAS RENDERER
  // ===============================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || frames.length === 0 || isBypassed) return;

    const ctx = canvas.getContext('2d');

    const frameIndex = scrollPercent >= END_THRESHOLD
      ? frames.length - 1
      : Math.floor(scrollPercent * (frames.length - 1));

    const img = frames[frameIndex];

    if (img) {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.width;
      const ih = img.height;

      const ratio = Math.max(cw / iw, ch / ih);
      const nw = iw * ratio;
      const nh = ih * ratio;
      const cx = (cw - nw) / 2;
      const cy = (ch - nh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, cx, cy, nw, nh);
    }
  }, [frames, scrollPercent, isBypassed]);

  // Resize handler for canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stickyEnd = END_THRESHOLD + STICKY_EXTRA_RANGE;
  const isEnd = isBypassed || (hasReachedEnd && scrollPercent >= stickyEnd && !isScrollLocked);

  return (
    <>
      {/* FRAME FIXO (ANIMAÇÃO) */}
      <div
        className={`fixed top-0 left-0 w-full h-[100dvh] bg-black z-overlay
          ${isBypassed ? 'transition-none opacity-0 pointer-events-none' : 'transition-opacity duration-300'}
          ${!isBypassed && isEnd ? 'opacity-0 pointer-events-none' : ''}
          ${!isBypassed && !isEnd ? 'opacity-100' : ''}
          ${scrollPercent === 0 ? 'pointer-events-none' : ''}
        `}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
      </div>

      {/* SCROLL / PLACEHOLDER */}
      <div style={{ height: '200vh' }}>
        <div className="h-[100dvh] w-full" />
      </div>
    </>
  );
};

export default Frames;
