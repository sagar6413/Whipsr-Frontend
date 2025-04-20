import React from "react";
import { MessageSquare, Lock, Zap } from "lucide-react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#1E1E1E]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">
            How <span className="bg-gradient-to-r from-[#6200EA]to-[#00BFA5] bg-clip-text text-transparent">Whispr</span> Works
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Connect with others in private conversations that vanish when you're done.
            No history, no traces, just genuine connections.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6 transition-all hover:shadow-lg hover:shadow-whispr-purple/10 flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#6200EA]to-whispr-purple/50 mb-6">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-montserrat font-semibold mb-3">Create a Profile</h3>
            <p className="text-gray-300">
              Set up your anonymous profile with a username. No personal details required - your privacy is our priority.
            </p>
          </div>
          
          <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6 transition-all hover:shadow-lg hover:shadow-whispr-purple/10 flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-whispr-teal to-[#00BFA5]/50 mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-montserrat font-semibold mb-3">Connect Securely</h3>
            <p className="text-gray-300">
              Initiate private conversations with end-to-end encryption. Only you and your chat partner can access the messages.
            </p>
          </div>
          
          <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6 transition-all hover:shadow-lg hover:shadow-whispr-purple/10 flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#6200EA]to-[#00BFA5] mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-montserrat font-semibold mb-3">Vanish Without Trace</h3>
            <p className="text-gray-300">
              When you're done, the entire conversation disappears forever. No logs, no history, complete privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
