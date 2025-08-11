import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // Check for mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Parallax scrolling effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Transform values for parallax elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const gradientOpacity = useTransform(scrollYProgress, [0, 0.6], [0.6, 1]);

  return (
    <div 
      ref={containerRef} 
      className="relative h-[110vh] md:h-[120vh] w-full overflow-hidden"
    >
      {/* Background image with parallax */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{
          scale,
          backgroundImage: 'url("/src/assets/images/chris-holgersson-iQKoSI25Lws-unsplash.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: y1
        }}
      />
      
      {/* Overlay gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"
        style={{ opacity: gradientOpacity }}
      />
      
      {/* Floating island image with stronger parallax */}
      <motion.img
        src="/src/assets/images/kaja-reichardt-kLA5yRv0Gd4-unsplash.jpg"
        alt="Tropical island"
        className="absolute bottom-0 right-0 w-[60%] md:w-[40%] rounded-tl-3xl shadow-2xl object-cover hidden md:block"
        style={{ 
          y: y2,
          clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)',
          height: '60%'
        }}
      />
      
      {/* Hero content */}
      <motion.div
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        style={{ y: textY, opacity }}
      >
        <motion.h1 
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 md:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-lilac-300">
            Travel Smarter
          </span>
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-white/90 max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Plan your perfect journey with AI-powered recommendations and interactive itineraries
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to="/register">
            <motion.button
              className="px-8 py-3 rounded-full bg-gradient-to-r from-lilac-500 to-lilac-600 text-white font-medium text-lg hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Planning
              <ArrowRight className="ml-2 inline-block h-5 w-5" />
            </motion.button>
          </Link>
          
          <Link to="/explore/destinations">
            <motion.button
              className="px-8 py-3 rounded-full bg-white/20 backdrop-blur text-white font-medium text-lg border border-white/30 hover:bg-white/30 transition-all duration-300 w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Destinations
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="text-white/70 mb-2 text-sm">Scroll to explore</div>
        <ChevronDown className="text-white/70 h-6 w-6" />
      </motion.div>
    </div>
  );
};

export default HeroSection;