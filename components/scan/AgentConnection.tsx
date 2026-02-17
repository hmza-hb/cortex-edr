import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AgentConnectionProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    active?: boolean;
    completed?: boolean;
}

export const AgentConnection: React.FC<AgentConnectionProps> = ({
    startX, startY, endX, endY, active, completed
}) => {
    // Cubic bezier path builder for a smooth curve
    // We calculate control points to create a "slight curve"
    const dx = endX - startX;
    const dy = endY - startY;

    // Control points calculation
    const cp1x = startX + dx * 0.5;
    const cp1y = startY;
    const cp2x = startX + dx * 0.5;
    const cp2y = endY;

    const path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;

    return (
        <g className="overflow-visible">
            <defs>
                <filter id="glow-electricity" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                <linearGradient id="trail-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>

            {/* Background base line - dark and barely visible */}
            <path
                d={path}
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Electricity Line (Lights up as dot passes) */}
            <motion.path
                d={path}
                fill="none"
                stroke={active ? "#3b82f6" : completed ? "#3b82f6" : "transparent"}
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                    pathLength: (active || completed) ? 1 : 0,
                    opacity: active ? 0.8 : completed ? 0.3 : 0
                }}
                transition={{
                    duration: active ? 0.8 : 0.4,
                    ease: active ? "easeInOut" : "linear"
                }}
                style={{ filter: active ? "url(#glow-electricity)" : "none" }}
            />

            {/* Traveling Electricity Dot and Trail */}
            {active && (
                <g>
                    {/* The Dot */}
                    <motion.circle
                        r="3"
                        fill="#3b82f6"
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        style={{
                            offsetPath: `path("${path}")`,
                            filter: "drop-shadow(0 0 8px #3b82f6) drop-shadow(0 0 12px #3b82f6)"
                        }}
                    />

                    {/* Fading Trail */}
                    <motion.path
                        d={path}
                        fill="none"
                        stroke="url(#trail-gradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="40 1000"
                        initial={{ strokeDashoffset: 40 }}
                        animate={{ strokeDashoffset: -1000 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="opacity-40"
                    />
                </g>
            )}
        </g>
    );
};
