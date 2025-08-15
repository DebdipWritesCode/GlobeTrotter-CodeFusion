import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import imgAli from '@/assets/images/ali-kazal-YsrWdRIt5cs-unsplash.jpg';
import imgCharlotte from '@/assets/images/charlotte-noelle-98WPMlTl5xo-unsplash.jpg';
import imgJean from '@/assets/images/jean-valjean-bUIXMVbHuHw-unsplash.jpg';
import imgDavid from '@/assets/images/david-kohler-VFRTXGw1VjU-unsplash.jpg';

// Sample inspiration categories
const categories = [
  { name: "Beach Getaways", icon: "🏝️", to: "/inspiration/beach" },
  { name: "Mountain Adventures", icon: "⛰️", to: "/inspiration/mountain" },
  { name: "Urban Exploration", icon: "🏙️", to: "/inspiration/urban" },
  { name: "Cultural Journeys", icon: "🏛️", to: "/inspiration/cultural" },
  { name: "Food & Cuisine", icon: "🍜", to: "/inspiration/food" },
  { name: "Wildlife & Nature", icon: "🦁", to: "/inspiration/wildlife" },
];

// Gallery images
const galleryImages = [imgAli, imgCharlotte, imgJean, imgDavid];

const TravelInspirationSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -50]);
  
  return (
    <motion.div
      ref={containerRef}
      className="py-16 md:py-24 px-4 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
      style={{ y }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Get Inspired</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover travel ideas and inspirations for your next adventure
          </p>
        </div>
        
        {/* Inspiration categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md"
              whileHover={{ y: -5, boxShadow: "0 8px 20px rgba(124, 58, 237, 0.2)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={category.to} className="block">
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-medium text-sm">{category.name}</div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Travel gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              className="relative overflow-hidden rounded-xl aspect-[3/4]"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src={image} 
                alt="Travel inspiration" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-white text-sm font-bold mb-1">
                    {index === 0 && "Tropical Paradise"}
                    {index === 1 && "Ancient Wonders"}
                    {index === 2 && "Vibrant Cities"}
                    {index === 3 && "Hidden Gems"}
                  </div>
                  <div className="text-white/80 text-xs">
                    Discover more
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Explore more link */}
        <div className="mt-10 text-center">
          <Link
            to="/inspiration"
            className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
          >
            Explore all inspiration guides <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TravelInspirationSection;