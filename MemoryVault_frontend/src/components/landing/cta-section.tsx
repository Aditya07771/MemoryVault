import React from "react";
import { GlowButton } from "@/components/ui/glow-button";
import { Rocket, MessageCircle } from "lucide-react";

export const CTASection = () => {
    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Background glow for the section */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-vertex-blue/20 blur-[120px] -z-10" />

            <div className="max-w-5xl mx-auto">
                <div className="relative rounded-[2.5rem] overflow-hidden p-1">
                    {/* Animated gradient border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-vertex-cyan via-vertex-blue to-purple-600 animate-pulse-glow" />

                    <div className="relative bg-[#0F0F13] rounded-[2.4rem] px-6 py-20 md:py-24 text-center overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#2B59FF 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                                Ready to start your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-vertex-cyan to-white">
                                    DeFi Journey?
                                </span>
                            </h2>

                            <p className="max-w-2xl mx-auto text-lg text-vertex-gray mb-10">
                                Join thousands of users who have already switched to the most performant cross-chain liquidity protocol.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <GlowButton size="lg" className="min-w-[200px]">
                                    <Rocket className="w-5 h-5" /> Launch App
                                </GlowButton>
                                <GlowButton variant="secondary" size="lg" className="min-w-[200px]">
                                    <MessageCircle className="w-5 h-5" /> Join Community
                                </GlowButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
