import React, { useEffect, useRef, useState, type FC } from "react";
import { ReactLenis } from "lenis/react";
import { motion, useMotionTemplate, useScroll, useTransform, MotionValue } from "framer-motion";
import { ArrowDown, MapPin, Compass, Globe } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Helpers & hooks
 */
const isBrowser = typeof window !== "undefined";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(isBrowser ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    if (!isBrowser) return;
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIsMobile(window.innerWidth < breakpoint));
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [breakpoint]);

  return isMobile;
}

/** Measure an element and expose top/height. Uses ResizeObserver + manual measure. */
function useElementRect<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [rect, setRect] = useState({ top: 0, height: 0 });

  useEffect(() => {
    if (!isBrowser) return;
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const r = el.getBoundingClientRect();
      // convert to document coordinates
      const top = r.top + window.scrollY;
      setRect({ top, height: r.height });
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);

    const onResize = () => measure();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return { ref, rect } as const;
}

/**
 * Main enhanced hero component
 */
export const EnhancedHero: FC = () => {
  const isMobile = useIsMobile();
  const [scrollInitiated, setScrollInitiated] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;
    const onScroll = () => {
      if (window.scrollY > 10) setScrollInitiated(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-zinc-950">
      <ReactLenis
        root
        options={{
          lerp: isMobile ? 0.12 : 0.06,
          touchMultiplier: 1.2,
          smoothWheel: true,
          wheelMultiplier: 1.2,
        }}
      >
        <HeroSection isMobile={isMobile} scrollInitiated={scrollInitiated} />
      </ReactLenis>
    </div>
  );
};

/** Responsive height calculation (kept deterministic & lightweight) */
const useResponsiveSectionHeight = (isMobile: boolean) => {
  const [sectionHeight, setSectionHeight] = useState(1400);
  useEffect(() => {
    if (!isBrowser) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        const w = window.innerWidth;
        if (w < 640) setSectionHeight(Math.min(1400, Math.round(vh * 2.0)));
        else if (w < 1024) setSectionHeight(Math.min(1500, Math.round(vh * 2.2)));
        else setSectionHeight(Math.max(1500, Math.round(vh * 2.4)));
      });
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
    };
  }, [isMobile]);

  return sectionHeight;
};

/**
 * HeroSection that creates a single source of scroll (useScroll) and passes it down.
 * This avoids many useScroll instances and centralizes measurements for performance.
 */
const HeroSection: FC<{ isMobile: boolean; scrollInitiated: boolean }> = ({ isMobile, scrollInitiated }) => {
  const sectionHeight = useResponsiveSectionHeight(isMobile);
  // single global scroll motion value from framer-motion
  // useScroll without args returns viewport scroll values
  const { scrollY } = useScroll();

  return (
    <section style={{ height: `calc(${sectionHeight}px + 100vh)` }} className="relative w-full">
      <CenterImage sectionHeight={sectionHeight} isMobile={isMobile} scrollY={scrollY} />
      <ParallaxImages isMobile={isMobile} scrollY={scrollY} />
      <FloatingElements isMobile={isMobile} scrollY={scrollY} />

      {/* Scroll hint */}
      {!scrollInitiated && (
        <motion.div
          className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-white/70 text-sm mb-2">Scroll to explore</span>
          <ArrowDown className="text-white/70 h-5 w-5" />
        </motion.div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-64 md:h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
    </section>
  );
};

/**
 * CenterImage (uses the single scroll MotionValue passed down)
 */
const CenterImage: FC<{ sectionHeight: number; isMobile: boolean; scrollY: MotionValue<number> }> = ({
  sectionHeight,
  isMobile,
  scrollY,
}) => {
  // clipPath simplified to avoid heavy per-frame string building with many layers
  const initialClip = isMobile ? 38 : 32;
  const clip1 = useTransform(scrollY, [0, sectionHeight * 0.5], [initialClip, 0]);
  const clip2 = useTransform(scrollY, [0, sectionHeight * 0.5], [100 - initialClip, 100]);
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const bgSizeStart = isMobile ? "240%" : "220%";
  const backgroundSize = useTransform(scrollY, [0, sectionHeight * 0.6, sectionHeight + 500], [bgSizeStart, "180%", "100%"]);
  const bgPositionY = useTransform(scrollY, [0, sectionHeight * 0.6], ["25%", "50%"]);
  const opacity = useTransform(scrollY, [sectionHeight * 0.75, sectionHeight + 300], [1, 0]);

  // text transforms
  const textY = useTransform(scrollY, [0, sectionHeight * 0.7], [isMobile ? "38vh" : "35vh", isMobile ? "78vh" : "82vh"]);
  const textScale = useTransform(scrollY, [0, sectionHeight * 0.4, sectionHeight * 0.7], [isMobile ? 0.95 : 1.2, 1, 0.85]);
  const textRotateX = useTransform(scrollY, [0, sectionHeight * 0.7], [28, 0]);

  const titleTranslateZ = useTransform(scrollY, [0, sectionHeight * 0.3], [-60, 0]);

  // simplified shadow (heavy multi-layer shadows are costly every frame)
  const textShadow = useMotionTemplate`0 6px 20px rgba(0,0,0,0.45)`;

  const bgImagePath = "/src/assets/images/chris-holgersson-iQKoSI25Lws-unsplash.jpg";

  return (
    <motion.div
      className="sticky top-0 h-screen w-full overflow-hidden"
      style={{
        clipPath,
        backgroundSize,
        backgroundPositionY: bgPositionY,
        opacity,
        backgroundImage: `url(${bgImagePath})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        willChange: "transform, opacity, background-position",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

      <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: isMobile ? 900 : 1400 }}>
        <motion.div
          className="flex flex-col items-center px-4 text-center"
          style={{ y: textY, scale: textScale, rotateX: textRotateX }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-extrabold text-white tracking-wider"
            style={{ translateZ: titleTranslateZ, textShadow }}
          >
            GLOBE<span className="text-blue-400">TROTTER</span>
          </motion.h1>

          <motion.p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-light text-white/90 mt-3 md:mt-6">
            Your Journey. Your Way. Anywhere on Earth.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-12" style={{ marginTop: 24 }}>
            <Link to="/register" className="pointer-events-auto">
              <motion.button className="px-8 py-3 bg-blue-500 rounded-full text-white font-semibold shadow-lg hover:bg-blue-600 transition" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                Start Planning
              </motion.button>
            </Link>

            <Link to="/destinations" className="pointer-events-auto">
              <motion.button className="px-8 py-3 bg-transparent border-2 border-white rounded-full text-white font-semibold backdrop-blur-sm hover:bg-white/10 transition" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                Explore Destinations
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/**
 * ParallaxImages now receives the scroll MotionValue and each ParallaxImg measures itself
 * and maps scrollY -> progress in a performant way (no per-image useScroll calls).
 */
const ParallaxImages: FC<{ isMobile: boolean; scrollY: MotionValue<number> }> = ({ isMobile, scrollY }) => {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-[180px] sm:pt-[220px] md:pt-[280px] relative z-10">
      <div className="flex justify-between mb-12 md:mb-20">
        <ParallaxImg
          src="/src/assets/images/ali-kazal-YsrWdRIt5cs-unsplash.jpg"
          alt="Beach destination"
          start={isMobile ? -120 : -250}
          end={isMobile ? 120 : 250}
          className="w-1/2 sm:w-2/5 md:w-1/3"
          isMobile={isMobile}
          label="Tropical Paradise"
          icon={<MapPin className="h-3 w-3 mr-1" />}
          scrollY={scrollY}
        />

        <ParallaxImg
          src="/src/assets/images/jean-valjean-bUIXMVbHuHw-unsplash.jpg"
          alt="City skyline"
          start={isMobile ? -170 : -280}
          end={isMobile ? 170 : 280}
          className="w-1/3 sm:w-1/4 md:w-1/5"
          isMobile={isMobile}
          label="Urban Adventure"
          icon={<Globe className="h-3 w-3 mr-1" />}
          scrollY={scrollY}
        />
      </div>

      <ParallaxImg
        src="/src/assets/images/charlotte-noelle-98WPMlTl5xo-unsplash.jpg"
        alt="Mountain landscape"
        start={isMobile ? 120 : 230}
        end={isMobile ? -170 : -280}
        className="mx-auto w-3/4 sm:w-2/3"
        isMobile={isMobile}
        label="Breathtaking Views"
        highlight
        icon={<Compass className="h-3 w-3 mr-1" />}
        scrollY={scrollY}
      />

      <div className="flex justify-between mt-12 md:mt-20">
        <ParallaxImg
          src="/src/assets/images/kaja-reichardt-kLA5yRv0Gd4-unsplash.jpg"
          alt="Cultural destination"
          start={0}
          end={isMobile ? -220 : -350}
          className="ml-4 sm:ml-12 md:ml-24 w-2/5 sm:w-1/3"
          isMobile={isMobile}
          label="Hidden Gems"
          icon={<MapPin className="h-3 w-3 mr-1" />}
          scrollY={scrollY}
        />

        <ParallaxImg
          src="/src/assets/images/david-kohler-VFRTXGw1VjU-unsplash.jpg"
          alt="Adventure destination"
          start={isMobile ? 70 : 150}
          end={isMobile ? -320 : -550}
          className="w-1/2 sm:w-2/5 md:w-1/3"
          isMobile={isMobile}
          label="Epic Adventures"
          icon={<Compass className="h-3 w-3 mr-1" />}
          scrollY={scrollY}
        />
      </div>
    </div>
  );
};

/**
 * ParallaxImg: measures itself and maps the shared scrollY to progress.
 */
interface ParallaxImgProps {
  className?: string;
  alt: string;
  src: string;
  start: number;
  end: number;
  isMobile: boolean;
  label?: string;
  highlight?: boolean;
  icon?: React.ReactNode;
  scrollY: MotionValue<number>;
}

const ParallaxImg: FC<ParallaxImgProps> = ({ className = "", alt, src, start, end, isMobile, label, highlight = false, icon, scrollY }) => {
  const { ref, rect } = useElementRect<HTMLImageElement>();
  const [windowHeight, setWindowHeight] = useState(isBrowser ? window.innerHeight : 800);

  useEffect(() => {
    if (!isBrowser) return;
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // compute input range for this element (document coords)
  const startY = rect.top - windowHeight; // when the element starts entering viewport
  const endY = rect.top + rect.height; // when the element is fully past

  // a small guard to avoid invalid transforms on first render
  const safeStart = Number.isFinite(startY) ? startY : 0;
  const safeEnd = Number.isFinite(endY) && endY > safeStart ? endY : safeStart + 1;

  const progress = useTransform(scrollY, [safeStart, safeEnd], [0, 1], { clamp: false });

  // mapping progress to visual transforms
  const y = useTransform(progress, [0, 1], [start, end * (isMobile ? 0.75 : 1)]);
  const scale = useTransform(progress, [0, 1], [isMobile ? 0.98 : 1.02, isMobile ? 0.78 : 0.86]);
  const rotate = useTransform(progress, [0, 0.5, 1], [start > 0 ? -2.5 : 2.5, 0, start > 0 ? 2.5 : -2.5]);

  const transform = useMotionTemplate`translate3d(0,${y}px,0) scale(${scale}) rotate(${rotate}deg)`;

  // label animation (based on progress but not heavy)
  const labelOpacity = useTransform(progress, [0.15, 0.35, 0.6], [0, 1, 0]);
  const labelScale = useTransform(progress, [0.3, 0.45, 0.6], [0.96, 1.02, 0.98]);

  return (
    <div className={`relative group ${className}`} style={{ willChange: "transform, opacity" }}>
      <motion.img
        ref={ref}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`rounded-xl ${highlight ? "shadow-2xl ring-4 ring-white/20" : "shadow-xl"} object-cover w-full h-full`}
        style={{
          transform,
          height: isMobile ? 220 : 300,
          objectFit: "cover",
          boxShadow: highlight ? "0 25px 50px -12px rgba(0,0,0,0.5)" : "0 20px 25px -5px rgba(0,0,0,0.3)",
        }}
      />

      {label && (
        <motion.div
          className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 ${highlight ? "bg-blue-500/80" : "bg-black/60"} backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transition-all duration-300 group-hover:bg-blue-600/80`}
          style={{ opacity: labelOpacity, scale: labelScale }}
        >
          <span className="flex items-center text-white text-xs sm:text-sm font-medium">
            {icon}
            {label}
          </span>
        </motion.div>
      )}
    </div>
  );
};

/** Floating elements that use the centralized scrollY */
const FloatingElements: FC<{ isMobile: boolean; scrollY: MotionValue<number> }> = ({ isMobile, scrollY }) => {
  // Always call hooks; conditionally render below to satisfy rules-of-hooks
  const y1 = useTransform(scrollY, [0, 800], [0, -120]);
  const opacity1 = useTransform(scrollY, [0, 600], [0.85, 0]);

  const y2 = useTransform(scrollY, [0, 900], [0, -180]);
  const opacity2 = useTransform(scrollY, [0, 700], [0.85, 0]);

  const y3 = useTransform(scrollY, [0, 700], [0, -80]);
  const opacity3 = useTransform(scrollY, [0, 700], [0.85, 0]);

  if (isMobile) return null;

  return (
    <>
      <motion.div
        className="fixed top-[30%] right-[15%] w-24 h-24 rounded-full bg-blue-500/20 backdrop-blur-md z-[5]"
        style={{ y: y1, opacity: opacity1, willChange: "transform, opacity" }}
        animate={{ scale: [1, 1.08, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="fixed top-[20%] left-[10%] w-16 h-16 rounded-full bg-purple-500/20 backdrop-blur-md z-[5]"
        style={{ y: y2, opacity: opacity2, willChange: "transform, opacity" }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, -12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        className="fixed top-[60%] left-[20%] w-20 h-20 rounded-full bg-teal-500/20 backdrop-blur-md z-[5]"
        style={{ y: y3, opacity: opacity3, willChange: "transform, opacity" }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 16, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </>
  );
};

export default EnhancedHero;
