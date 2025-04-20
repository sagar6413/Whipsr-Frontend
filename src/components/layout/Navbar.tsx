import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, MessageSquare } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 z-50 bg-whispr-dark/90 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-8 h-8 text-[#6200EA]" />
          <h1 className="text-2xl font-montserrat font-bold bg-gradient-to-r from-[#6200EA]to-[#00BFA5] bg-clip-text text-transparent">
            Whispr
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </a>
          <a href="#faq" className="text-gray-300 hover:text-white transition-colors">
            FAQ
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-300 hover:text-white">
            Sign In
          </Button>
          <Button className="bg-gradient-to-r from-[#6200EA]to-[#00BFA5] hover:opacity-90 text-white">
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
