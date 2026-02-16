"use client";
import React, { useRef, useEffect } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export const CyberGrid = ({
    children,
    className
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth movement
    const springConfig = { damping: 25, stiffness: 150 };
    const smMouseX = useSpring(mouseX, springConfig);
    const smMouseY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            ref={containerRef}
            className={cn("relative w-full overflow-hidden bg-black transition-all duration-500 pb-20", className)}
        >
            {/* Interactive North Glow - Boosted */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/0 to-transparent group-hover:via-purple-500/80 transition-all duration-700 z-30"></div>
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-500/0 to-transparent group-hover:from-purple-500/20 transition-all duration-700 z-10 pointer-events-none"></div>

            {/* Interactive South Glow - Boosted */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-500/80 transition-all duration-700 z-30"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/0 to-transparent group-hover:from-cyan-500/20 transition-all duration-700 z-10 pointer-events-none"></div>

            {/* Base Grid Pattern */}
            <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808026_1px,transparent_1px),linear-gradient(to_bottom,#80808026_1px,transparent_1px)] bg-[size:64px_64px]"></div>

            {/* Reactive Glow Layer (The "Beam" of Light) - Intensified Neon Purple */}
            <motion.div
                className="absolute inset-0 z-[1] h-full w-full bg-[linear-gradient(to_right,#a855f7_1px,transparent_1px),linear-gradient(to_bottom,#c084fc_1px,transparent_1px)] bg-[size:64px_64px]"
                style={{
                    WebkitMaskImage: useTransform(
                        [smMouseX, smMouseY],
                        ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, black 0%, transparent 80%)`
                    ),
                    maskImage: useTransform(
                        [smMouseX, smMouseY],
                        ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, black 0%, transparent 80%)`
                    ),
                }}
            />

            {/* Vignette / Radial Mask - Smoothed */}
            <div className="absolute inset-0 z-[2] h-full w-full bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black_85%)]"></div>

            {/* Bottom Face - Perspective Grid - Boosted */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[60vh] z-[3] opacity-30 [perspective:800px]"
                style={{
                    rotateX: useTransform(smMouseY, [0, 800], [55, 65]),
                }}
            >
                <div className="absolute inset-0 [transform-origin:bottom]">
                    <div className="h-full w-full bg-[linear-gradient(to_right,#8b5cf666_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf666_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:linear-gradient(to_top,black,transparent)]"></div>
                </div>
            </motion.div>

            <div className="relative z-[10] w-full">
                {children}
            </div>
        </motion.div>
    );
};
