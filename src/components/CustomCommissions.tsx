import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Palette, Maximize, CheckCircle2, User } from 'lucide-react';

export default function CustomCommissions() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([
    '/watercolorredbrickhome.png',
    '/watercolorbrickhome.png',
    '/watercolorwhitehome.png'
  ]);

  const handleImageSwap = (clickedIndex: number) => {
    if (clickedIndex === 0) return;
    setImages(prev => {
      const newArr = [...prev];
      const temp = newArr[0];
      newArr[0] = newArr[clickedIndex];
      newArr[clickedIndex] = temp;
      return newArr;
    });
  };

  return (
    <section className="py-24 bg-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <h2 className="font-serif text-2xl md:text-4xl text-ink mb-4 uppercase tracking-[0.1em] md:tracking-[0.15em] font-light">House Portraits: Custom Commissions</h2>
          <div className="w-16 h-px bg-olive mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Floating Gallery */}
          <div className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center group perspective-1000 order-2">
             {images.map((src, index) => {
               const isMain = index === 0;
               const isSec1 = index === 1;
               
               let className = "";
               let animY = [];
               let trans: any = {};

               if (isMain) {
                 className = "w-[80%] h-auto object-contain drop-shadow-2xl absolute z-20 hover:scale-105 transition-transform duration-500 cursor-pointer transform-gpu";
                 animY = [-15, 15, -15];
                 trans = { duration: 8, repeat: Infinity, ease: "easeInOut", layout: { duration: 0.6, ease: "circOut" } };
               } else if (isSec1) {
                 className = "w-[75%] h-auto object-contain drop-shadow-xl absolute top-4 md:top-8 left-0 md:-left-4 z-10 opacity-70 hover:!opacity-100 hover:!z-30 transition-all duration-700 cursor-pointer transform-gpu";
                 animY = [10, -10, 10];
                 trans = { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1, layout: { duration: 0.6, ease: "circOut" } };
               } else {
                 className = "w-[75%] h-auto object-contain drop-shadow-xl absolute bottom-4 md:bottom-8 right-0 md:-right-4 z-10 opacity-70 hover:!opacity-100 hover:!z-30 transition-all duration-700 cursor-pointer transform-gpu";
                 animY = [-8, 8, -8];
                 trans = { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2, layout: { duration: 0.6, ease: "circOut" } };
               }

               return (
                 <motion.img 
                   key={src}
                   layout
                   onClick={() => handleImageSwap(index)}
                   src={src} 
                   alt={`House Portrait ${index}`} 
                   className={className}
                   animate={{ y: animY }}
                   transition={trans}
                 />
               );
             })}
          </div>

          {/* Right: Interactive Booking Visual */}
          <div className="bg-ivory p-8 md:p-12 rounded-2xl shadow-2xl relative border border-sage/10 ml-0 lg:ml-8 order-1">
            <h3 className="font-serif text-2xl text-ink mb-10 text-center">As Easy As 1, 2, 3!</h3>
            
            {/* Connected Progress Tracker */}
            <div className="flex justify-between mb-12 relative px-2">
              {/* Background Track */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-sage/20 -translate-y-1/2 rounded-full"></div>
              
              {/* Animated Progress Fill */}
              <motion.div 
                className="absolute top-1/2 left-0 h-1 bg-olive -translate-y-1/2 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((step - 1) / 2) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />

              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setStep(num)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-serif text-lg transition-all duration-500 relative z-10 ${
                    step === num ? 'bg-olive text-white shadow-xl scale-110' : 
                    step > num ? 'bg-olive text-white shadow-md' : 'bg-cream text-sage hover:bg-sage/20 border-2 border-sage/10'
                  }`}
                >
                  {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                </button>
              ))}
            </div>

            <div className="h-80 relative flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="sync">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className="text-center absolute w-full"
                  >
                    <label className="cursor-pointer group flex flex-col items-center">
                      <div className="w-24 h-24 shrink-0 bg-cream rounded-full flex items-center justify-center mx-auto mb-6 border border-dashed border-olive/50 shadow-inner group-hover:bg-olive/10 group-hover:border-olive transition-all">
                        <Camera className="w-10 h-10 text-olive group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="font-serif text-xl text-ink mb-2 group-hover:text-olive transition-colors">1. Upload Your Photo</h4>
                      <p className="text-sm text-ink/70 font-sans px-4">
                        Please provide a clear, well-lit photo of your home. Kindly ensure the image is captured from the exact angle you wish to have painted.
                      </p>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  </motion.div>
                )}
                
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-sm absolute"
                  >
                    <h4 className="font-serif text-xl text-ink mb-6 text-center">2. Details</h4>
                    <div className="space-y-6 w-full px-2">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input type="text" placeholder="Your Name" className="w-full sm:w-1/2 bg-transparent border-b border-sage/40 py-2 font-sans text-ink placeholder-ink/40 focus:outline-none focus:border-olive transition-colors" />
                        <input type="tel" placeholder="Phone Number" className="w-full sm:w-1/2 bg-transparent border-b border-sage/40 py-2 font-sans text-ink placeholder-ink/40 focus:outline-none focus:border-olive transition-colors" />
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-left font-serif text-sm text-ink/80 mb-3">Select Canvas Size:</p>
                        <div className="grid grid-cols-3 gap-2 sm:gap-4">
                          {['8x10', '11x14', '16x20'].map(size => (
                            <label key={size} className="cursor-pointer">
                              <input type="radio" name="size" className="peer hidden" />
                              <div className="bg-cream border border-sage/30 rounded-md py-2 text-center text-sm font-sans text-ink peer-checked:bg-olive peer-checked:text-white peer-checked:border-olive hover:border-olive transition-all">
                                {size}"
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-sm absolute"
                  >
                    <h4 className="font-serif text-xl text-ink mb-4 text-center">3. Final Notes</h4>
                    <div className="space-y-4 px-2">
                      <textarea 
                        placeholder="Any additional details or requests? (e.g. Include the family dog on the porch, remove power lines...)" 
                        className="w-full bg-cream border border-sage/40 rounded-lg p-4 font-sans text-sm text-ink placeholder-ink/40 focus:outline-none focus:border-olive transition-all min-h-[100px] resize-none shadow-inner"
                      />
                      <div className="bg-sage/10 rounded-lg p-3 flex items-start text-left mt-2 border border-sage/20">
                        <CheckCircle2 className="w-5 h-5 text-olive mt-0 mr-2 flex-shrink-0" />
                        <p className="text-xs font-sans text-ink/80 leading-relaxed">
                          <span className="font-semibold block mb-0.5">Current turnaround time: around 2 weeks</span>
                          Once submitted, Jocelyn will review your details and reach out to confirm your commission.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 text-center relative z-20">
              <button className="bg-ink text-ivory px-8 py-4 rounded-sm font-serif uppercase tracking-widest text-sm hover:bg-olive hover:scale-[1.02] transition-all duration-300 w-full shadow-lg hover:shadow-xl">
                Submit Custom Commission
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
