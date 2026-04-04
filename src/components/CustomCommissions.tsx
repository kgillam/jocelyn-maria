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
                 className = "w-[80%] h-auto object-contain drop-shadow-2xl absolute z-20 hover:scale-105 transition-transform duration-500 cursor-pointer";
                 animY = [-15, 15, -15];
                 trans = { duration: 8, repeat: Infinity, ease: "easeInOut", layout: { duration: 0.6, ease: "circOut" } };
               } else if (isSec1) {
                 className = "w-[75%] h-auto object-contain drop-shadow-xl absolute top-4 md:top-8 left-0 md:-left-4 z-10 opacity-70 blur-[1px] group-hover:blur-none hover:!opacity-100 hover:!z-30 transition-all duration-700 cursor-pointer";
                 animY = [10, -10, 10];
                 trans = { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1, layout: { duration: 0.6, ease: "circOut" } };
               } else {
                 className = "w-[75%] h-auto object-contain drop-shadow-xl absolute bottom-4 md:bottom-8 right-0 md:-right-4 z-10 opacity-70 blur-[1px] group-hover:blur-none hover:!opacity-100 hover:!z-30 transition-all duration-700 cursor-pointer";
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

            <div className="h-64 relative flex items-center justify-center overflow-hidden">
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
                    <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mx-auto mb-6 border border-dashed border-olive/50 shadow-inner">
                      <Camera className="w-10 h-10 text-olive" />
                    </div>
                    <h4 className="font-serif text-xl text-ink mb-2">1. Upload Your Photo</h4>
                    <p className="text-sm text-ink/70 font-sans px-4">Share a clear, well-lit photo of the home you'd like painted. Front-facing angles work best.</p>
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
                    <div className="space-y-4">
                      <div className="bg-cream p-4 rounded-lg border border-sage/20 flex items-center justify-between cursor-pointer hover:border-olive hover:shadow-md transition-all">
                        <div className="flex items-center">
                          <Maximize className="w-5 h-5 text-olive mr-3" />
                          <span className="font-serif text-ink">Choose Canvas Size</span>
                        </div>
                        <span className="text-xs text-olive uppercase tracking-widest font-semibold">Select</span>
                      </div>
                      <div className="bg-cream p-4 rounded-lg border border-sage/20 flex items-center justify-between cursor-pointer hover:border-olive hover:shadow-md transition-all">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-olive mr-3" />
                          <span className="font-serif text-ink">Name & Phone Number</span>
                        </div>
                        <span className="text-xs text-olive uppercase tracking-widest font-semibold">Add</span>
                      </div>
                    </div>
                    <h4 className="font-serif text-xl text-ink mt-8 text-center">2. Size & Details</h4>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    className="text-center absolute w-full"
                  >
                    <div className="relative w-48 h-48 mx-auto mb-6">
                      <img src={images[0]} alt="Completed Portrait" className="w-full h-full object-contain drop-shadow-xl" />
                      <motion.div 
                        animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -bottom-2 -right-2 bg-white p-3 rounded-full shadow-lg"
                      >
                        <Palette className="w-6 h-6 text-blush" />
                      </motion.div>
                    </div>
                    <h4 className="font-serif text-xl text-ink mb-2">3. The Final Piece</h4>
                    <p className="text-sm text-ink/70 font-sans px-4">A hand-painted original watercolor, crafted with love and securely shipped to your door.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 text-center relative z-20">
              <button className="bg-ink text-ivory px-8 py-4 rounded-sm font-serif uppercase tracking-widest text-sm hover:bg-olive hover:scale-[1.02] transition-all duration-300 w-full shadow-lg hover:shadow-xl">
                Book Your Custom Commission
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
