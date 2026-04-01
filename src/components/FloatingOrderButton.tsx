import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, X, UploadCloud } from 'lucide-react';

export default function FloatingOrderButton() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 3.8, duration: 0.8 }} // Delay to appear after splash screen & hero
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[90] bg-ink text-ivory p-4 rounded-full shadow-2xl hover:bg-olive hover:scale-110 transition-all duration-300 group flex items-center justify-center pointer-events-auto"
        aria-label="Request Custom Order"
      >
        <PenTool className="w-6 h-6 group-hover:-rotate-12 transition-transform duration-300" strokeWidth={1.5} />
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 sm:px-12 pointer-events-auto"
            onClick={() => setIsOpen(false)}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ivory w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-sage/10 p-6 relative flex-shrink-0">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 text-ink hover:text-olive transition-colors"
                >
                  <X className="w-6 h-6" strokeWidth={1.5} />
                </button>
                <h2 className="font-serif text-2xl text-ink text-center tracking-wide">Custom Commission</h2>
                <p className="text-center font-sans text-xs text-ink/70 mt-2 uppercase tracking-widest">Submit a direct request</p>
              </div>

              {/* Form Body - Scrollable */}
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Name */}
                  <div>
                    <input 
                      type="text" 
                      id="name"
                      placeholder="Your Full Name"
                      required
                      className="w-full bg-transparent border-b border-sage/40 px-0 py-3 font-sans text-sm text-ink focus:outline-none focus:border-olive transition-colors placeholder:text-ink/40"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <input 
                      type="tel" 
                      id="phone"
                      placeholder="Phone Number"
                      required
                      className="w-full bg-transparent border-b border-sage/40 px-0 py-3 font-sans text-sm text-ink focus:outline-none focus:border-olive transition-colors placeholder:text-ink/40"
                    />
                  </div>

                  {/* Grid for Dropdowns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Order Type */}
                    <div>
                      <select 
                        required
                        className="w-full bg-transparent border-b border-sage/40 px-0 py-3 font-sans text-sm text-ink focus:outline-none focus:border-olive transition-colors appearance-none cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled className="text-ink/40">Select Order Type</option>
                        <option value="house">House Portrait</option>
                        <option value="pet">Pet Portrait</option>
                        <option value="wedding">Wedding Venue Sketch</option>
                        <option value="stationery">Custom Stationery</option>
                        <option value="other">Other / Describe in details</option>
                      </select>
                    </div>

                    {/* Size */}
                    <div>
                      <select 
                        required
                        className="w-full bg-transparent border-b border-sage/40 px-0 py-3 font-sans text-sm text-ink focus:outline-none focus:border-olive transition-colors appearance-none cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled className="text-ink/40">Select Canvas Size</option>
                        <option value="5x7">5x7"</option>
                        <option value="8x10">8x10"</option>
                        <option value="11x14">11x14"</option>
                        <option value="custom">Custom Size Needed</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Upload Area */}
                  <div className="mt-6">
                    <p className="font-sans text-xs uppercase tracking-widest text-ink/70 mb-3 block">Reference Photo</p>
                    <label className="border border-dashed border-sage/60 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-olive hover:bg-sage/5 transition-colors group">
                      <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5 text-olive" strokeWidth={1.5} />
                      </div>
                      <span className="font-sans text-sm text-ink/80 block mb-1">Click to upload your image</span>
                      <span className="font-sans text-xs text-ink/50">PNG, JPG up to 10MB</span>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>

                  {/* Submit */}
                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full bg-ink text-ivory py-4 uppercase font-serif tracking-widest text-sm hover:bg-olive transition-colors hover:shadow-lg"
                    >
                      Send Request
                    </button>
                    <p className="text-center font-sans text-[10px] text-ink/50 mt-4">We will review your request and reach out shortly to confirm details and pricing.</p>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
