import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Zap, Shield, Globe, Layers, BarChart3, Lock } from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Execute trades with sub-second latency across multiple chains.",
        color: "text-yellow-400"
    },
    {
        icon: Globe,
        title: "Cross-Chain Native",
        description: "Seamlessly bridge assets without wrapping or complex hops.",
        color: "text-vertex-cyan"
    },
    {
        icon: Shield,
        title: "Bank-Grade Security",
        description: "Audited smart contracts with multi-sig treasury protection.",
        color: "text-vertex-blue"
    },
    {
        icon: Layers,
        title: "Deep Liquidity",
        description: "Access aggregated liquidity from top DEXs and market makers.",
        color: "text-purple-400"
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        description: "Real-time standard charting and portfolio tracking tools.",
        color: "text-green-400"
    },
    {
        icon: Lock,
        title: "Non-Custodial",
        description: "Maintain full control of your private keys and assets at all times.",
        color: "text-red-400"
    }
];

export const FeatureGrid = () => {
    return (
        <section className="relative py-24 px-4">
            {/* Background accents */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-vertex-blue/10 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Protocol's Key <span className="text-vertex-cyan">Components</span></h2>
                    <p className="text-vertex-gray max-w-2xl mx-auto">
                        Built for performance, security, and scalability. Experience the next generation of DeFi.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <GlassCard key={index} className="group hover:-translate-y-2 transition-transform duration-300">
                            <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                            <p className="text-vertex-gray text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
};
