
import React from "react";
import { Shield, Sparkles, Heart, Star } from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">
            Why Choose <span className="bg-gradient-to-r from-[#6200EA]to-[#00BFA5] bg-clip-text text-transparent">Whispr</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Designed for those who value privacy, spontaneity, and genuine connections
            without the permanent digital footprint.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6 transition-all hover:shadow-lg hover:shadow-whispr-purple/10 flex items-start space-x-4">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-whispr-purple/20">
              <Shield className="w-6 h-6 text-[#6200EA]" />
            </div>
            <div>
              <h3 className="text-xl font-montserrat font-semibold mb-2">Complete Privacy</h3>
              <p className="text-gray-300">
                No message history, no logs, no traces. Everything disappears when your 
                session ends, giving you true digital privacy.
              </p>
            </div>
          </div>
          
          <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6 transition-all hover:shadow-lg hover:shadow-whispr-purple/10 flex items-start space-x-4">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-whispr-teal/20">
              <Sparkles className="w-6 h-6 text-[#00BFA5]" />
            </div>
            <div>
              <h3 className="text-xl font-montserrat font-semibold mb-2">Playful Connections</h3>
              <p className="text-gray-300">
                Meet new people or connect with someone special in a space that encourages 
                authentic, in-the-moment conversations.
              </p>
            </div>
          </div>
          
          <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6 transition-all hover:shadow-lg hover:shadow-whispr-purple/10 flex items-start space-x-4">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-whispr-purple/20">
              <Heart className="w-6 h-6 text-[#6200EA]" />
            </div>
            <div>
              <h3 className="text-xl font-montserrat font-semibold mb-2">Discreet Space for Couples</h3>
              <p className="text-gray-300">
                Create a private space for intimate conversations that won't be saved to 
                device history or cloud storage. Perfect for couples seeking discretion.
              </p>
            </div>
          </div>
          
          <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6 transition-all hover:shadow-lg hover:shadow-whispr-purple/10 flex items-start space-x-4">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-whispr-teal/20">
              <Star className="w-6 h-6 text-[#00BFA5]" />
            </div>
            <div>
              <h3 className="text-xl font-montserrat font-semibold mb-2">Intuitive Experience</h3>
              <p className="text-gray-300">
                Simple, clean interface focused on the conversation. No distractions, 
                no complex features - just smooth, effortless communication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
