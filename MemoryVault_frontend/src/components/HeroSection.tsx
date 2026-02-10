import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Shield, Lock, Sparkles, Key } from "lucide-react";
import { DotBackground } from "@/components/ui/grid-dot-background";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Rotating phrases for the hero
const rotatingPhrases = [
  "Memories",
  "Documents",
  "Milestones",
  "Stories",
  "Legacy",
  "Moments",
];

// Rotating taglines
const rotatingTaglines = [
  "Your story, your control.",
  "Secure your legacy today.",
  "Share with loved ones.",
  "Never lose what matters.",
  "Private by design.",
  "Your digital time capsule.",
  "Preserve every moment.",
  "Own your data forever.",
  "Future-proof your memories.",
  "Built for generations.",
];

// Animated word component with typewriter effect
const TypewriterWord = ({ words }: { words: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className="relative inline-flex min-w-[180px] md:min-w-[220px] justify-center lg:justify-start">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-block text-black"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

// Animated tagline component
const AnimatedTagline = ({ taglines }: { taglines: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % taglines.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  return (
    <div className="relative h-8 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center lg:justify-start text-black/60 font-medium"
        >
          {taglines[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

// Letter by letter animation component
const AnimatedLetters = ({ text, className }: { text: string; className?: string }) => {
  return (
    <motion.span className={className}>
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.03,
            ease: "easeOut",
          }}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

// Floating stats animation
const floatingStats = [
  { label: "Memories Secured", value: "2M+", delay: 0 },
  { label: "Happy Families", value: "50K+", delay: 0.2 },
  { label: "Uptime", value: "99.9%", delay: 0.4 },
];

const AnimatedCounter = ({ value, delay }: { value: string; delay: number }) => {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, delay * 1000 + 500);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <motion.span
      key={displayValue}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="text-2xl font-bold text-black"
    >
      {displayValue}
    </motion.span>
  );
};

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative pt-20 pb-12 lg:pt-28 lg:pb-20 overflow-hidden">
      <DotBackground
        dotSize={1}
        dotColor="#000"
        darkDotColor="#fff"
        spacing={24}
        showFade={true}
        fadeIntensity={40}
        className="absolute inset-0 h-full w-full"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-sm font-medium text-black/80 mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Lock className="w-3.5 h-3.5" />
              </motion.div>
              <AnimatedTagline taglines={["Secure • Private • Forever Yours", "Encrypted • Protected • Owned by You", "Safe • Personal • Your Legacy"]} />
            </motion.div>

            {/* Main Heading with Animated Word */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-tight">
                <AnimatedLetters text="Your " />
                <TypewriterWord words={rotatingPhrases} />
                <br />
                <span className="relative">
                  <AnimatedLetters text="Preserved " />
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="absolute bottom-2 left-0 h-3 bg-black/10 -z-10"
                  />
                </span>
                <AnimatedLetters text="Forever." />
              </h1>
            </motion.div>

            {/* Animated Tagline Rotator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-4 flex items-center justify-center lg:justify-start gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-black/40" />
              </motion.div>
              <AnimatedTagline taglines={rotatingTaglines} />
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-black/60 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Store memories, documents, and milestones in a personal vault that you truly own.
              Share with loved ones, protect your legacy, and never lose what matters most.
            </motion.p>

            {/* Animated Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex items-center justify-center lg:justify-start gap-6 mb-8"
            >
              {floatingStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + stat.delay }}
                  className="text-center"
                >
                  <AnimatedCounter value={stat.value} delay={stat.delay} />
                  <p className="text-xs text-black/40">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12 lg:mb-0"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-12 px-8 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Link to="/register"> Start Your Vault </Link>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-12 px-8 rounded-full bg-white border border-black/10 text-black text-sm font-medium hover:bg-black/5 transition-colors flex items-center gap-2"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Play className="w-4 h-4" />
                </motion.div>
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Trust Text Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="hidden lg:flex items-center gap-2 text-xs text-black/40"
            >
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1"
              >
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Trusted by 50,000+ families worldwide</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative"
          >
            {/* Animated glow behind image */}
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-black/5 via-black/10 to-black/5 rounded-3xl blur-2xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-black/10 bg-white">
              <img
                src="/hero-new.png?v=4"
                alt="LifeVault Dashboard Interface"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />

              {/* Animated overlay elements */}
              <motion.div
                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-black/5 shadow-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-xs font-medium text-black">Live Preview</span>
              </motion.div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-black/5"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center"
              >
                <Shield className="w-5 h-5 text-black" />
              </motion.div>
              <div>
                <p className="text-sm font-bold text-black bg-transparent">Bank-Grade Encryption</p>
                <motion.p
                  className="text-xs text-black/50"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Your data is yours alone
                </motion.p>
              </div>
            </motion.div>

            {/* New floating element - right side */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -top-4 -right-4 hidden md:flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-black/5"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center"
              >
                <Key className="w-4 h-4 text-black" />
              </motion.div>
              <div className="text-xs">
                <p className="font-medium text-black">256-bit AES</p>
                <p className="text-black/50">Encryption</p>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>

      {/* Animated bottom scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs text-black/30">Scroll to explore</span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-black/20 flex items-start justify-center p-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-black/40"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}