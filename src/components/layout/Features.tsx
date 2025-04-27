"use client";

import { useState, FC } from "react";
import { motion } from "framer-motion";
import { ChevronRight, LucideIcon } from "lucide-react";

interface Feature {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string; // e.g., '#6200EA'
  animDelay: string; // e.g., '0s', '0.2s'
}

interface FeaturesSectionProps {
  features: Feature[];
}

// Keyframes for CSS animation (if needed, otherwise remove)
const fadeInUpKeyframes = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px) perspective(1000px); /* Added perspective */
    }
    to {
      opacity: 1;
      transform: translateY(0) perspective(1000px);
    }
  }
`;

const FeaturesSection: FC<FeaturesSectionProps> = ({ features }) => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <section className="py-32 relative bg-gradient-to-b from-[#121212] to-[#0A0A0A] overflow-hidden">
      {/* Inject Keyframes */}
      <style jsx>{fadeInUpKeyframes}</style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* ... (background elements JSX is unchanged) ... */}
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#6200EA]/5 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#00BFA5]/5 blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-[#6200EA]/8 blur-2xl animate-ping"
          style={{ animationDuration: "8s" }}
        ></div>
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#6200EA] to-transparent animate-pulse"></div>
          <div
            className="h-px w-full bg-gradient-to-r from-transparent via-[#00BFA5] to-transparent animate-pulse"
            style={{ animationDelay: "1s", top: "25%", position: "absolute" }}
          ></div>
          <div
            className="h-px w-full bg-gradient-to-r from-transparent via-[#6200EA] to-transparent animate-pulse"
            style={{ animationDelay: "2s", top: "50%", position: "absolute" }}
          ></div>
          <div
            className="h-px w-full bg-gradient-to-r from-transparent via-[#00BFA5] to-transparent animate-pulse"
            style={{ animationDelay: "3s", top: "75%", position: "absolute" }}
          ></div>
          <div
            className="w-px h-full bg-gradient-to-b from-transparent via-[#6200EA] to-transparent animate-pulse"
            style={{ left: "25%", position: "absolute" }}
          ></div>
          <div
            className="w-px h-full bg-gradient-to-b from-transparent via-[#00BFA5] to-transparent animate-pulse"
            style={{
              animationDelay: "1.5s",
              left: "50%",
              position: "absolute",
            }}
          ></div>
          <div
            className="w-px h-full bg-gradient-to-b from-transparent via-[#6200EA] to-transparent animate-pulse"
            style={{
              animationDelay: "2.5s",
              left: "75%",
              position: "absolute",
            }}
          ></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block mb-4 bg-gradient-to-r from-[#6200EA]/20 to-[#00BFA5]/20 px-4 py-1 rounded-full backdrop-blur-sm">
            <span className="text-white text-sm font-medium tracking-wider uppercase">
              Distinctive Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
            Why Choose{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-[#6200EA] to-[#00BFA5] bg-clip-text text-transparent">
                Whispr
              </span>
              <span className="absolute -inset-1 bg-gradient-to-r from-[#6200EA]/20 to-[#00BFA5]/20 blur-lg rounded-lg -z-10"></span>
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Designed for those who value privacy, spontaneity, and genuine
            connections without the permanent digital footprint.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-[#6200EA] to-[#00BFA5] mx-auto mt-8 rounded-full"></div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto perspective-1000">
          {features.map((feature) => {
            const FeatureIcon = feature.icon;
            const isHovered = hoveredFeature === feature.id;

            return (
              // Removed the outer div with CSS animation, use motion.div instead
              <motion.div
                key={feature.id}
                className="feature-card group relative" // Keep group for hover states
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% is visible
                transition={{
                  duration: 0.8,
                  delay: parseFloat(feature.animDelay),
                  ease: "easeOut",
                }}
                style={{ transformStyle: "preserve-3d" }} // Needed for 3D transforms if used
              >
                <motion.div
                  className={`relative h-full bg-[#1E1E1E]/80 backdrop-blur-sm rounded-xl border border-white/10 p-8 transition-all duration-500 
                    ${isHovered ? "shadow-lg" : "hover:shadow-md"}
                    overflow-hidden z-10`} // Ensure content is above pseudo-elements
                  // Animate hover effect using framer-motion
                  animate={{
                    y: isHovered ? -8 : 0,
                    boxShadow: isHovered
                      ? `0 10px 25px -5px ${feature.color}20`
                      : "0 1px 3px rgba(0,0,0,0.1)", // Example default shadow
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Animated gradient border on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r from-[#6200EA]/0 via-[${feature.color}]/30 to-[#00BFA5]/0 blur-sm -z-10`} // Ensure it's behind content
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Icon with animated background */}
                  <div className="flex items-start space-x-5 mb-4">
                    <motion.div
                      className={`w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-lg 
                                    transition-all duration-500 relative overflow-hidden`}
                      style={{ backgroundColor: `${feature.color}20` }}
                      animate={{
                        boxShadow: isHovered
                          ? `0 4px 10px ${feature.color}30`
                          : "none",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      ></motion.div>
                      {/* Wrap the Lucide icon with motion.div to animate it */}
                      <motion.div
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        }}
                      >
                        <FeatureIcon
                          className="w-6 h-6 transition-transform duration-300 relative z-10"
                          style={{ color: feature.color }}
                        />
                      </motion.div>
                    </motion.div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-2 text-white transition-colors group-hover:text-white">
                        {feature.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-300 transition-colors group-hover:text-gray-200 pl-[calc(3.5rem+1.25rem)] leading-relaxed">
                    {/* Adjusted padding-left: 14*4px (icon) + 5*4px (space) = 76px = 4.75rem */}
                    {feature.description}
                  </p>

                  {/* Animated learn more link */}
                  <div className="mt-4 pl-[4.75rem] overflow-hidden h-6">
                    <motion.div
                      className={`text-sm font-medium flex items-center`}
                      style={{ color: feature.color }}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{
                        y: isHovered ? 0 : "100%",
                        opacity: isHovered ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <span>Learn more</span>
                      <motion.span
                        animate={{ x: isHovered ? 4 : 0 }} // Move arrow slightly on hover
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </motion.span>
                    </motion.div>
                  </div>

                  {/* Decorative elements */}
                  <motion.div
                    className={`absolute bottom-0 right-0 w-32 h-32 rounded-tl-[100px] -z-10`}
                    style={{
                      background: `radial-gradient(circle at bottom right, ${feature.color}, transparent 70%)`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 0.1 : 0 }} // Fade in on hover
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Decorative bottom element */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="group relative w-48 h-12 flex items-center justify-center cursor-pointer overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#6200EA]/20 to-[#00BFA5]/20 rounded-full blur"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            ></motion.div>
            <span className="relative z-10 text-white font-medium transition-all duration-500 group-hover:bg-gradient-to-r group-hover:from-[#6200EA] group-hover:to-[#00BFA5] group-hover:bg-clip-text group-hover:text-transparent">
              Explore All Features
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
