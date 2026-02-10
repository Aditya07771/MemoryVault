import React from "react";

interface BackgroundGlowProps {
    className?: string;
    variant?: "cyan" | "blue" | "purple";
}

export const BackgroundGlow: React.FC<BackgroundGlowProps> = ({
    className = "",
    variant = "cyan"
}) => {
    const colors = {
        cyan: "bg-vertex-cyan/20",
        blue: "bg-vertex-blue/20",
        purple: "bg-purple-500/20",
    };

    return (
        <div
            className={`fixed inset-0 overflow-hidden pointer-events-none -z-50 ${className}`}
            aria-hidden="true"
        >
            <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] ${colors[variant === "purple" ? "cyan" : variant]} rounded-full blur-[120px] opacity-40 animate-pulse-glow`} />
            <div className={`absolute bottom-0 right-1/4 w-[600px] h-[600px] ${colors[variant === "cyan" ? "blue" : "cyan"]} rounded-full blur-[150px] opacity-30 animate-pulse-glow delay-1000`} />
        </div>
    );
};
