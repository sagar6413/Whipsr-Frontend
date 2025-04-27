"use client";

import { useState, useEffect, useRef, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquareHeart,
  User,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { User as UserType } from "@/types/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Adjust path and type name if needed

interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  navLinks: NavLink[];
  isAuthenticated: boolean;
  user: UserType | null;
}

const Navbar: FC<NavbarProps> = ({ navLinks, isAuthenticated, user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
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

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks?.map((link, index) => (
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

        {/* Authentication Buttons / User Dropdown */}
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
                    <Image
                      src={user.avatarUrl}
                      alt={user.firstName || "User"}
                      className="h-full w-full object-cover"
                      layout="fill" // Use layout prop as needed
                      objectFit="cover" // Use objectFit to maintain aspect ratio
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
                        href="#profile" // Consider using NextLink for client-side routing if these are internal pages
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
                          href="#logout" // This should likely trigger a logout function
                          className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                          whileHover={{ x: 2 }}
                          // onClick={handleLogout} // Add logout handler
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
                onClick={handleSignIn} // Add sign-in handler
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
                onClick={handleSignUp} // Add sign-up handler
              >
                Sign Up
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
