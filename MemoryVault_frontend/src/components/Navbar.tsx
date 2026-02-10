import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Vault, Link } from "lucide-react";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#features", label: "Features" },
  { href: "#why", label: "Why LifeVault?" },
  { href: "#upload", label: "Upload" },
  { href: "#security", label: "Security" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 ${isScrolled ? "glass-navbar" : "bg-transparent"
          }`}
      >
        <div className="h-full max-w-7xl mx-auto px-5 lg:px-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
              <Vault className="w-5 h-5 text-white" />
            </div>
            
            <span className="text-2xl font-bold text-black tracking-tight">LifeVault</span>
           
          </a>
        

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="btn-outline-glow text-sm ">
              Connect Wallet
            </button>
            <a href="/login" className="nav-link">
              Login
            </a>
            <a href="/register" className="btn-gradient w-[50%] text-center !py-3">
              Get Started
            </a>
            {/* <button className="btn-gradient text-sm !px-6 !py-3">
              Sign Up
            </button> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-black"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[300px] bg-white border-l border-black/5 z-50 lg:hidden"
            >
              <div className="p-6">
                <button
                  className="absolute top-6 right-6 text-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="mt-16 flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-black/70 hover:text-black transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}

                  <div className="pt-6 border-t border-black/10 flex flex-col gap-4">
                    <button className="btn-outline-glow w-full">
                      Connect Wallet
                    </button>
                    <a href="/login" className="nav-link w-full text-center">
                      <button className="btn-gradient w-full !py-3">
                      Sign Up
                    </button>
                    </a>
                    
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
