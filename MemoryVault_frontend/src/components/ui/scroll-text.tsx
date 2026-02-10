"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type TextAnimationProps = {
    text: string;
    as?: React.ElementType;
    classname?: string;
    variants?: Variants;
    direction?: "left" | "right" | "up" | "down";
    letterAnime?: boolean;
    lineAnime?: boolean;
};

export default function TextAnimation({
    text,
    as: Component = "h2",
    classname,
    variants,
    direction = "up",
    letterAnime = false,
    lineAnime = false,
}: TextAnimationProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const defaultVariants = {
        hidden: {
            filter: "blur(10px)",
            opacity: 0,
            y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
            x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
        },
        visible: {
            filter: "blur(0px)",
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    };

    const selectedVariants = variants || defaultVariants;

    if (letterAnime) {
        return (
            <Component ref={ref} className={cn("inline-block", classname)}>
                {text.split("").map((letter, index) => (
                    <motion.span
                        key={index}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={{
                            ...selectedVariants,
                            visible: {
                                ...selectedVariants.visible,
                                transition: {
                                    ...selectedVariants.visible.transition,
                                    delay: index * 0.03,
                                },
                            },
                        }}
                        className="inline-block"
                    >
                        {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                ))}
            </Component>
        );
    }

    if (lineAnime) {
        // Simple line splitting by newline if present, or just treat as block
        const lines = text.split("\n");
        return (
            <Component ref={ref} className={cn(classname)}>
                {lines.map((line, index) => (
                    <motion.div
                        key={index}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={{
                            ...selectedVariants,
                            visible: {
                                ...selectedVariants.visible,
                                transition: {
                                    ...selectedVariants.visible.transition,
                                    delay: index * 0.1,
                                },
                            },
                        }}
                    >
                        {line}
                    </motion.div>
                ))}
            </Component>
        );
    }

    return (
        <Component
            ref={ref}
            className={cn(classname)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={selectedVariants}
        >
            {text}
        </Component>
    );
}
