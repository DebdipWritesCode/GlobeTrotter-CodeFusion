import { useRef } from "react";
import type { FC } from "react";
import { ReactLenis } from "lenis/react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { IoAirplaneOutline } from "react-icons/io5";

/**
 * SmoothScrollHero
 * Top-level component that wraps the page in Lenis smooth-scrolling
 * and renders the hero area. (Nav removed)
 */
export const SmoothScrollHero: FC = () => {
  return (
    <div className="bg-zinc-950">
      <ReactLenis
        root
        options={{
          lerp: 0.05,
          wheelMultiplier: 0.8,
          touchMultiplier: 1.5,
          smoothTouch: true,
        }}
      >
        <Hero />
      </ReactLenis>
    </div>
  );
};

/**
 * Height used to compute parallax/transform ranges.
 */
const SECTION_HEIGHT = 1500;

/**
 * Hero wrapper
 */
const Hero: FC = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterImage />
      <ParallaxImages />
      {/* Transition-to-next-section block removed */}
    </div>
  );
};

/**
 * CenterImage
 */
/** CenterImage: fixed full-bleed background that starts zoomed, then shrinks, then fades */
const CenterImage: FC = () => {
  const { scrollY } = useScroll();

  // keep clip if you use it; set to neutral if not
  const clip1 = useTransform(scrollY, [0, SECTION_HEIGHT * 0.7], [5, 0]);
  const clip2 = useTransform(scrollY, [0, SECTION_HEIGHT * 0.7], [95, 100]);
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  // Start quite large so it always fills viewport on launch (adjust 1.4 as needed)
  const bgScale = useTransform(scrollY, [0, SECTION_HEIGHT * 0.9], [1.40, 1.00]);

  // Fade later so shrink is visible first
  const opacity = useTransform(scrollY, [SECTION_HEIGHT * 0.75, SECTION_HEIGHT], [1, 0]);

  // text transforms
  const textY = useTransform(scrollY, [0, SECTION_HEIGHT * 0.6], ["25vh", "75vh"]);
  const textScale = useTransform(scrollY, [0, SECTION_HEIGHT * 0.6], [1, 1.12]);
  const taglineOpacity = useTransform(scrollY, [0, SECTION_HEIGHT * 0.2, SECTION_HEIGHT * 0.6], [0, 1, 1]);
  const iconOpacity = useTransform(scrollY, [0, SECTION_HEIGHT * 0.3, SECTION_HEIGHT * 0.6], [0, 1, 0.5]);
  const iconRotation = useTransform(scrollY, [0, SECTION_HEIGHT * 0.6], [0, 360]);
  const buttonOpacity = useTransform(scrollY, [0, SECTION_HEIGHT * 0.25, SECTION_HEIGHT * 0.4], [0, 1, 1]);
  const buttonScale = useTransform(scrollY, [SECTION_HEIGHT * 0.25, SECTION_HEIGHT * 0.35], [0.95, 1]);

  return (
    <div style={{ height: "100vh" }} className="relative w-full">
      {/* Full-bleed background FIXED to viewport so it fills regardless of parent container */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: 'url("/src/assets/images/kaja-reichardt-kLA5yRv0Gd4-unsplash.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          transformOrigin: "center center",
          scale: bgScale,
          // separate opacity transform if you want only background to fade:
          // opacity: opacity,
          willChange: "transform, opacity",
        }}
      />

      {/* overlay gradient for better contrast; fixed as well so it sits on top of bg */}
      <div className="fixed inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

      {/* content container above the fixed background */}
      <motion.div
        className="relative z-20 w-full h-screen flex flex-col items-center justify-center pointer-events-none"
        style={{
          y: textY,
          scale: textScale,
          top: 0,
        }}
      >
        <motion.div className="text-white/80 mb-4" style={{ opacity: iconOpacity, rotate: iconRotation }}>
          <IoAirplaneOutline className="w-12 h-12" />
        </motion.div>

        <h1
          className="text-6xl md:text-8xl font-black text-white tracking-widest relative z-30"
          style={{
            textShadow: `0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa`,
          }}
        >
          GLOBE TROTTER
        </h1>

        <motion.p
          className="text-xl md:text-2xl font-light text-white mt-6 tracking-wide px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full"
          style={{ opacity: taglineOpacity }}
        >
          Empowering Personalized Travel Planning
        </motion.p>

        <motion.button
          className="mt-8 bg-white text-zinc-900 px-8 py-3 rounded-full font-medium text-lg hover:bg-white/90 transition-colors pointer-events-auto"
          style={{ opacity: buttonOpacity, scale: buttonScale }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Planning
        </motion.button>

        
      </motion.div>

      {/* optional: fade wrapper so whole section dissolves (keeps text visible while bg fades if you want both) */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          pointerEvents: "none",
          opacity: opacity, // fades the overlay layer (use if you want the whole hero to dissolve)
      }} />
    </div>
  );
};


/**
 * Container for parallax images
 */
const ParallaxImages: FC = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      {/* First row of images */}
      <div className="mb-40 relative">
        <ParallaxImg
          src="/src/assets/images/ali-kazal-YsrWdRIt5cs-unsplash.jpg"
          alt="Mountain landscape with snowcapped peaks"
          start={-200}
          end={200}
          className="w-1/3 rounded-lg shadow-xl"
        />
        <motion.div
          className="absolute top-40 right-[20%] text-white bg-black/30 backdrop-blur-sm p-4 rounded-lg max-w-xs"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="font-medium text-lg">Discover new heights</h4>
          <p className="text-white/80 text-sm mt-1">Explore mountain ranges and breathtaking vistas across the globe</p>
        </motion.div>
      </div>

      {/* Second row of images with caption */}
      <div className="mb-40 relative">
        <ParallaxImg
          src="/src/assets/images/charlotte-noelle-98WPMlTl5xo-unsplash.jpg"
          alt="Beach paradise with crystal blue waters"
          start={200}
          end={-250}
          className="mx-auto w-2/3 rounded-lg shadow-xl"
        />
        <motion.div
          className="absolute bottom-[-60px] left-[15%] text-white bg-black/30 backdrop-blur-sm p-4 rounded-lg max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="font-medium text-lg">Explore hidden paradises</h4>
          <p className="text-white/80 text-sm mt-1">Find secluded beaches and coastal wonders perfect for your next getaway</p>
        </motion.div>
      </div>

      {/* Third row with two images */}
      <div className="flex items-start justify-between mb-40">
        <div className="w-[45%] relative">
          <ParallaxImg
            src="/src/assets/images/jean-valjean-bUIXMVbHuHw-unsplash.jpg"
            alt="Historical architecture in ancient city"
            start={-200}
            end={200}
            className="w-full rounded-lg shadow-xl"
          />
          <motion.div
            className="absolute bottom-[-40px] left-[10%] text-white bg-black/30 backdrop-blur-sm p-3 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-medium">Cultural immersion</h4>
          </motion.div>
        </div>

        <div className="w-[45%] relative">
          <ParallaxImg
            src="/src/assets/images/david-kohler-VFRTXGw1VjU-unsplash.jpg"
            alt="Vibrant cultural experience"
            start={0}
            end={-300}
            className="w-full rounded-lg shadow-xl"
          />
          <motion.div
            className="absolute bottom-[-40px] right-[10%] text-white bg-black/30 backdrop-blur-sm p-3 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="font-medium">Urban adventures</h4>
          </motion.div>
        </div>
      </div>

      {/* Final inspirational text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center text-white mb-40 pt-20"
      >
        <h3 className="text-4xl font-bold mb-4"></h3>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          
        </p>
      </motion.div>
    </div>
  );
};

/**
 * ParallaxImgProps
 */
interface ParallaxImgProps {
  className?: string;
  alt: string;
  src: string;
  start: number;
  end: number;
}

/**
 * Enhanced ParallaxImg with better animations
 */
const ParallaxImg: FC<ParallaxImgProps> = ({
  className,
  alt,
  src,
  start,
  end,
}) => {
  const ref = useRef<HTMLImageElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  // Enhanced animations for more dramatic effect
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.75, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);

  // Add slight rotation for more dynamic feel
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-1, 0, 1]);

  const transform = useMotionTemplate`translateY(${y}px) scale(${scale}) rotate(${rotate}deg)`;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={`${className} object-cover`}
      ref={ref}
      style={{ transform, opacity }}
      loading="lazy"
    />
  );
};
