"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Assuming path
import { ArrowRight } from "lucide-react";

const CtaSection: FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#121212]">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-1/4 left-1/4 w-96 h-96 bg-[#6200EA]/5 rounded-full filter blur-3xl opacity-40"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.5, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute -bottom-1/4 right-1/4 w-96 h-96 bg-[#00BFA5]/5 rounded-full filter blur-3xl opacity-40"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
            Ready for conversations that{" "}
            <span className="bg-gradient-to-r from-[#6200EA] to-[#00BFA5] bg-clip-text text-transparent">
              don&apos;t follow you
            </span>
            ?
          </h2>

          <p className="text-xl text-gray-300 mb-10">
            Join Whispr today and experience the freedom of temporary, private
            messaging. Connect, chat, and leave no trace.
          </p>

          {/* Use motion.custom for Button if direct motion props aren't supported */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              // Use size prop if available in your Button component, otherwise use classes
              // size="lg"
              className="relative overflow-hidden bg-gradient-to-r from-[#6200EA] to-[#00BFA5] text-white font-semibold rounded-md transition-all hover:shadow-lg hover:shadow-[#6200EA]/30 active:scale-95 group text-lg px-10 py-5" // Adjusted padding/text size if needed
              style={{
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }} // Keep Tailwind pulse or use custom animation
            >
              Get Started Now
              <motion.span
                className="inline-block ml-2"
                animate={{ x: [0, 4, 0] }} // Subtle movement for the arrow
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.span>
            </Button>
          </motion.div>

          <p className="mt-6 text-sm text-gray-400">
            No credit card required. Free to use.
          </p>
        </motion.div>
      </div>
      {/* Add pulse keyframes if not using Tailwind's pulse */}
      <style jsx>{`
        @keyframes pulse {
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </section>
  );
};

export default CtaSection;
