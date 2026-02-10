import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-neutral-100 to-white" />
      <div className="absolute inset-0 bg-white/50" />

      {/* Animated Orbs */}
      <motion.div
        animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-1/4 w-64 h-64 bg-black/5 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ x: [20, -20, 20], y: [10, -10, 10] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-1/4 w-64 h-64 bg-black/5 rounded-full blur-[100px]"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-5 lg:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Ready to Preserve Your Life Story?
          </h2>
          <p className="mt-6 text-xl text-black/60">
            Join thousands who trust LifeVault with their precious memories
          </p>

          {/* Email Form */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-glass flex-1 text-center sm:text-left"
            />
            <button className="btn-gradient group flex items-center justify-center gap-2 whitespace-nowrap">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="mt-6 text-sm text-black/40">
            Free forever for personal use • No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
