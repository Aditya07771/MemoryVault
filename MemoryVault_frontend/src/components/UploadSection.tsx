import { motion } from "framer-motion";
import { CloudUpload, ArrowRight, Image, FileText, Award } from "lucide-react";

const steps = [
  { num: 1, label: "Upload" },
  { num: 2, label: "Add Details" },
  { num: 3, label: "Preserve Forever" },
];

const formats = [
  { icon: Image, label: "Photos" },
  { icon: FileText, label: "Documents" },
  { icon: Award, label: "Certificates" },
];

export function UploadSection() {
  return (
    <section id="upload" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background mesh effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-black/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="section-label">START TODAY</span>
          <h2 className="section-heading mt-4">
            Start Preserving Your Memories Today
          </h2>
          <p className="mt-4 text-lg text-black/60">
            Upload your first memory in seconds
          </p>
        </motion.div>

        {/* Upload Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-card p-8 rounded-3xl bg-white border border-black/5 shadow-xl">
            {/* Drop Zone */}
            <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-purple-500/50 transition-colors cursor-pointer group">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black mb-6 group-hover:scale-105 transition-transform shadow-xl"
              >
                <CloudUpload className="w-10 h-10 text-white" />
              </motion.div>

              <p className="text-xl font-medium text-black mb-2">
                Drag & drop your files here
              </p>
              <p className="text-black/60 mb-6">
                or click to browse • Photos, Documents, Certificates
              </p>

              {/* Format badges */}
              <div className="flex items-center justify-center gap-4">
                {formats.map((format) => (
                  <div
                    key={format.label}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 text-black/60 text-sm"
                  >
                    <format.icon className="w-4 h-4" />
                    {format.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="mt-8 flex items-center justify-center gap-4">
              {steps.map((step, i) => (
                <div key={step.num} className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black text-sm font-medium border border-black/10">
                      {step.num}
                    </div>
                    <span className="text-black/80">{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4 text-black/30" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-10 text-center"
          >
            <button className="btn-gradient group inline-flex items-center gap-2">
              Create Your Vault — It's Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
