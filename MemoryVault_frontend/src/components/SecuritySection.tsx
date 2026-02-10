import { motion } from "framer-motion";
import { Lock, EyeOff, Database, Key, Shield, CheckCircle2 } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "256-bit AES encryption protects every file",
  },
  {
    icon: EyeOff,
    title: "Zero-Knowledge Architecture",
    description: "We can't see your data — only you can",
  },
  {
    icon: Database,
    title: "Decentralized Storage",
    description: "Your files are distributed securely across the network",
  },
  {
    icon: Key,
    title: "Secure Recovery",
    description: "Multiple recovery options you control",
  },
];

const trustBadges = [
  "GDPR Compliant",
  "SOC 2 Certified",
  "256-bit Encrypted",
];

export function SecuritySection() {
  return (
    <section id="security" className="relative py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">SECURITY</span>
            <h2 className="section-heading mt-4">
              Bank-Grade Security for Your Most Precious Data
            </h2>

            {/* Security Features Grid */}
            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              {securityFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card-hover p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-black/60 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap gap-4">
              {trustBadges.map((badge) => (
                <div
                  key={badge}
                  className="px-4 py-2 rounded-lg bg-black/5 border border-black/10 text-sm text-black/70"
                >
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex items-center justify-center"
          >
            <div className="relative">
              {/* Central Shield */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-48 h-56 glass-card rounded-3xl flex flex-col items-center justify-center gap-4 bg-white border border-black/5 shadow-xl"
              >
                <Shield className="w-20 h-20 text-black" />
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span className="text-black font-medium">Protected</span>
                </div>
              </motion.div>

              {/* Orbiting Checkmarks */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 5,
                  }}
                  className="absolute inset-0"
                  style={{ transformOrigin: "center" }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center"
                    style={{
                      top: `${-20 + i * 5}px`,
                      left: `50%`,
                      transform: `translateX(-50%)`,
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-black" />
                  </motion.div>
                </motion.div>
              ))}

              {/* Glow effect */}
              <div className="absolute inset-0 -z-10 blur-[80px] bg-black/5 rounded-full scale-150" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
