import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "50K+", label: "Memories Stored" },
  { value: "100%", label: "User Ownership" },
  { value: "256-bit", label: "Encryption" },
];

export function StatsSection() {
  return (
    <section className="relative py-16 bg-black text-white border-y border-white/10">
      <div className="max-w-7xl mx-auto px-5 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center relative"
            >
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
              </p>
              <p className="text-white/50">{stat.label}</p>

              {i < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-white/10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
