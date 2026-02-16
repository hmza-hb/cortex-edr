"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
    "Your AI coded it. We audit it.",
    "The senior engineer your startup can't afford.",
    "Ship AI code. Not AI bugs.",
    "Eradicate vulnerabilities in real-time.",
    "Security is not a feature, it's a foundation."
];

export const MarketingScroller = ({ className }: { className?: string }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={`h-12 flex items-center justify-center overflow-hidden ${className}`}>
            <AnimatePresence mode="wait">
                <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-white font-mono text-xs tracking-[0.25em] uppercase text-center max-w-lg leading-loose drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] opacity-90 font-bold"
                >
                    {messages[index]}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};
