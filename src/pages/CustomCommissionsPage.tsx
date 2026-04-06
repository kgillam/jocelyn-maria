import React, { useState } from 'react';
import { Camera, Send, Home, User, Paintbrush } from 'lucide-react';
import { motion } from 'motion/react';

export default function CustomCommissionsPage() {
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  return (
    <main className="min-h-screen bg-ivory pt-32 pb-24 texture-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24 relative z-10">
          <h1 className="font-serif text-3xl md:text-5xl text-ink mb-6 uppercase tracking-[0.15em] font-light">Custom Commissions</h1>
          <div className="w-16 h-px bg-olive mx-auto mb-8"></div>
          <p className="font-sans text-ink/70 text-sm md:text-base max-w-xl mx-auto">
            Capture your most cherished moments and places in timeless watercolor. Exclusively offering two premier commission styles to immortalize your memories.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
          
          {/* Left Column: Commission Details */}
          <div className="w-full lg:w-5/12 flex flex-col justify-start space-y-16">
            
            {/* House Portraits */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Home className="w-6 h-6 text-olive" strokeWidth={1.5} />
                <h2 className="font-serif text-2xl tracking-widest uppercase text-ink">Custom House Portraits</h2>
              </div>
              <div className="space-y-4 font-sans text-ink/70">
                <p className="leading-relaxed">
                  Commemorate your family home, childhood estate, wedding venue, or first apartment. These bespoke watercolor pieces capture the architectural charm and personal warmth of the places you love most.
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-sm">
                  <li>Hand-painted using premium archival grade watercolors.</li>
                  <li>Available in 8x10, 11x14, or 16x20.</li>
                  <li>Minor landscaping or structural alterations can be requested.</li>
                </ul>
              </div>
            </div>

            {/* Custom Portraits */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-olive" strokeWidth={1.5} />
                <h2 className="font-serif text-2xl tracking-widest uppercase text-ink">Custom Portraits</h2>
              </div>
              <div className="space-y-4 font-sans text-ink/70">
                <p className="leading-relaxed">
                  Beautiful, stylized watercolor or mixed-media figures capturing precious family moments, wedding memories, and candid snapshots. Designed with a signature, timeless artistic touch.
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-sm">
                  <li>Focuses heavily on impressionistic emotion and posture.</li>
                  <li>Available in 8x10, 11x14, or 16x20.</li>
                  <li>Seamlessly composites multiple reference photos if needed.</li>
                </ul>
              </div>
            </div>

            {/* Turnaround Notice */}
            <div className="p-8 bg-cream border border-sage/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-olive/5 rounded-bl-full transform translate-x-10 -translate-y-10" />
              <h3 className="font-serif italic text-lg text-ink mb-3 flex items-center">
                <Paintbrush className="w-4 h-4 mr-2 text-olive" /> Notice on Turnarounds
              </h3>
              <p className="font-sans text-sm text-ink/70 leading-relaxed">
                Due to high demand, please anticipate a standard 2-3 week turnaround time before shipping. Once your inquiry is submitted below, Jocelyn will review your requested details and email you a personalized quote to secure your booking.
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Booking Form */}
          <div className="w-full lg:w-7/12">
            <form className="bg-white/60 backdrop-blur-sm p-8 sm:p-10 shadow-sm border border-sage/20 space-y-8" onSubmit={(e) => e.preventDefault()}>
              
              <div className="text-center mb-8 border-b border-sage/20 pb-8">
                <h3 className="font-serif text-2xl text-ink">Commission Inquiry</h3>
                <p className="font-sans text-sm text-ink/60 mt-2">Fill out the details below to begin.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/2 space-y-2">
                  <label className="font-serif text-sm tracking-widest uppercase text-ink/80 block">First Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-sage/40 py-2 font-sans text-ink focus:outline-none focus:border-olive transition-colors" />
                </div>
                <div className="w-full sm:w-1/2 space-y-2">
                  <label className="font-serif text-sm tracking-widest uppercase text-ink/80 block">Last Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-sage/40 py-2 font-sans text-ink focus:outline-none focus:border-olive transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-serif text-sm tracking-widest uppercase text-ink/80 block">Email Address</label>
                <input type="email" className="w-full bg-transparent border-b border-sage/40 py-2 font-sans text-ink focus:outline-none focus:border-olive transition-colors" />
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/2 space-y-2">
                  <label className="font-serif text-sm tracking-widest uppercase text-ink/80 block">Commission Type</label>
                  <select className="w-full bg-transparent border-b border-sage/40 py-2 font-sans text-ink focus:outline-none focus:border-olive transition-colors cursor-pointer appearance-none rounded-none">
                    <option>Custom House Portrait</option>
                    <option>Custom Portrait / Figure</option>
                  </select>
                </div>
                <div className="w-full sm:w-1/2 space-y-2">
                  <label className="font-serif text-sm tracking-widest uppercase text-ink/80 block">Preferred Size</label>
                  <select className="w-full bg-transparent border-b border-sage/40 py-2 font-sans text-ink focus:outline-none focus:border-olive transition-colors cursor-pointer appearance-none rounded-none">
                    <option>8x10"</option>
                    <option>11x14"</option>
                    <option>16x20"</option>
                    <option>Not Sure Yet</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <label className="font-serif text-sm tracking-widest uppercase text-ink/80 block mb-4 border-t border-sage/20 pt-8">Attach Reference Photo</label>
                <label 
                  onMouseEnter={() => setIsHoveringImage(true)}
                  onMouseLeave={() => setIsHoveringImage(false)}
                  className="cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed border-sage/40 hover:border-olive py-10 bg-cream hover:bg-olive/5 transition-all w-full text-center rounded-lg"
                >
                  <motion.div animate={{ scale: isHoveringImage ? 1.1 : 1 }} transition={{ duration: 0.2 }}>
                    <Camera className="w-8 h-8 text-olive mb-3 opacity-80" />
                  </motion.div>
                  <span className="font-sans text-sm text-ink/60 group-hover:text-ink/80 transition-colors px-4">
                    Click to upload your primary reference image. <br/><span className="text-xs mt-1 block">(You can provide additional context in the message box below)</span>
                  </span>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>

              <div className="space-y-2">
                <label className="font-serif text-sm tracking-widest uppercase text-ink/80 block">Project Details & Notes</label>
                <textarea 
                  rows={4}
                  className="w-full bg-cream/50 border border-sage/40 p-4 font-sans text-sm text-ink focus:outline-none focus:border-olive transition-colors resize-y min-h-[120px]"
                  placeholder="Share the details of your project... (e.g. Include the family dog on the porch, remove power lines from the photo, emphasize certain colors...)"
                />
              </div>

              <button type="submit" className="w-full bg-ink text-cream py-4 font-serif uppercase tracking-[0.2em] text-sm hover:bg-olive transition-colors flex items-center justify-center space-x-2 group mt-4">
                <span>Submit Inquiry</span>
                <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

            </form>
          </div>
        </div>

      </div>
    </main>
  );
}
