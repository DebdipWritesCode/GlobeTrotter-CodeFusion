import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Map, Calendar, CreditCard, Share2 } from 'lucide-react';

const features = [
  {
    icon: <Map className="h-8 w-8 text-purple-500" />,
    title: 'Smart Itineraries',
    description: 'Create customized multi-city travel plans with intelligent recommendations based on your preferences',
  },
  {
    icon: <Calendar className="h-8 w-8 text-purple-500" />,
    title: 'Visual Timeline',
    description: 'See your entire journey laid out day by day with an interactive calendar view',
  },
  {
    icon: <CreditCard className="h-8 w-8 text-purple-500" />,
    title: 'Budget Tracking',
    description: 'Set budgets and track expenses across accommodations, activities, and transportation',
  },
  {
    icon: <Share2 className="h-8 w-8 text-purple-500" />,
    title: 'Collaborative Planning',
    description: 'Share your trip plans with friends and family and plan together in real-time',
  },
];

const FeaturesSection = () => {
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
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent dark:from-gray-950 dark:to-transparent" />
      
      {/* Section heading */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          Plan Your Perfect Journey
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
          Our comprehensive set of tools makes travel planning effortless and enjoyable
        </p>
      </div>
      
      {/* Features grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.4)",
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturesSection;