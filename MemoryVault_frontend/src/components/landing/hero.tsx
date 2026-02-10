import React from "react";
import { BackgroundGlow } from "@/components/ui/background-glow";
import { GlowButton } from "@/components/ui/glow-button";
import { ArrowRight, ChevronRight, Play } from "lucide-react";

export const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-20">
            <BackgroundGlow variant="cyan" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 animate-fade-in">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vertex-cyan opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-vertex-cyan"></span>
                </span>
                <span className="text-xs font-medium text-vertex-gray uppercase tracking-wider">
                    V2.0 is Live
                </span>
            </div>

            {/* Main Heading with text glow handled by CSS class or standard shadow */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up" style={{ textShadow: "0 0 40px rgba(0, 242, 255, 0.3)" }}>
                Cross-chain <br />
                <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-vertex-cyan to-vertex-blue">
                    Liquidity Protocol
                </span>
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-vertex-gray mb-10 animate-slide-up [animation-delay:200ms]">
                Unlocking the true potential of DeFi with seamless cross-chain swaps and lightning-fast execution.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-20 animate-slide-up [animation-delay:400ms]">
                <GlowButton variant="primary" size="lg">
                    Launch App <ArrowRight className="ml-2 w-4 h-4" />
                </GlowButton>
                <GlowButton variant="outline" size="lg" className="group">
                    <Play className="mr-2 w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                    Watch Demo
                </GlowButton>
            </div>

            {/* Central Visual / Orb - Abstract Representation */}
            <div className="relative w-full max-w-4xl mx-auto h-[300px] md:h-[400px] mt-8 animate-float">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-vertex-cyan/10 rounded-full blur-[80px]" />

                {/* Abstract Geometric Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-vertex-cyan/30 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-vertex-blue/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                {/* Core Glowing Orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-vertex-cyan to-vertex-blue rounded-full shadow-[0_0_100px_rgba(0,242,255,0.6)] z-10 animate-pulse-glow" />
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>
    );
};
