"use client";

import { useState, useEffect, FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgGradient: string;
}

interface HowItWorksSectionProps {
  steps: Step[];
}

const HowItWorksSection: FC<HowItWorksSectionProps> = ({ steps }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
    }, 4000); // Increased time to 4s for better readability

    return () => clearInterval(interval);
  }, [steps.length, isAutoplay]);

  // Pause autoplay when user interacts
  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setIsAutoplay(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoplay(true), 10000);
  };

  return (
    <section className="py-32 px-4 bg-gradient-to-b from-gray-900 via-gray-900 to-black overflow-hidden relative">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s", animationDuration: "8s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-pink-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2.5s", animationDuration: "10s" }}
        ></div>

        {/* Added subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced section header */}
        <motion.div
          className="text-center mb-20 relative"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-sm font-medium text-purple-400 mb-3 inline-block tracking-widest uppercase">
            Simplified Process
          </span>
          <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 text-white tracking-tight">
            How{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600 relative inline-block">
              Whispr
              <span className="absolute -inset-1 bg-purple-500/20 blur-xl rounded-full -z-10"></span>
            </span>{" "}
            Works
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg mb-6">
            Experience our streamlined approach to delivering results
            efficiently and effectively
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-teal-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Enhanced steps with better layout and animations */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = activeStep === index;

            return (
              <motion.div
                key={index}
                className={`p-8 rounded-2xl backdrop-blur-sm transition-all duration-500 border 
                  ${
                    isActive
                      ? `border-${step.color}-500/30 bg-gradient-to-br ${step.bgGradient} shadow-lg shadow-${step.color}-900/10`
                      : "border-gray-800/50 bg-gray-800/30 hover:bg-gray-800/50"
                  }
                  group cursor-pointer overflow-hidden relative`}
                onClick={() => handleStepClick(index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Step number in background */}
                <div className="absolute -bottom-12 -right-6 text-[120px] font-bold text-gray-800/20 select-none">
                  {index + 1}
                </div>

                {/* Enhanced icon display */}
                <div className="flex items-center mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center 
                      ${
                        isActive
                          ? `bg-${step.color}-500/30`
                          : `bg-${step.color}-500/10`
                      } 
                      transition-all duration-300 group-hover:scale-110
                      ${
                        isActive
                          ? "shadow-lg shadow-" + step.color + "-500/20"
                          : ""
                      }`}
                  >
                    <StepIcon
                      size={28}
                      className={`text-${step.color}-400`}
                      strokeWidth={1.5}
                    />
                  </div>
                  {isActive && (
                    <div className="ml-4 flex items-center">
                      <span className="text-gray-400 text-sm font-medium">
                        Step {index + 1}
                      </span>
                      <ArrowRight size={16} className="ml-2 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Enhanced title and description */}
                <h3
                  className={`text-xl font-bold mb-3 transition-all duration-300
                    ${
                      isActive
                        ? `text-white text-2xl`
                        : `text-gray-300 group-hover:text-${step.color}-400`
                    }`}
                >
                  {step.title}
                </h3>

                <p
                  className={`transition-all duration-300 leading-relaxed
                    ${
                      isActive
                        ? "text-gray-300"
                        : "text-gray-500 group-hover:text-gray-400"
                    }
                    ${!isActive ? "line-clamp-3 md:line-clamp-none" : ""}`}
                >
                  {step.description}
                </p>

                {/* Enhanced active indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className={`mt-6 h-1 rounded-full bg-${step.color}-500/70`}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "30%", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    ></motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced pagination indicators */}
        <div className="flex justify-center mt-16 space-x-2">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              className={`h-2 rounded-full transition-all duration-500 
                ${
                  activeStep === index
                    ? `bg-${step.color}-500 w-10`
                    : "bg-gray-600 w-2 hover:bg-gray-500 hover:w-4"
                }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
