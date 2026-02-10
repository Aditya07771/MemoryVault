import React from "react";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
    ({ className, children, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-vertex-cyan text-black hover:bg-vertex-cyan/90 border-transparent shadow-[0_0_20px_rgba(0,242,255,0.5)] hover:shadow-[0_0_30px_rgba(0,242,255,0.7)]",
            secondary: "bg-vertex-blue text-white hover:bg-vertex-blue/90 border-transparent shadow-[0_0_20px_rgba(43,89,255,0.5)]",
            outline: "bg-transparent border-vertex-cyan text-vertex-cyan hover:bg-vertex-cyan/10 shadow-[0_0_10px_rgba(0,242,255,0.2)]",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "relative rounded-full font-bold transition-all duration-300 border flex items-center justify-center gap-2 active:scale-95",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

GlowButton.displayName = "GlowButton";
