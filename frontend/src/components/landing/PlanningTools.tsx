import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const PlanningTools = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -50]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);
  
  return (
    <motion.div
      ref={containerRef}
      className="py-16 md:py-28 px-4 relative"
      style={{ y }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side: App preview */}
          <motion.div 
            ref={imgRef}
            className="relative"
            style={{ scale: imgScale, opacity: imgOpacity }}
          >
            <div className="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-2xl p-1 shadow-xl">
              <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                <img 
                  src="/src/assets/images/nick-seagrave-1tpLdmxki-c-unsplash.jpg" 
                  alt="Travel planning interface" 
                  className="w-full h-auto rounded-t-lg"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full px-3 py-1 text-xs text-purple-700 dark:text-purple-300">Trip Dashboard</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">7 days</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-10 -right-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2 mr-3">
                  <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Budget Tracker</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Within budget</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <div className="text-xs">Tokyo, Day 3</div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right side: Text content */}
          <div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Powerful Tools for Effortless Planning
            </motion.h2>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              From creating detailed itineraries to tracking expenses, our suite of planning tools handles all the complexities so you can focus on enjoying your journey.
            </motion.p>
            
            <div className="space-y-6">
              {[
                {
                  title: "Interactive Itinerary Builder",
                  description: "Drag and drop activities, add locations, and customize your perfect trip day by day.",
                },
                {
                  title: "Real-time Budget Tracking",
                  description: "Set your budget and watch as we automatically calculate costs for accommodations, transport, and activities.",
                },
                {
                  title: "Smart Recommendations",
                  description: "Get personalized suggestions for activities and places based on your preferences and travel style.",
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  className="flex"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                >
                  <div className="mr-4 mt-1">
                    <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link 
                to="/features"
                className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors duration-300 inline-flex items-center"
              >
                Explore All Features
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlanningTools;