
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-whispr-purple/10 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-whispr-teal/10 rounded-full filter blur-3xl opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-6">
            Ready for private conversations that <span className="bg-gradient-to-r from-[#6200EA]to-[#00BFA5] bg-clip-text text-transparent">don't follow you</span>?
          </h2>
          
          <p className="text-xl text-gray-300 mb-10">
            Join Whispr today and experience the freedom of temporary, private messaging.
            Connect, chat, and leave no trace.
          </p>
          
          <Button className="relative overflow-hidden bg-gradient-to-r from-[#6200EA]to-[#00BFA5] text-white font-semibold py-3 px-6 rounded-md transition-all hover:shadow-lg hover:shadow-whispr-purple/20 active:scale-95 group text-lg px-10 py-6 animate-pulse-glow">
            Get Started Now
            <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="mt-6 text-sm text-gray-400">
            No credit card required. Free to use.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
