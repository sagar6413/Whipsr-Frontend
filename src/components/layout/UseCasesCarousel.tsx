"use client";

import { useState, useEffect, FC, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";

interface UseCase {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string; // e.g., 'from-purple-800/70 to-indigo-900/70'
  iconColor: string; // e.g., '#a78bfa' (purple-400)
}

interface UseCasesCarouselProps {
  useCasesData: UseCase[];
}

// Keyframe animations for CSS
const progressKeyframes = `
  @keyframes progressAnimation {
    from { width: 0%; }
    to { width: 100%; }
  }
`;

// Define float keyframes here as well
const floatKeyframes = `
  @keyframes float {
    0%,
    100% {
      transform: translateY(0) translateX(0);
    }
    50% {
      transform: translateY(-20px) translateX(10px);
    }
  }
`;

// Variants for slide transitions
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    zIndex: 10, // Ensure entering slide is initially behind if needed
  }),
  center: {
    x: 0,
    opacity: 1,
    zIndex: 20, // Active slide on top
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    zIndex: 10, // Ensure exiting slide is behind
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  }),
};

const UseCasesCarousel: FC<UseCasesCarouselProps> = ({ useCasesData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Direction: 1 for next, -1 for prev
  const [direction, setDirection] = useState(1);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // To prevent rapid clicks

  const totalSlides = useCasesData.length;

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides, isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides, isAnimating]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Autoplay functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!autoplayPaused) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000); // Autoplay interval
    }
    return () => clearInterval(interval);
  }, [autoplayPaused, nextSlide]); // Re-run if pause state changes or nextSlide changes

  // Reset animation lock after transition duration
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 550); // Slightly longer than animation
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <section className="py-28 relative bg-gradient-to-b from-black to-[#0A0A0A] overflow-hidden">
      {/* Inject ALL Keyframes here */}
      <style jsx>{`
        ${progressKeyframes}
        ${floatKeyframes}
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-purple-900/10 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full bg-blue-900/10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        {/* Subtle particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${
                  // Uses the 'float' keyframes defined above
                  5 + Math.random() * 10
                }s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
        {/* Animated lines */}
        <div className="absolute inset-0">
          <div
            className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-pulse"
            style={{ top: "25%", position: "absolute" }}
          ></div>
          <div
            className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse"
            style={{
              animationDelay: "1.5s",
              top: "75%",
              position: "absolute",
            }}
          ></div>
        </div>
        {/* The nested style tag for @keyframes float was removed from here */}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block mb-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 px-4 py-1 rounded-full backdrop-blur-sm border border-purple-500/20 animate-pulse">
            <span className="text-white text-sm font-medium tracking-wider uppercase">
              Our Community
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
            Who Uses{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                Whispr
              </span>
              <span className="absolute -inset-1 bg-purple-500/20 blur-xl rounded-full -z-10"></span>
            </span>
            ?
          </h2>
          <p className="text-center text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            From romantic connections to private conversations, Whispr is for
            anyone who values discretion.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-8 rounded-full"></div>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setAutoplayPaused(true)}
          onMouseLeave={() => setAutoplayPaused(false)}
        >
          {/* Previous Button */}
          <motion.button
            className="absolute top-1/2 -left-5 md:-left-12 transform -translate-y-1/2 z-30 flex items-center justify-center w-12 h-12 rounded-full border border-purple-500/50 bg-black/60 backdrop-blur-sm hover:bg-purple-900/40 text-white transition-colors duration-300"
            onClick={prevSlide}
            aria-label="Previous slide"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>

          {/* Carousel Content Area */}
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-lg shadow-purple-500/10 backdrop-blur-sm">
            <div className="relative h-[400px] md:h-[450px]">
              <AnimatePresence initial={false} custom={direction}>
                {/* Render only the current slide */}
                <motion.div
                  key={currentSlide} // Key change triggers animation
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0" // Use absolute positioning for overlap
                >
                  {/* Slide Content */}
                  {((useCase) => {
                    const Icon = useCase.icon;
                    return (
                      <div
                        className={`h-full w-full bg-gradient-to-br ${useCase.gradient} flex items-center md:items-start`}
                      >
                        <div className="w-full grid md:grid-cols-2 gap-8 items-center px-8 py-14 md:p-14">
                          {/* Left side - Content */}
                          <motion.div
                            className="flex flex-col justify-center order-2 md:order-1"
                            // Add subtle animation to content
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                          >
                            <div className="mb-6 flex items-center">
                              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-sm mr-4">
                                <Icon
                                  size={24}
                                  style={{ color: useCase.iconColor }}
                                />
                              </div>
                              <span className="text-white/70 text-sm font-medium">
                                Use Case {useCase.id + 1}/{totalSlides}
                              </span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-md">
                              {useCase.title}
                            </h3>
                            <p className="text-lg text-gray-100 max-w-lg leading-relaxed drop-shadow-sm mb-8">
                              {useCase.description}
                            </p>
                            {/* Buttons */}
                            <div className="flex space-x-4">
                              <motion.button
                                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 text-white font-medium transition-colors duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {" "}
                                Learn More{" "}
                              </motion.button>
                              <motion.button
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg text-white font-medium transition-shadow duration-300 shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {" "}
                                Get Started{" "}
                              </motion.button>
                            </div>
                          </motion.div>

                          {/* Right side - Visual */}
                          <motion.div
                            className="relative h-64 md:h-80 order-1 md:order-2 flex items-center justify-center"
                            // Add subtle animation to visual
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.3,
                              duration: 0.6,
                              type: "spring",
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative">
                                <motion.div
                                  className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl transform scale-75"
                                  animate={{ rotate: [0, 12, 0] }}
                                  transition={{
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                />
                                <motion.div
                                  className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl transform scale-90 animate-pulse"
                                  animate={{ rotate: [0, -6, 0] }}
                                  transition={{
                                    duration: 12,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: 1,
                                  }}
                                />
                                <div className="relative bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl w-64 h-64 flex items-center justify-center">
                                  <Icon
                                    size={80}
                                    style={{ color: useCase.iconColor }}
                                    className="opacity-90"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    );
                  })(useCasesData[currentSlide])}{" "}
                  {/* Immediately invoke with current slide data */}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Next Button */}
          <motion.button
            className="absolute top-1/2 -right-5 md:-right-12 transform -translate-y-1/2 z-30 flex items-center justify-center w-12 h-12 rounded-full border border-purple-500/50 bg-black/60 backdrop-blur-sm hover:bg-purple-900/40 text-white transition-colors duration-300"
            onClick={nextSlide}
            aria-label="Next slide"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-3">
            {useCasesData.map((_, index) => (
              <button
                key={index}
                className={`group relative transition-transform duration-300 ${
                  index === currentSlide
                    ? "scale-100"
                    : "scale-90 hover:scale-95"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                disabled={isAnimating} // Disable dots during transition
              >
                <span
                  className={`block w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentSlide
                      ? "bg-purple-500"
                      : "bg-gray-600 group-hover:bg-gray-400"
                  }`}
                ></span>
                {/* Ping animation for active dot */}
                {index === currentSlide && (
                  <span className="absolute -inset-1 bg-purple-500/30 rounded-full animate-ping"></span>
                )}
              </button>
            ))}
          </div>

          {/* Autoplay Progress Bar - Key indicates it should reset on slide change */}
          <div className="mt-6 max-w-xs mx-auto bg-gray-800/50 rounded-full h-1 overflow-hidden">
            <motion.div
              key={currentSlide} // Reset animation when slide changes
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: autoplayPaused ? 0 : 5, ease: "linear" }} // 5s duration matches interval
            ></motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCasesCarousel;
