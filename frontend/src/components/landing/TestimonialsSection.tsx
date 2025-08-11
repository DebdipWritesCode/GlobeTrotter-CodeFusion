
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    text: "GlobeTrotter made planning our honeymoon so easy! The budget tracking feature helped us stay on track while still enjoying luxury experiences.",
    author: "Sarah & Michael",
    location: "Paris & Rome Trip",
    avatar: "/src/assets/images/jean-valjean-bUIXMVbHuHw-unsplash.jpg"
  },
  {
    id: 2,
    text: "As someone who travels frequently for work, this app has been a game-changer. I can organize my meetings and sightseeing activities in one place.",
    author: "James Wilson",
    location: "Business Trip to Tokyo",
    avatar: "/src/assets/images/ali-kazal-YsrWdRIt5cs-unsplash.jpg"
  },
  {
    id: 3,
    text: "The collaborative planning feature was perfect for our group trip. Everyone could add their preferred activities and we avoided so many arguments!",
    author: "Emma Rodriguez",
    location: "Thailand Adventure",
    avatar: "/src/assets/images/david-kohler-VFRTXGw1VjU-unsplash.jpg"
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-indigo-700 py-16 md:py-24 px-4 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-white"></div>
      </div>
      
      <div className="max-w-5xl mx-auto relative" ref={containerRef}>
        {/* Section heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Traveler Stories</h2>
          <p className="text-indigo-200 max-w-2xl mx-auto">
            Hear from adventurers who have transformed their travel experiences with GlobeTrotter
          </p>
        </div>
        
        {/* Testimonial slider */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
            >
              <Quote className="h-10 w-10 text-indigo-300 mb-4" />
              
              <p className="text-lg md:text-xl italic mb-6">
                "{testimonials[currentIndex].text}"
              </p>
              
              <div className="flex items-center">
                <img 
                  src={testimonials[currentIndex].avatar}
                  alt={testimonials[currentIndex].author}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-medium">{testimonials[currentIndex].author}</div>
                  <div className="text-sm text-indigo-200">{testimonials[currentIndex].location}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation arrows */}
          <div className="flex justify-between mt-8">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            {/* Pagination indicators */}
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentIndex ? "bg-white scale-125" : "bg-indigo-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;