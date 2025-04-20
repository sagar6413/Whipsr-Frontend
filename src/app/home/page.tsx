"use client";

import { Button } from "@/components/ui/button"; // Assuming this is Shadcn/UI or similar
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Lock,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquareHeart,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  UserCircle,
  X, // Zap is imported but not used, can be removed if not needed later
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const useCases = [
  {
    id: 1,
    title: "Couples",
    description:
      "Share intimate moments and conversations without worrying about message history or screenshots.",
    gradient: "from-[#EC4899] to-[#A855F7]", // Replaced pink/purple names with hex/standard Tailwind colors
  },
  {
    id: 2,
    title: "New Connections",
    description:
      "Explore potential relationships in a space where you can be authentic without digital baggage.",
    gradient: "from-[#A855F7] to-[#3B82F6]", // Replaced purple/blue names with hex/standard Tailwind colors
  },
  {
    id: 3,
    title: "Private Discussions",
    description:
      "Have sensitive conversations that require discretion and complete privacy.",
    gradient: "from-[#14B8A6] to-[#3B82F6]", // Replaced teal/blue names with hex/standard Tailwind colors
  },
  {
    id: 4,
    title: "Digital Minimalists",
    description:
      "For those who prefer to live in the moment without creating permanent digital records.",
    gradient: "from-[#F97316] to-[#EC4899]", // Replaced orange/pink names with hex/standard Tailwind colors
  },
];

const faqs = [
  {
    question: "Is Whispr really secure?",
    answer:
      "Yes, Whispr uses end-to-end encryption for all conversations. This means that only you and the person you're talking to can read the messages—not even we can access them. Additionally, no chat logs are stored after conversations end.",
  },
  {
    question: "How long do conversations last?",
    answer:
      "Conversations last only as long as both participants remain in the chat. Once either person leaves, the entire conversation is permanently deleted. You can also set messages to self-destruct after a certain time period.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "Yes, Whispr requires basic authentication to prevent abuse, but we collect minimal information. You can sign up with just an email address and password—no personal details required.",
  },
  {
    question: "Can conversations be screenshotted?",
    answer:
      "While we can't prevent screenshots, Whispr does notify you if the other person takes a screenshot. Remember that true digital privacy requires trust on both sides.",
  },
  {
    question: "Is Whispr free to use?",
    answer:
      "Yes, Whispr's core features are completely free. We offer a premium tier with additional features like custom disappearing timeframes and advanced privacy controls.",
  },
  {
    question: "How does Whispr make money if it's free?",
    answer:
      "Whispr has a premium subscription tier with enhanced features. We never sell your data or show advertisements—our business model is aligned with protecting your privacy.",
  },
];

const navLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % useCases.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + useCases.length) % useCases.length);

  const { isAuthenticated, user } = useAuth();

  console.log(isAuthenticated, "jjjjjjjjjjjjj");
  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Removed 'current' from dependency array to avoid resetting interval on manual navigation

  const toggleQuestion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Define animation variants for Framer Motion
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay },
    }),
  };

  const bubbleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (delay = 0) => ({
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 10, delay },
    }),
  };

  return (
    // Use arbitrary value for the specific dark background
    <div className="min-h-screen bg-[#121212] text-white">
      {/* NAVBAR STARTS*/}
      <nav
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-2 bg-black/80 backdrop-blur-lg border-b border-white/10 shadow-lg"
            : "py-4 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <MessageSquareHeart className="w-8 h-8 text-[#6200EA]" />
            </motion.div>
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-[#6200EA] to-[#00BFA5] bg-clip-text text-transparent">
                Whispr
              </span>
            </h1>
          </motion.div>

          {/* Desktop Navigation Links - Only visible on md screens and up */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="relative text-gray-300 hover:text-white transition-colors text-sm font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {link.label}
                <motion.span
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6200EA] to-[#00BFA5]"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Authentication Buttons */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <motion.div
                  className="relative h-10 w-10 rounded-full cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="h-10 w-10 rounded-full border border-white/20 overflow-hidden bg-gradient-to-r from-[#6200EA] to-[#00BFA5]">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.firstName || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black/90 backdrop-blur-lg border border-white/10 overflow-hidden z-50"
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm font-medium text-white border-b border-white/10">
                          My Account
                        </div>

                        <motion.a
                          href="#profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          whileHover={{ x: 2 }}
                        >
                          <UserCircle className="mr-2 h-4 w-4" />
                          Profile
                        </motion.a>

                        <motion.a
                          href="#settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          whileHover={{ x: 2 }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </motion.a>

                        <div className="border-t border-white/10">
                          <motion.a
                            href="#logout"
                            className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                            whileHover={{ x: 2 }}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                          </motion.a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center">
                <motion.button
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>

                <motion.button
                  className="bg-gradient-to-r from-[#6200EA] to-[#00BFA5] px-6 py-2 rounded-full text-white text-sm font-medium shadow-lg hidden md:block"
                  whileHover={{
                    boxShadow: "0 0 15px rgba(98, 0, 234, 0.6)",
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </nav>
      {/* NAVBAR ENDS*/}

      <div className="relative min-h-screen flex items-center justify-center pt-24 pb-16">
        {/* Background elements - Replaced custom colors with arbitrary values */}
        {/* Removed custom animate-float - consider Framer Motion or simpler static effect if needed */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#6200EA]/10 rounded-full filter blur-3xl opacity-50"></div>
          <div
            className="absolute bottom-20 right-10 w-80 h-80 bg-[#00BFA5]/10 rounded-full filter blur-3xl opacity-50"
            style={{ animationDelay: "2s" }} // Note: inline style animation delay won't work without an animation defined
          ></div>
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial="hidden"
            animate="visible"
          >
            {/* Use Framer Motion for fade-in animation */}
            <motion.div className="space-y-8" variants={fadeIn} custom={0.1}>
              <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <Shield className="w-4 h-4 text-[#00BFA5]" />
                <span className="text-sm font-medium">Private & Ephemeral</span>
              </div>

              {/* Simplified text color - removed darkMode dependency */}
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                Messages that <span className="text-teal-400">disappear</span>.
                <br />
                Conversations that{" "}
                <span className="text-purple-400">sizzle</span>.
              </h1>

              <p className="text-lg text-gray-300">
                Whispr offers temporary, private text conversations that leave
                no trace. Perfect for discreet connections, spontaneous chats,
                and moments you don't want saved forever. No history, no regrets
                — just pure connection.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* FIX: Added space between from and to */}
                {/* Use arbitrary value for shadow color */}
                <Button className="relative overflow-hidden bg-gradient-to-r from-[#6200EA] to-[#00BFA5] text-white font-semibold transition-all hover:shadow-lg hover:shadow-[#6200EA]/20 active:scale-95 group text-lg px-8 py-4">
                  Start Chatting
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-[#00BFA5]" />
                  <span>End-to-end privacy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#00BFA5]" />
                  <span>No message history</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#00BFA5]" />
                  <span>No tracking or data collection</span>
                </div>
              </div>
            </motion.div>

            {/* Mock Chat UI */}
            <motion.div className="relative" variants={fadeIn} custom={0.3}>
              {/* Use arbitrary values for gradient */}
              <div className="absolute -inset-2 bg-gradient-to-b from-[#6200EA]/10 to-[#00BFA5]/10 rounded-2xl filter blur-xl opacity-50"></div>

              <div className="relative bg-[#1E1E1E] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="h-14 bg-gradient-to-r from-[#6200EA]/80 to-[#00BFA5]/80 flex items-center px-4 rounded-t-lg mb-4">
                  <div className="w-8 h-8 rounded-full bg-white/20 mr-3 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-medium">Anonymous</div>
                    <div className="text-white/60 text-xs">Online</div>
                  </div>
                </div>
                {/* Messages - Use Framer Motion for animations */}
                <div className="flex flex-col space-y-4 h-64 overflow-y-auto pr-2 mb-4">
                  <motion.div
                    className="self-start max-w-[70%] bg-[#2D2D2D] rounded-2xl rounded-bl-none p-3"
                    variants={bubbleIn}
                    custom={0.5}
                  >
                    <p className="text-gray-200 text-sm sm:text-base">
                      Hey there... looking for someone to chat with?
                    </p>
                  </motion.div>

                  {/* Use arbitrary value for gradient */}
                  <motion.div
                    className="self-end max-w-[70%] bg-gradient-to-r from-[#6200EA]/80 to-[#6200EA] rounded-2xl rounded-br-none p-3"
                    variants={bubbleIn}
                    custom={1.0}
                  >
                    <p className="text-white text-sm sm:text-base">
                      Hi! Yes, just wanting to connect without leaving a trace.
                    </p>
                  </motion.div>

                  <motion.div
                    className="self-start max-w-[70%] bg-[#2D2D2D] rounded-2xl rounded-bl-none p-3"
                    variants={bubbleIn}
                    custom={1.5}
                  >
                    <p className="text-gray-200 text-sm sm:text-base">
                      Perfect! That's what Whispr is all about. No history, no
                      records.
                    </p>
                  </motion.div>

                  {/* Use arbitrary value for gradient */}
                  <motion.div
                    className="self-end max-w-[70%] bg-gradient-to-r from-[#6200EA]/80 to-[#6200EA] rounded-2xl rounded-br-none p-3"
                    variants={bubbleIn}
                    custom={2.0}
                  >
                    <p className="text-white text-sm sm:text-base">
                      Exactly what I needed. Let's chat...
                    </p>
                  </motion.div>
                </div>

                {/* Input Area */}
                <div className="mt-4 bg-[#2D2D2D] rounded-lg border border-white/5 p-2 flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-gray-500 px-2"
                  />
                  {/* Use arbitrary value for background */}
                  <Button className="bg-[#00BFA5] hover:bg-[#00BFA5]/90 text-white h-8 w-8 p-0 rounded-full flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Decorative elements - Use arbitrary values */}
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-[#6200EA]/10 blur-xl -z-10"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-[#00BFA5]/10 blur-xl -z-10"></div>
            </motion.div>

            {/* This paragraph was outside the grid, moved it below the grid or consider placing within a column if needed */}
            {/* {!isAuthenticated && ( // This condition seemed misplaced, maybe intended for a sign-up prompt below?
              <p className="text-sm opacity-60 max-w-lg mx-auto lg:col-span-2 text-center mt-8">
                Sign up takes less than 30 seconds. We only ask for what we need
                — your privacy matters.
              </p>
            )} */}
          </motion.div>
        </div>
      </div>

      {/* How it Works Section (appears if !isAuthenticated) */}
      {!isAuthenticated && (
        // Section using standard Tailwind dark mode colors
        <section id="how-it-works" className="py-16 px-4 bg-gray-900">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              How <span className="text-purple-400">Whispr</span> Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="p-6 rounded-xl bg-gray-800 hover:bg-gray-700/60 text-center transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <User size={24} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Sign In Securely
                </h3>
                <p className="text-gray-400">
                  Quick authentication — we care about security, not your life
                  story.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-xl bg-gray-800 hover:bg-gray-700/60 text-center transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <MessageCircle size={24} className="text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Start a Chat
                </h3>
                <p className="text-gray-400">
                  Connect with someone special for a conversation that stays in
                  the moment.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-xl bg-gray-800 hover:bg-gray-700/60 text-center transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X size={24} className="text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Leave No Trace
                </h3>
                <p className="text-gray-400">
                  When you're done, everything vanishes. What happens in Whispr,
                  stays in Whispr.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            {/* Removed font-montserrat */}
            {/* FIX: Added space between from and to */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-[#6200EA] to-[#00BFA5] bg-clip-text text-transparent">
                Whispr
              </span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Designed for those who value privacy, spontaneity, and genuine
              connections without the permanent digital footprint.
            </p>
          </div>

          {/* Simplified grid structure, combining feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Feature 1: Complete Privacy */}
            <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-6 transition-all hover:shadow-lg hover:shadow-[#6200EA]/10 flex items-start space-x-4">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#6200EA]/20">
                <EyeOff className="w-6 h-6 text-[#6200EA]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  No Chat History
                </h3>
                <p className="text-gray-300">
                  Messages vanish once you close the chat — like writing in
                  disappearing ink. Everything disappears when your session
                  ends.
                </p>
              </div>
            </div>

            {/* Feature 2: Encryption */}
            <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-6 transition-all hover:shadow-lg hover:shadow-[#00BFA5]/10 flex items-start space-x-4">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#00BFA5]/20">
                <Lock className="w-6 h-6 text-[#00BFA5]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  End-to-End Encryption
                </h3>
                <p className="text-gray-300">
                  Your conversations are locked down tight. Only you and your
                  partner have the key. Not even we can access them.
                </p>
              </div>
            </div>

            {/* Feature 3: Playful Connections */}
            <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-6 transition-all hover:shadow-lg hover:shadow-[#6200EA]/10 flex items-start space-x-4">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#6200EA]/20">
                <Sparkles className="w-6 h-6 text-[#6200EA]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Spontaneous Connections
                </h3>
                <p className="text-gray-300">
                  Meet new people or connect with someone special in a space
                  that encourages authentic, in-the-moment conversations.
                </p>
              </div>
            </div>

            {/* Feature 4: Intuitive */}
            <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-6 transition-all hover:shadow-lg hover:shadow-[#00BFA5]/10 flex items-start space-x-4">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#00BFA5]/20">
                <Star className="w-6 h-6 text-[#00BFA5]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Intuitive Experience
                </h3>
                <p className="text-gray-300">
                  Simple, clean interface focused on the conversation. No
                  distractions, no complex features - just smooth, effortless
                  communication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Carousel */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-white">
            Who Uses <span className="text-purple-400">Whispr</span>?
          </h2>
          <p className="text-center text-gray-300 mb-16 max-w-2xl mx-auto">
            From romantic connections to private conversations, Whispr is for
            anyone who values discretion.
          </p>

          <div className="relative max-w-4xl mx-auto">
            {/* Prev Button */}
            <div className="absolute top-1/2 -left-4 sm:-left-8 md:-left-12 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                // Use arbitrary values for border/bg
                className="rounded-full border-[#6200EA]/50 bg-black/50 backdrop-blur-sm hover:bg-[#6200EA]/30 text-white"
                onClick={prev}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>

            {/* Carousel Content */}
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-lg">
              <div className="relative h-[300px] md:h-[350px]">
                {" "}
                {/* Adjusted height slightly */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 30 }} // Slide in effect
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }} // Slide out effect
                    transition={{ duration: 0.4 }}
                    // Use the gradient defined in the useCases array
                    className={`absolute inset-0 bg-gradient-to-br ${useCases[current].gradient} p-8 md:p-12 flex flex-col justify-center text-white`}
                  >
                    <h3 className="text-3xl font-bold mb-4 drop-shadow-md">
                      {useCases[current].title}
                    </h3>
                    <p className="text-lg md:text-xl max-w-lg drop-shadow-sm">
                      {useCases[current].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Next Button */}
            <div className="absolute top-1/2 -right-4 sm:-right-8 md:-right-12 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                // Use arbitrary values for border/bg
                className="rounded-full border-[#6200EA]/50 bg-black/50 backdrop-blur-sm hover:bg-[#6200EA]/30 text-white"
                onClick={next}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 gap-2">
              {useCases.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    index === current
                      ? "bg-purple-500"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-[#121212]">
        {/* Background elements - Use arbitrary values */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-1/4 left-1/4 w-96 h-96 bg-[#6200EA]/5 rounded-full filter blur-3xl opacity-40"></div>
          <div className="absolute -bottom-1/4 right-1/4 w-96 h-96 bg-[#00BFA5]/5 rounded-full filter blur-3xl opacity-40"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* Removed font-montserrat */}
            {/* FIX: Added space between from and to */}
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Ready for conversations that{" "}
              <span className="bg-gradient-to-r from-[#6200EA] to-[#00BFA5] bg-clip-text text-transparent">
                don't follow you
              </span>
              ?
            </h2>

            <p className="text-xl text-gray-300 mb-10">
              Join Whispr today and experience the freedom of temporary, private
              messaging. Connect, chat, and leave no trace.
            </p>

            {/* FIX: Added space between from and to */}
            {/* Use arbitrary value for shadow, replaced custom pulse with standard pulse */}
            <Button className="relative overflow-hidden bg-gradient-to-r from-[#6200EA] to-[#00BFA5] text-white font-semibold rounded-md transition-all hover:shadow-lg hover:shadow-[#6200EA]/30 active:scale-95 group text-lg px-10 py-5 animate-pulse">
              Get Started Now
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="mt-6 text-sm text-gray-400">
              No credit card required. Free to use.
            </p>
          </div>
        </div>
      </section>

      {/* Removed the duplicate "When to Whispr" section as it largely repeated the Carousel content */}

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[#181818]">
        {" "}
        {/* Slightly lighter bg for contrast */}
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Everything you need to know about Whispr's privacy and
              functionality.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-white/10 rounded-xl overflow-hidden bg-[#1E1E1E] transition-all duration-300 ease-in-out"
              >
                <button
                  className="w-full py-4 px-6 flex justify-between items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFA5] rounded-lg"
                  onClick={() => toggleQuestion(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-lg font-medium text-white">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown
                      size={20}
                      className={`text-[#00BFA5] transition-transform duration-300 ${
                        openIndex === index ? "transform rotate-180" : ""
                      }`}
                    />
                  </motion.div>
                </button>

                <motion.div
                  id={`faq-answer-${index}`}
                  initial={false}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2">
                    {" "}
                    {/* Added pt-2 */}
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-6">Still have questions?</p>
            <a
              href="#" // Replace with actual contact link
              className="inline-block px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#121212] border-t border-white/5 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquareHeart className="w-7 h-7 text-[#6200EA]" />
                {/* Removed font-montserrat */}
                {/* FIX: Added space between from and to */}
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#6200EA] to-[#00BFA5] bg-clip-text text-transparent">
                  Whispr
                </h3>
              </div>
              <p className="text-gray-400 text-sm">
                Private, temporary conversations for those who value discretion
                and authentic connection.
              </p>
            </div>

            {/* Column 2: Product Links */}
            <div className="md:col-span-1">
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  {/* Link to FAQ section or dedicated security page */}
                  <a
                    href="#faq"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal Links */}
            <div className="md:col-span-1">
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Company Links */}
            <div className="md:col-span-1">
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer Row */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm order-2 md:order-1 mt-4 md:mt-0">
              © {new Date().getFullYear()} Whispr. All rights reserved.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-4 order-1 md:order-2">
              {/* Replace # with actual social links */}
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Twitter</span>
                {/* SVG included in original code */}
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Instagram</span>
                {/* SVG included in original code */}
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">GitHub</span>
                {/* SVG included in original code */}
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
