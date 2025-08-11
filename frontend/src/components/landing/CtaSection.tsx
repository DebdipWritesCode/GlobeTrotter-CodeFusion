import { motion } from 'framer-motion';
import { ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <div className="py-16 md:py-24 px-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="relative z-10 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-0 right-0 bg-white/10 w-64 h-64 rounded-full -mt-20 -mr-20"></div>
            <div className="absolute bottom-0 left-0 bg-white/10 w-64 h-64 rounded-full -mb-32 -ml-32"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 rounded-full p-3">
                <Globe className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Start Planning Your Dream Trip Today
            </motion.h2>
            
            <motion.p 
              className="text-white/90 text-center max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join thousands of travelers who have transformed their travel experiences with GlobeTrotter's powerful planning tools.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/register">
                <motion.button
                  className="px-8 py-3 rounded-full bg-white text-purple-600 font-medium text-lg w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 inline-block h-5 w-5" />
                </motion.button>
              </Link>
              
              <Link to="/contact">
                <motion.button
                  className="px-8 py-3 rounded-full bg-transparent border border-white/50 text-white font-medium text-lg hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;