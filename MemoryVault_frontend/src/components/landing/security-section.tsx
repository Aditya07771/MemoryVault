import React from "react";
import { ShieldCheck, Server, Key, Eye } from "lucide-react";

const securityFeatures = [
    {
        icon: ShieldCheck,
        title: "Smart Contract Audits",
        description: "Verified by top-tier security firms."
    },
    {
        icon: Server,
        title: "Secure Infrastructure",
        description: "Distributed nodes with 99.99% uptime."
    },
    {
        icon: Key,
        title: "Multi-Sig Treasury",
        description: "Assets protected by 5/7 key requirements."
    },
    {
        icon: Eye,
        title: "24/7 Monitoring",
        description: "Real-time threat detection systems."
    }
];

export const SecuritySection = () => {
    return (
        <section className="py-24 bg-black/40 relative border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Security <br />
                            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-vertex-cyan to-vertex-blue">
                                Advantage
                            </span>
                        </h2>
                        <p className="text-vertex-gray text-lg mb-8">
                            We prioritize the safety of your funds above all else. Our protocol is built with multiple layers of security to ensure peace of mind.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {securityFeatures.map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="mt-1 p-2 rounded-lg bg-vertex-cyan/10 border border-vertex-cyan/20">
                                        <item.icon className="w-5 h-5 text-vertex-cyan" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                        <p className="text-sm text-zinc-500">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        {/* Abstract visual for security */}
                        <div className="relative aspect-square max-w-md mx-auto">
                            <div className="absolute inset-0 bg-vertex-blue/5 rounded-3xl border border-vertex-blue/10 rotate-3 transform transition-transform hover:rotate-6 duration-700" />
                            <div className="absolute inset-0 bg-background rounded-3xl border border-white/10 flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform duration-700 p-8 shadow-2xl">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-vertex-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                                        <ShieldCheck className="w-12 h-12 text-vertex-cyan" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-2 w-32 bg-white/10 rounded-full mx-auto" />
                                        <div className="h-2 w-48 bg-white/10 rounded-full mx-auto" />
                                        <div className="h-2 w-40 bg-white/10 rounded-full mx-auto" />
                                    </div>
                                    <div className="mt-8 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full inline-flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-xs font-bold text-green-500 uppercase tracking-widest">System Secure</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
