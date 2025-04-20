import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Shield } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-16">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-whispr-purple/20 rounded-full filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-whispr-teal/20 rounded-full filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "2s" }}></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <Shield className="w-4 h-4 text-[#00BFA5]" />
              <span className="text-sm font-medium">Private & Ephemeral</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-montserrat font-bold leading-tight">
              Chat that <span className="bg-gradient-to-r from-[#6200EA]to-[#00BFA5] bg-clip-text text-transparent">disappears</span> when you're done
            </h1>
            
            <p className="text-lg text-gray-300">
              Whispr offers temporary, private text conversations that leave no trace. Perfect for discreet connections, spontaneous chats, and moments you don't want saved forever.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="relative overflow-hidden bg-gradient-to-r from-[#6200EA]to-[#00BFA5] text-white font-semibold py-3 px-6 rounded-md transition-all hover:shadow-lg hover:shadow-whispr-purple/20 active:scale-95 group text-lg px-8 py-4">
                Start Chatting
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" className="border-white/10 hover:bg-white/5 text-lg">
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-[#00BFA5]" />
                <span>End-to-end privacy</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[#00BFA5]" />
                <span>No message history</span>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-whispr-purple/10 to-[#00BFA5]/10 rounded-2xl filter blur-xl opacity-30"></div>
            
            <div className="relative bg-[#1E1E1E] rounded-2xl border border-white/10 p-8 shadow-xl">
              <div className="flex flex-col space-y-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="self-start max-w-[70%] bg-[#2D2D2D] rounded-2xl rounded-bl-none p-4 animate-bubble-in">
                  <p className="text-gray-200">Hey there... looking for someone to chat with?</p>
                </div>
                
                <div className="self-end max-w-[70%] bg-gradient-to-r from-whispr-purple/80 to-whispr-purple rounded-2xl rounded-br-none p-4 animate-bubble-in" style={{ animationDelay: "1s" }}>
                  <p className="text-white">Hi! Yes, just wanting to connect without leaving a trace.</p>
                </div>
                
                <div className="self-start max-w-[70%] bg-[#2D2D2D] rounded-2xl rounded-bl-none p-4 animate-bubble-in" style={{ animationDelay: "2s" }}>
                  <p className="text-gray-200">Perfect! That's what Whispr is all about. No history, no records.</p>
                </div>
                
                <div className="self-end max-w-[70%] bg-gradient-to-r from-whispr-purple/80 to-whispr-purple rounded-2xl rounded-br-none p-4 animate-bubble-in" style={{ animationDelay: "3s" }}>
                  <p className="text-white">Exactly what I needed. Let's chat...</p>
                </div>
              </div>
              
              <div className="mt-6 bg-[#2D2D2D] rounded-lg border border-white/5 p-2 flex items-center">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 bg-transparent border-none focus:outline-none text-white"
                />
                <Button className="bg-whispr-teal hover:bg-whispr-teal/90 text-white h-8 w-8 p-0 rounded-full">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="absolute bottom-4 right-4 text-xs text-gray-400 flex items-center">
                <div className="w-2 h-2 rounded-full bg-whispr-teal mr-2 animate-pulse"></div>
                Chat disappears in 15:42
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
