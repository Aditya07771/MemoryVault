import { motion } from "framer-motion";
import { Check } from "lucide-react";
import TextAnimation from "@/components/ui/scroll-text";

const benefits = [
  "Own your memories forever",
  "Share with consent-based controls",
  "Protect your digital legacy",
  "Access from any device",
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-black/5 bg-white max-w-md mx-auto lg:max-w-full">
              <img
                src="/about-final.png"
                alt="About LifeVault Subscription"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />

              {/* Optional Decorative Elements overlaying the image if needed, keeping it clean for now as requested */}
            </div>

            {/* Background Decor */}
            <div className="absolute -inset-4 bg-black/5 -z-10 rounded-[2rem] -rotate-2 transform scale-95 opacity-50" />
            <div className="absolute -inset-4 bg-black/5 -z-10 rounded-[2rem] rotate-1 transform scale-95 opacity-50" />
          </motion.div>

          {/* Right - Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <span className="section-label text-xs font-bold tracking-widest text-black/40 uppercase">ABOUT LIFEVAULT</span>
            <TextAnimation
              as="h2"
              text="A New Way to Preserve What MattersMost"
              classname="section-heading mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight"
              letterAnime={true}
            />
            <p className="mt-6 text-base md:text-lg text-black/60 leading-relaxed max-w-lg">
              LifeVault is your personal digital sanctuary—a secure space where your most precious memories, documents, and life milestones live forever. Unlike traditional cloud storage, you maintain complete ownership and control over everything you store.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 transition-colors border border-transparent hover:border-black/5"
                >
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-sm shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-black/80">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
