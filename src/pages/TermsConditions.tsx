import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsConditions() {
  return (
    <main className="min-h-screen bg-cream pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 uppercase tracking-[0.1em] md:tracking-[0.15em] font-light">Terms &amp; Conditions</h1>
          <div className="w-16 h-px bg-olive mx-auto mb-6"></div>
          <p className="font-sans text-xs uppercase tracking-widest text-ink/50">Last updated: June 18, 2026</p>
        </div>

        <div className="space-y-10 font-sans text-ink/70 leading-relaxed text-sm md:text-base">
          <section>
            <p>
              Welcome to JocelynMaria. By accessing or using this website and placing an order, you agree to these
              Terms &amp; Conditions. Please read them carefully before making a purchase.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Use of the Site</h2>
            <p>
              You agree to use this site only for lawful purposes and not to misuse it in any way that could damage,
              disable, or impair the site or interfere with another party's use of it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Products &amp; Orders</h2>
            <p>
              We strive to display our artwork and products as accurately as possible. Because each piece is hand-made,
              slight variations in color, texture, and detail are natural and to be expected. We reserve the right to
              refuse or cancel any order at our discretion.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Pricing &amp; Payment</h2>
            <p>
              All prices are listed in U.S. dollars and are subject to change without notice. Payment must be received in
              full before an order is processed or a commission is begun.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Custom Commissions</h2>
            <p>
              Custom pieces are created based on the reference photos and details you provide. Please allow the stated
              turnaround time before shipping. Because commissions are personalized and made to order, they are generally
              non-refundable once work has begun.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Shipping &amp; Returns</h2>
            <p>
              We are not responsible for delays caused by shipping carriers. If your order arrives damaged, please
              contact us promptly with photos so we can make it right. Eligibility for returns or exchanges is handled on
              a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Intellectual Property</h2>
            <p>
              All artwork, images, and content on this site are the property of JocelynMaria and may not be reproduced,
              distributed, or used without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Limitation of Liability</h2>
            <p>
              This site and its contents are provided on an "as is" basis. To the fullest extent permitted by law, we are
              not liable for any damages arising from your use of the site or our products.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Changes to These Terms</h2>
            <p>
              We may update these Terms &amp; Conditions at any time. Continued use of the site after changes are posted
              constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Contact Us</h2>
            <p>
              If you have questions about these Terms &amp; Conditions, please reach out through our{' '}
              <Link to="/contact" className="text-olive underline hover:text-ink transition-colors">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
