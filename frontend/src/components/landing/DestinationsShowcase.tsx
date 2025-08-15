import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import imgAli from '@/assets/images/ali-kazal-YsrWdRIt5cs-unsplash.jpg';
import imgDavid from '@/assets/images/david-kohler-VFRTXGw1VjU-unsplash.jpg';
import imgCharlotte from '@/assets/images/charlotte-noelle-98WPMlTl5xo-unsplash.jpg';
import imgJean from '@/assets/images/jean-valjean-bUIXMVbHuHw-unsplash.jpg';

// Sample destination data
const destinations = [
  {
    id: 1,
    name: 'Bali',
    country: 'Indonesia',
    image: imgAli,
    description: 'Tropical paradise with stunning beaches and rich culture',
  },
  {
    id: 2,
    name: 'Tokyo',
    country: 'Japan',
    image: imgDavid,
    description: 'Modern metropolis with ancient traditions',
  },
  {
    id: 3,
    name: 'Santorini',
    country: 'Greece',
    image: imgCharlotte,
    description: 'Breathtaking island with white-washed buildings',
  },
  {
    id: 4,
    name: 'New York',
    country: 'United States',
    image: imgJean,
    description: 'The city that never sleeps',
  },
];

const DestinationsShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax scrolling effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -50]);
  
  // Card animation variants
  const cardVariants: Variants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4 } },
  };

  return (
    <motion.div
      ref={containerRef}
      className="py-16 md:py-24 px-4 relative overflow-hidden"
      style={{ y }}
    >
      {/* Section heading */}
      <div className="max-w-7xl mx-auto mb-10 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">Popular Destinations</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
          Discover stunning places around the world, carefully curated for unforgettable experiences
        </p>
      </div>
      
      {/* Destinations grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((destination, i) => (
          <motion.div
            key={destination.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group"
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            custom={i}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <div className="h-52 overflow-hidden relative">
              <img 
                src={destination.image} 
                alt={destination.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-xl font-bold">{destination.name}</h3>
                <p className="text-sm text-white/80">{destination.country}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {destination.description}
              </p>
              <Link 
                to={`/destinations/${destination.id}`}
                className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium"
              >
                Explore <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* View all link */}
      <div className="text-center mt-10">
        <Link 
          to="/destinations"
          className="inline-flex items-center px-6 py-2 rounded-full border border-purple-500 text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
        >
          View All Destinations <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default DestinationsShowcase;