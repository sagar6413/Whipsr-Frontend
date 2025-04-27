"use client";

import { useState, FC, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, MessageCircle, X } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const glowVariants = {
  idle: { boxShadow: "0 0 0px rgba(0, 191, 165, 0)" },
  hover: {
    boxShadow: "0 0 20px rgba(0, 191, 165, 0.3)",
    transition: { duration: 0.3 },
  },
};

const FaqSection: FC<FaqSectionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [filteredFaqs, setFilteredFaqs] = useState<FaqItem[]>(faqs);

  // Update filtered FAQs when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFaqs(faqs);
    } else {
      const filtered = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFaqs(filtered);
    }
  }, [searchQuery, faqs]);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <section
      id="faq"
      className="py-24 bg-gradient-to-b from-[#121212] to-[#181818] relative overflow-hidden"
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-gradient-to-r from-teal-500 to-[#00BFA5] blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 blur-3xl opacity-30"></div>
        <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYwNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header - Enhanced animation and styling */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-[#00BFA5]/10 text-[#00BFA5] text-sm font-medium mb-4"
            whileHover={{
              backgroundColor: "rgba(0, 191, 165, 0.2)",
              scale: 1.05,
            }}
          >
            SUPPORT
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-[#00BFA5] to-[#00D9F5] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about Whispr&apos;s privacy and
            functionality.
          </p>
        </motion.div>

        {/* Search Bar - Enhanced with clear button and better focus states */}
        <motion.div
          className="max-w-2xl mx-auto mb-12 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="relative flex items-center group">
            <div className="absolute left-5 text-gray-400 pointer-events-none group-focus-within:text-[#00BFA5] transition-colors duration-200">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-[#232323] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/70 transition-all duration-300 border border-[#333333] focus:border-[#00BFA5]/50"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-5 text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Search results count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-right text-sm text-gray-400"
          >
            {searchQuery.trim() !== "" && (
              <span>{filteredFaqs.length} results found</span>
            )}
          </motion.div>
        </motion.div>

        {/* Categories (optional feature) */}
        <motion.div
          className="max-w-3xl mx-auto mb-10 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {["All", "Privacy", "Functionality", "Pricing", "Support"].map(
            (category) => (
              <motion.button
                key={category}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  category === "All"
                    ? "bg-[#00BFA5]/20 text-[#00BFA5]"
                    : "bg-[#232323] text-gray-300 hover:bg-[#2A2A2A]"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            )
          )}
        </motion.div>

        {/* FAQ List - Enhanced with better animations and styling */}
        <motion.div
          className="max-w-3xl mx-auto space-y-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                layout
                className="group"
              >
                <motion.div
                  variants={glowVariants}
                  animate={hoverIndex === index ? "hover" : "idle"}
                  className="border border-white/10 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E1E1E]/95 to-[#262626]/95 backdrop-blur-sm transition-all duration-300"
                  style={{
                    boxShadow:
                      openIndex === index
                        ? "0 8px 32px rgba(0, 191, 165, 0.15)"
                        : "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  layout
                >
                  <button
                    className="w-full py-5 px-6 flex justify-between items-center text-left focus:outline-none focus:bg-[#232323]/50 transition-all duration-300"
                    onClick={() => toggleQuestion(index)}
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="text-lg font-medium text-white group-hover:text-[#00BFA5] transition-colors duration-300">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{
                        rotate: openIndex === index ? 180 : 0,
                        backgroundColor:
                          openIndex === index
                            ? "rgba(0, 191, 165, 0.15)"
                            : "rgba(255, 255, 255, 0.05)",
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-colors group-hover:bg-[#00BFA5]/20"
                    >
                      <ChevronDown
                        size={18}
                        className="text-[#00BFA5] transition-transform duration-300"
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: "auto", marginTop: 0 },
                          collapsed: { opacity: 0, height: 0, marginTop: 0 },
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          className="px-6 pb-6 pt-2 border-t border-white/5"
                          variants={{
                            open: { opacity: 1, y: 0 },
                            collapsed: { opacity: 0, y: -10 },
                          }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <p className="text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 px-8 rounded-xl bg-[#1E1E1E]/80 border border-white/10"
            >
              <div className="mb-4 flex justify-center">
                <Search size={48} className="text-gray-500 opacity-50" />
              </div>
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                No matching questions found
              </h3>
              <p className="text-gray-400">
                Try a different search term or browse all questions.
              </p>
              <button
                onClick={clearSearch}
                className="mt-6 px-5 py-2 rounded-lg bg-[#00BFA5]/20 text-[#00BFA5] text-sm font-medium hover:bg-[#00BFA5]/30 transition-colors duration-300"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Contact Support Button - Enhanced with better animation and styling */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="text-gray-300 mb-6 font-medium">
            Still have questions? We&apos;re here to help.
          </p>
          <motion.a
            href="#contact"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0, 191, 165, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00BFA5] to-[#00A896] text-white font-medium shadow-lg shadow-[#00BFA5]/20 transition-all duration-300"
          >
            <MessageCircle size={18} />
            Contact Support
          </motion.a>

          {/* FAQ navigation links */}
          <div className="mt-8 text-sm flex justify-center gap-6 text-gray-400">
            <a
              href="#"
              className="hover:text-[#00BFA5] transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-[#00BFA5] transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-[#00BFA5] transition-colors duration-200"
            >
              Help Center
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
