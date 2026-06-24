import React, { useState, useRef } from 'react';
import { Camera, Mail, MapPin, Instagram, Link as LinkIcon, Send, Loader2, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      inquiryType: formData.get('inquiryType'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || result.error || 'Failed to send message.');
      }

      setStatus('success');
      formRef.current?.reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
      
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-ivory pt-32 pb-24 texture-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24 relative z-10">
          <h1 className="font-serif text-3xl md:text-5xl text-ink mb-6 uppercase tracking-[0.15em] font-light">Get in Touch</h1>
          <div className="w-16 h-px bg-olive mx-auto mb-8"></div>
          <p className="font-sans text-ink/70 text-sm md:text-base max-w-xl mx-auto">
            Whether you are inquiring about a highly specific custom commission, or just saying hello, we would love to hear from you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
          
          {/* Left Column: Contact Details */}
          <div className="w-full lg:w-5/12 flex flex-col justify-start space-y-12">
            <div>
              <h2 className="font-serif text-xl tracking-widest uppercase text-ink mb-6">Direct Inquiries</h2>
              <div className="space-y-4 font-sans text-ink/70">
                <div className="flex items-start space-x-3 group">
                  <Mail className="w-5 h-5 text-olive mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block text-sm uppercase tracking-wider mb-1 font-semibold">Email</span>
                    <a href="mailto:hello@jocelynmaria.com" className="hover:text-olive transition-colors">hello@jocelynmaria.com</a>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group pt-2">
                  <MapPin className="w-5 h-5 text-olive mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block text-sm uppercase tracking-wider mb-1 font-semibold">Studio Location</span>
                    <p>Central Louisiana, USA<br/>(Local pickup available exclusively upon request)</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-xl tracking-widest uppercase text-ink mb-6">Connect</h2>
              <div className="space-y-4 font-sans text-ink/70">
                <a href="#" className="flex items-center space-x-3 group w-fit">
                  <Instagram className="w-5 h-5 text-olive group-hover:scale-110 transition-transform" />
                  <span className="hover:text-olive transition-colors">@jocelynmaria.art</span>
                </a>
                <a href="#" className="flex items-center space-x-3 group w-fit">
                  <LinkIcon className="w-5 h-5 text-olive group-hover:scale-110 transition-transform" />
                  <span className="hover:text-olive transition-colors">Pinterest: Jocelyn Maria</span>
                </a>
              </div>
            </div>

            <div className="p-8 bg-cream border border-sage/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-olive/5 rounded-bl-full transform translate-x-10 -translate-y-10" />
              <h3 className="font-serif italic text-lg text-ink mb-3">Notice on Turnarounds</h3>
              <p className="font-sans text-sm text-ink/70 leading-relaxed">
                General inquiries are answered within 24-48 business hours. For custom watercolor portraits, please anticipate a standard 2-week turnaround time before shipping.
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Contact Form */}
          <div className="w-full lg:w-7/12">
            <form ref={formRef} className="bg-white/60 backdrop-blur-sm p-8 sm:p-10 shadow-sm border border-sage/20 space-y-8" onSubmit={handleSubmit}>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/2 space-y-2">
                  <label className="font-serif text-sm tracking-widest uppercase text-ink/80 block">First Name</label>
                  <input name="firstName" type="text" required className="w-full bg-transparent border-b border-sage/40 py-2 font-sans text-ink focus:outline-none focus:border-olive transition-colors" />
                </div>
                <div className="w-full sm:w-1/2 space-y-2">
                  <label className="font-serif text-sm tracking-widest uppercase text-ink/80 block">Last Name</label>
                  <input name="lastName" type="text" required className="w-full bg-transparent border-b border-sage/40 py-2 font-sans text-ink focus:outline-none focus:border-olive transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-serif text-sm tracking-widest uppercase text-ink/80 block">Email Address</label>
                <input name="email" type="email" required className="w-full bg-transparent border-b border-sage/40 py-2 font-sans text-ink focus:outline-none focus:border-olive transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="font-serif text-sm tracking-widest uppercase text-ink/80 block">Inquiry Type</label>
                <select name="inquiryType" className="w-full bg-transparent border-b border-sage/40 py-2 font-sans text-ink focus:outline-none focus:border-olive transition-colors cursor-pointer appearance-none rounded-none">
                  <option>Custom Commission Quote</option>
                  <option>Order Support</option>
                  <option>General Question</option>
                </select>
              </div>

              <div className="space-y-2 mt-4">
                <label className="font-serif text-sm tracking-widest uppercase text-ink/80 block mb-4">Attach Reference Photo (Optional)</label>
                <label 
                  onMouseEnter={() => setIsHoveringImage(true)}
                  onMouseLeave={() => setIsHoveringImage(false)}
                  className="cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed border-sage/40 hover:border-olive py-10 bg-cream hover:bg-olive/5 transition-all w-full text-center"
                >
                  <motion.div animate={{ scale: isHoveringImage ? 1.1 : 1 }} transition={{ duration: 0.2 }}>
                    <Camera className="w-8 h-8 text-olive mb-3 opacity-80" />
                  </motion.div>
                  <span className="font-sans text-sm text-ink/60 group-hover:text-ink/80 transition-colors">
                    Click to upload your home or portrait reference image
                  </span>
                  <input name="attachment" type="file" className="hidden" accept="image/*" />
                </label>
                <p className="text-xs text-ink/50 mt-2 font-sans">
                  * Note: File attachments are currently disabled for this form. Please email photos directly if needed.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-serif text-sm tracking-widest uppercase text-ink/80 block">Your Message</label>
                <textarea 
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-cream/50 border border-sage/40 p-4 font-sans text-sm text-ink focus:outline-none focus:border-olive transition-colors resize-y min-h-[120px]"
                  placeholder="Share the details of your project or your question..."
                />
              </div>

              {status === 'error' && (
                <div className="text-red-500 text-sm font-sans">
                  {errorMessage}
                </div>
              )}

              {status === 'success' && (
                <div className="text-olive bg-olive/10 p-4 flex items-center gap-3 text-sm font-sans border border-olive/20">
                  <Check className="w-5 h-5" />
                  Your message has been sent successfully. We will be in touch soon!
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-ink text-cream py-4 font-serif uppercase tracking-[0.2em] text-sm hover:bg-olive transition-colors flex items-center justify-center space-x-2 group mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Sending...</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    <span>Sent</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </main>
  );
}
