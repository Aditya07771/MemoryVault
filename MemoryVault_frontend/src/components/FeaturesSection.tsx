import { motion } from "framer-motion";
import {
  Calendar,
  CloudUpload,
  Share2,
  ShieldCheck,
  Users,
  Heart
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Visual Life Timeline",
    description: "See your memories organized beautifully by year and life chapters",
  },
  {
    icon: CloudUpload,
    title: "Simple Memory Upload",
    description: "Drag, drop, and preserve. Add photos, documents, certificates in seconds",
  },
  {
    icon: Share2,
    title: "Consent-Based Sharing",
    description: "Share with loved ones with full control over access and duration",
  },
  {
    icon: ShieldCheck,
    title: "Complete Privacy",
    description: "Your data stays yours. Toggle privacy settings with one tap",
  },
  {
    icon: Users,
    title: "Social Recovery",
    description: "Designate trusted people to help recover access if needed",
  },
  {
    icon: Heart,
    title: "Digital Legacy",
    description: "Plan what happens to your memories for future generations",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-white">
      {/* Background Orb */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="orb orb-purple w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="section-label">FEATURES</span>
          <h2 className="section-heading mt-4">
            Everything You Need to Preserve Your Life Story
          </h2>
          <p className="mt-4 text-lg text-black/60">
            Powerful tools designed with simplicity and security in mind
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-8 group border border-black/5 bg-white shadow-sm hover:shadow-lg hover:border-black/10"
            >
              <div className="feature-icon mb-6 bg-black/5">
                <feature.icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">
                {feature.title}
              </h3>
              <p className="text-black/60 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
