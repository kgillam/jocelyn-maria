import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-cream pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 uppercase tracking-[0.1em] md:tracking-[0.15em] font-light">Privacy Policy</h1>
          <div className="w-16 h-px bg-olive mx-auto mb-6"></div>
          <p className="font-sans text-xs uppercase tracking-widest text-ink/50">Last updated: June 18, 2026</p>
        </div>

        <div className="space-y-10 font-sans text-ink/70 leading-relaxed text-sm md:text-base">
          <section>
            <p>
              This Privacy Policy describes how Jocelyn Maria ("we," "us," or "our") collects, uses, and protects your
              information when you visit or make a purchase through this website. By using the site, you agree to the
              practices described below.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Information We Collect</h2>
            <p>
              We may collect information you provide directly, such as your name, email address, shipping address, phone
              number, payment details, and any reference photos or notes you submit with an order or inquiry. We also
              automatically collect limited technical information, such as your browser type and pages visited, to help
              us improve the site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">How We Use Your Information</h2>
            <p>
              We use your information to process and fulfill orders, create custom commissioned artwork, respond to
              inquiries, provide customer support, and communicate updates about your purchase. We do not sell your
              personal information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Cookies</h2>
            <p>
              The site may use cookies and similar technologies to remember your preferences (such as the contents of
              your cart) and to understand how the site is used. You can disable cookies in your browser settings, though
              some features may not function properly as a result.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Third-Party Services</h2>
            <p>
              We may share information with trusted third parties who help us operate the site and fulfill orders, such
              as payment processors and shipping carriers. These providers may only use your information as necessary to
              perform their services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Data Security</h2>
            <p>
              We take reasonable measures to protect your personal information. However, no method of transmission over
              the internet is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Your Rights</h2>
            <p>
              You may request to access, correct, or delete the personal information we hold about you. To make a
              request, please reach out using the contact details below.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
              updated revision date.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink uppercase tracking-wider mb-3">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please reach out through our{' '}
              <Link to="/contact" className="text-olive underline hover:text-ink transition-colors">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
