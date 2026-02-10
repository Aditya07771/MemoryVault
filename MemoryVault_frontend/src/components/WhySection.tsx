import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Lock, Share, Shield, Sparkles, Eye, Timer, RotateCcw, Database, Zap, Heart, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

const comparisons = [
  {
    problem: "Your memories are scattered across platforms you don't own",
    solution: "LifeVault brings everything into one personal vault you control",
    visual: "scattered",
  },
  {
    problem: "Platforms can shut down, delete, or lock your data",
    solution: "Your LifeVault is permanent and always accessible",
    visual: "locked",
  },
  {
    problem: "Sharing means losing control",
    solution: "Share with time limits, view tracking, and instant revoke",
    visual: "sharing",
  },
];

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-black/20"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: 0,
          }}
          animate={{
            y: [null, "-20%"],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

// Scattered visualization component
const ScatteredVisual = () => {
  const apps = [
    { name: "Photos", icon: "📷", x: 5, y: 15, delay: 0 },
    { name: "iCloud", icon: "☁️", x: 70, y: 5, delay: 0.2 },
    { name: "Drive", icon: "📁", x: 15, y: 55, delay: 0.4 },
    { name: "Dropbox", icon: "📦", x: 65, y: 60, delay: 0.6 },
    { name: "OneDrive", icon: "💾", x: 40, y: 30, delay: 0.8 },
  ];

  return (
    <div className="relative w-full h-full min-h-[300px]">
      {/* Chaos lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <motion.path
          d="M50,50 Q150,20 250,80 T450,50"
          stroke="black"
          strokeWidth="2"
          fill="none"
          strokeDasharray="10 5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>

      {/* Scattered app icons */}
      {apps.map((app, i) => (
        <motion.div
          key={app.name}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -8, 0, 5, 0],
            rotate: [0, -5, 5, -3, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: app.delay },
            scale: { duration: 0.5, delay: app.delay },
            y: { duration: 4, repeat: Infinity, delay: app.delay },
            rotate: { duration: 5, repeat: Infinity, delay: app.delay },
          }}
          className="absolute"
          style={{ left: `${app.x}%`, top: `${app.y}%` }}
        >
          <div className="w-16 h-16 rounded-2xl bg-black/5 border border-black/10 shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform backdrop-blur-sm">
            <span className="text-2xl">{app.icon}</span>
          </div>
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="text-white text-[8px] font-bold">!</span>
          </motion.div>
        </motion.div>
      ))}

      {/* Central chaos icon */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="relative">
          <motion.div
            className="w-20 h-20 rounded-full bg-black/5 backdrop-blur-sm flex items-center justify-center border border-black/10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <XCircle className="w-10 h-10 text-black/40" />
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-dashed border-black/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>

      {/* Broken connection lines */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-0.5 bg-gradient-to-r from-black/20 to-transparent"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            rotate: `${Math.random() * 360}deg`,
          }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </div>
  );
};

// Locked vault visualization
const LockedVisual = () => {
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLocked(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
      {/* Background glow */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-black/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Shield layers */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-black/10"
          style={{
            width: `${180 + i * 40}px`,
            height: `${180 + i * 40}px`,
          }}
          animate={{
            rotate: i % 2 === 0 ? 360 : -360,
            scale: [1, 1.02, 1],
          }}
          transition={{
            rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, delay: i * 0.3 },
          }}
        />
      ))}

      {/* Main vault */}
      <motion.div
        className="relative z-10"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {/* Vault body */}
        <div className="relative">
          <motion.div
            className="w-36 h-44 rounded-3xl bg-white border-2 border-black/10 shadow-2xl flex flex-col items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            {/* Vault door shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-black/5 to-transparent"
              animate={{ x: [-100, 200] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />

            {/* Lock mechanism */}
            <motion.div
              animate={{
                rotateY: isLocked ? 0 : 180,
              }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-lg">
                <motion.div
                  animate={{ rotate: isLocked ? 0 : 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <Lock className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              {/* Lock ring */}
              <motion.div
                className="absolute -inset-2 rounded-full border-4 border-black/20"
                animate={{
                  scale: isLocked ? [1, 1.1, 1] : 1,
                  borderColor: isLocked ? ["rgba(0,0,0,0.2)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.2)"] : "rgba(0,0,0,0.3)",
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Status indicator */}
            <motion.div
              className={`mt-4 px-3 py-1 rounded-full text-xs font-medium ${isLocked ? "bg-black/10 text-black" : "bg-black text-white"
                }`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {isLocked ? "🔒 Secured" : "✓ Access Granted"}
            </motion.div>
          </motion.div>

          {/* Vault base shadow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 h-4 bg-black/10 rounded-full blur-sm" />
        </div>

        {/* Floating security badges */}
        {[
          { icon: Shield, label: "Protected", x: -70, y: -30 },
          { icon: Database, label: "Permanent", x: 70, y: 0 },
          { icon: Zap, label: "Always On", x: -60, y: 50 },
        ].map((badge, i) => (
          <motion.div
            key={badge.label}
            className="absolute"
            style={{ left: badge.x, top: badge.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -3, 0],
            }}
            transition={{
              opacity: { delay: 0.5 + i * 0.2 },
              scale: { delay: 0.5 + i * 0.2 },
              y: { duration: 2, repeat: Infinity, delay: i * 0.3 },
            }}
          >
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-black/10 shadow-sm">
              <badge.icon className="w-3 h-3 text-black" />
              <span className="text-[10px] text-black/70 font-medium">{badge.label}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Orbiting particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-black/30"
          style={{
            left: "50%",
            top: "50%",
          }}
          animate={{
            x: [
              Math.cos((i / 8) * Math.PI * 2) * 100,
              Math.cos((i / 8) * Math.PI * 2 + Math.PI) * 100,
              Math.cos((i / 8) * Math.PI * 2) * 100,
            ],
            y: [
              Math.sin((i / 8) * Math.PI * 2) * 80,
              Math.sin((i / 8) * Math.PI * 2 + Math.PI) * 80,
              Math.sin((i / 8) * Math.PI * 2) * 80,
            ],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
};

// Sharing visualization
const SharingVisual = () => {
  const [shareStep, setShareStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShareStep(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const recipients = [
    { name: "Mom", emoji: "👩", delay: 0 },
    { name: "Friend", emoji: "👨", delay: 0.2 },
    { name: "Partner", emoji: "💕", delay: 0.4 },
  ];

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
      {/* Background effect */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-black/5 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="relative flex items-center gap-8">
        {/* You (sender) */}
        <motion.div
          className="relative z-10"
          animate={{ scale: shareStep === 0 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center shadow-xl">
            <span className="text-3xl">👤</span>
          </div>
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-0.5 rounded-full"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            You
          </motion.div>

          {/* Control panel */}
          <motion.div
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg p-2 border border-black/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex gap-2">
              <motion.div
                className={`p-1.5 rounded-lg transition-colors ${shareStep >= 1 ? "bg-black text-white" : "bg-black/5 text-black"}`}
                animate={{ scale: shareStep === 1 ? [1, 1.2, 1] : 1 }}
              >
                <Timer className="w-4 h-4" />
              </motion.div>
              <motion.div
                className={`p-1.5 rounded-lg transition-colors ${shareStep >= 2 ? "bg-black text-white" : "bg-black/5 text-black"}`}
                animate={{ scale: shareStep === 2 ? [1, 1.2, 1] : 1 }}
              >
                <Eye className="w-4 h-4" />
              </motion.div>
              <motion.div
                className={`p-1.5 rounded-lg transition-colors ${shareStep >= 3 ? "bg-black text-white" : "bg-black/5 text-black"}`}
                animate={{ scale: shareStep === 3 ? [1, 1.2, 1] : 1 }}
              >
                <RotateCcw className="w-4 h-4" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Connection line with animated dots */}
        <div className="relative w-32 h-1">
          <div className="absolute inset-0 bg-black/20 rounded-full" />

          {/* Animated sharing dots */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black"
              animate={{
                x: [0, 128],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}

          {/* Share icon in middle */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-black/10 shadow-lg flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Share className="w-4 h-4 text-black" />
          </motion.div>
        </div>

        {/* Recipients */}
        <div className="relative">
          {recipients.map((recipient, i) => (
            <motion.div
              key={recipient.name}
              className="absolute"
              style={{
                left: i === 1 ? 30 : 0,
                top: (i - 1) * 50,
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: shareStep > 0 ? [1, 1.05, 1] : 1,
              }}
              transition={{
                opacity: { delay: 0.5 + i * 0.2 },
                x: { delay: 0.5 + i * 0.2 },
                scale: { duration: 2, repeat: Infinity, delay: i * 0.3 },
              }}
            >
              <div className="w-14 h-14 rounded-full bg-black/5 border border-black/10 flex items-center justify-center shadow-lg">
                <span className="text-xl">{recipient.emoji}</span>
              </div>

              {/* View indicator */}
              {shareStep >= 2 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Eye className="w-3 h-3 text-white" />
                </motion.div>
              )}

              {/* Time limit badge */}
              {shareStep >= 1 && (
                <motion.div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-1.5 py-0.5 rounded-full whitespace-nowrap"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  24h left
                </motion.div>
              )}
            </motion.div>
          ))}

          {/* Revoke effect */}
          {shareStep === 3 && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1 }}
            >
              <div className="absolute inset-0 bg-black/10 rounded-full blur-xl" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Status message */}
      <motion.div
        key={shareStep}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-black/10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 text-sm">
          {shareStep === 0 && (
            <>
              <Share className="w-4 h-4 text-black" />
              <span className="text-black">Ready to share</span>
            </>
          )}
          {shareStep === 1 && (
            <>
              <Timer className="w-4 h-4 text-black" />
              <span className="text-black">Time limit set: 24 hours</span>
            </>
          )}
          {shareStep === 2 && (
            <>
              <Eye className="w-4 h-4 text-black" />
              <span className="text-black">3 views tracked</span>
            </>
          )}
          {shareStep === 3 && (
            <>
              <RotateCcw className="w-4 h-4 text-black" />
              <span className="text-black">Access revoked instantly</span>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export function WhySection() {
  return (
    <section id="why" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-black/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          {/* Animated badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-black/5 px-4 py-2 rounded-full mb-6 border border-black/5"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-black" />
            </motion.div>
            <span className="text-sm font-semibold text-black tracking-wide">
              WHY LIFEVAULT?
            </span>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-black" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-black"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Why Choose LifeVault
            <br />
            <span className="text-black/70">
              Over Other Platforms?
            </span>
          </motion.h2>

          <motion.p
            className="text-lg text-black/60 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Your digital memories deserve better than scattered cloud storage and platforms that come and go
          </motion.p>

          {/* Animated scroll indicator */}
          <motion.div
            className="mt-8"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-5 h-5 text-black/30 mx-auto" />
          </motion.div>
        </motion.div>

        {/* Comparison Cards */}
        <div className="space-y-24">
          {comparisons.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
            >
              {/* Visual Side */}
              <motion.div
                className={`${i % 2 === 1 ? "lg:order-2" : ""} relative`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Card glow effect */}
                <motion.div
                  className="absolute -inset-1 bg-black/5 rounded-3xl blur-xl"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Main card */}
                <div className="relative bg-white rounded-3xl border border-black/10 shadow-xl overflow-hidden">
                  {/* Card header line */}
                  <div className="h-1 bg-gradient-to-r from-black/20 via-black/40 to-black/20" />

                  {/* Visual content */}
                  <div className="p-8 min-h-[350px]">
                    <FloatingParticles />

                    {item.visual === "scattered" && <ScatteredVisual />}
                    {item.visual === "locked" && <LockedVisual />}
                    {item.visual === "sharing" && <SharingVisual />}
                  </div>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-black/20 rounded-tl-lg" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-black/20 rounded-tr-lg" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-black/20 rounded-bl-lg" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-black/20 rounded-br-lg" />
              </motion.div>

              {/* Text Side */}
              <div className={`${i % 2 === 1 ? "lg:order-1" : ""} space-y-8`}>
                {/* Number indicator */}
                <motion.div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black text-white text-xl font-bold"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  {i + 1}
                </motion.div>

                {/* Problem */}
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="absolute -inset-4 bg-black/[0.02] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-start gap-4">
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                    >
                      <XCircle className="w-6 h-6 text-black/50" />
                    </motion.div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-1 block">
                        The Problem
                      </span>
                      <p className="text-lg lg:text-xl text-black/60 leading-relaxed">
                        {item.problem}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Animated connector */}
                <motion.div
                  className="flex justify-start ml-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="w-0.5 h-8 bg-gradient-to-b from-black/20 to-black/40"
                      animate={{ scaleY: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-8 h-8 rounded-full bg-black/5 border border-black/10 flex items-center justify-center"
                      animate={{ y: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowDown className="w-4 h-4 text-black/40" />
                    </motion.div>
                    <motion.div
                      className="w-0.5 h-8 bg-gradient-to-b from-black/40 to-black"
                      animate={{ scaleY: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    />
                  </div>
                </motion.div>

                {/* Solution */}
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-black/[0.02]"
                  />
                  <div className="relative flex items-start gap-4">
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-black mb-1 block">
                        LifeVault Solution
                      </span>
                      <p className="text-lg lg:text-xl text-black font-medium leading-relaxed">
                        {item.solution}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Feature pills */}
                <motion.div
                  className="flex flex-wrap gap-2 pt-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                >
                  {(i === 0
                    ? ["All in One Place", "Your Control", "Private"]
                    : i === 1
                      ? ["Always Available", "Encrypted", "Backup Protected"]
                      : ["Time Limits", "View Tracking", "Instant Revoke"]
                  ).map((feature, j) => (
                    <motion.span
                      key={feature}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-black/5 text-black border border-black/5 hover:bg-black hover:text-white transition-colors cursor-default"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + j * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {feature}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-32 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Decorative line */}
          <motion.div
            className="w-24 h-0.5 bg-black/20 mx-auto mb-12"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          />

          <motion.p
            className="text-black/60 mb-8 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Ready to take control of your digital memories?
          </motion.p>

          <motion.button
            className="group inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full shadow-xl cursor-pointer border-2 border-black hover:bg-white hover:text-black transition-colors"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Heart className="w-5 h-5" />
            <span className="font-semibold text-lg">Start Protecting Your Memories</span>
            <motion.span
              className="inline-block"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>

          {/* Trust indicators */}
          <motion.div
            className="mt-8 flex items-center justify-center gap-6 text-sm text-black/40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Secure
            </span>
            <span className="w-1 h-1 rounded-full bg-black/20" />
            <span className="flex items-center gap-1">
              <Lock className="w-4 h-4" />
              Private
            </span>
            <span className="w-1 h-1 rounded-full bg-black/20" />
            <span className="flex items-center gap-1">
              <Database className="w-4 h-4" />
              Permanent
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}