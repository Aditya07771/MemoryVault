import { useRef, useState, FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import { Vault, ArrowRight, Twitter, Linkedin, Facebook, Instagram, Github } from "lucide-react";

// Adapted links for LifeVault
const sitemapLinks = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Security', href: '#security' },
  { label: 'Upload', href: '#upload' },
  { label: 'Why LifeVault?', href: '#why' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { name: "LinkedIn", href: "#", icon: <Linkedin className="w-5 h-5" /> },
  { name: "Twitter", href: "#", icon: <Twitter className="w-5 h-5" /> },
  { name: "Instagram", href: "#", icon: <Instagram className="w-5 h-5" /> },
  { name: "Facebook", href: "#", icon: <Facebook className="w-5 h-5" /> },
  { name: "GitHub", href: "#", icon: <Github className="w-5 h-5" /> },
];

export function Footer() {
  const container = useRef<HTMLDivElement>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
    // Add toast or notification logic here if needed
  };

  const variants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
        duration: 0.8,
      },
    },
    hidden: { y: 100, opacity: 0 },
  };

  return (
    <footer className="relative bg-[#FAFAFA] text-black pt-20 overflow-hidden" ref={container}>
      <div className="max-w-7xl mx-auto px-5 lg:px-20">
        <div className="md:flex justify-between w-full gap-12 lg:gap-24 mb-20">

          {/* Left Column - CTA & Newsletter */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
              Let's preserve your legacy together.
            </h1>

            <div className="pt-2 pb-6">
              <p className="text-xl md:text-2xl mb-6 font-medium text-black/60">
                Sign up for our newsletter to get updates on new features.
              </p>

              <div className="relative group max-w-md">
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="relative flex items-center bg-white border-2 border-black rounded-full p-2 pr-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 border-none bg-transparent px-6 py-3 text-lg outline-none placeholder:text-black/30"
                    placeholder="Your email address"
                    required
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full hover:bg-neutral-800 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Links */}
          <div className="flex flex-col sm:flex-row gap-12 sm:gap-24 mt-12 md:mt-0">
            {/* Sitemap */}
            <ul>
              <li className="text-lg font-bold mb-6 tracking-wider">SITEMAP</li>
              {sitemapLinks.map((link) => (
                <li key={link.label} className="mb-3">
                  <a
                    href={link.href}
                    className="text-lg font-medium text-black/60 hover:text-black transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Socials */}
            <ul>
              <li className="text-lg font-bold mb-6 tracking-wider">SOCIAL</li>
              {socialLinks.map((link) => (
                <li key={link.name} className="mb-3">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium text-black/60 hover:text-black transition-colors flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Big Footer Logo/Text */}
        <div className="border-t-2 border-black/5 pt-12 pb-8 overflow-hidden">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            className="flex items-center justify-center w-full"
          >
            <h1 className="text-[12vw] leading-none font-bold text-[#E5E5E5] tracking-tighter cursor-default select-none hover:text-black/10 transition-colors duration-700">
              LIFEVAULT
            </h1>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="flex md:flex-row flex-col-reverse gap-4 justify-between items-center py-8 border-t border-black/5">
          <span className="font-medium text-black/40">
            &copy; {new Date().getFullYear()} LifeVault. All Rights Reserved.
          </span>
          <div className="flex gap-8">
            <a href="#" className="font-semibold text-black/60 hover:text-black transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="font-semibold text-black/60 hover:text-black transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
