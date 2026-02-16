import React from "react";
import { cn } from "@/lib/utils";

export const MagicButton = ({
    title,
    icon,
    position,
    handleClick,
    otherClasses,
}: {
    title: string;
    icon?: React.ReactNode;
    position?: string;
    handleClick?: () => void;
    otherClasses?: string;
}) => {
    return (
        <button
            onClick={handleClick}
            className="group/btn relative inline-flex h-12 w-full md:w-64 overflow-hidden rounded-lg p-[1px] focus:outline-none transition-all duration-300 active:scale-95"
        >
            {/* Precision Technical Border */}
            <span className="absolute inset-0 bg-slate-800 transition-colors duration-300 group-hover/btn:bg-purple-500/50" />

            <span
                className={cn(
                    "inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[7px] bg-black px-8 text-[11px] font-mono tracking-[0.2em] text-neutral-400 backdrop-blur-3xl gap-3 transition-all relative z-10 overflow-hidden",
                    "group-hover/btn:text-white border border-white/5",
                    otherClasses
                )}
            >
                {/* Rolling Binary Background Effect */}
                <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-10 transition-opacity duration-500 pointer-events-none select-none">
                    <div className="absolute inset-0 flex flex-wrap gap-1 p-2 text-[8px] leading-none animate-[slide-up_20s_linear_infinite]">
                        {Array.from({ length: 200 }).map((_, i) => (
                            <span key={i}>{i % 2 === 0 ? "0" : "1"}</span>
                        ))}
                    </div>
                </span>

                {/* Technical Corner Brackets */}
                <span className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/10 group-hover/btn:border-purple-500/50 transition-colors" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/10 group-hover/btn:border-purple-500/50 transition-colors" />
                <span className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/10 group-hover/btn:border-purple-500/50 transition-colors" />
                <span className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/10 group-hover/btn:border-purple-500/50 transition-colors" />

                {/* Content */}
                {position === "left" && <span className="text-neutral-500 group-hover/btn:text-purple-400 transition-colors">{icon}</span>}
                <span className="relative z-20">
                    {title}
                </span>
                {position === "right" && <span className="text-neutral-500 group-hover/btn:text-purple-400 transition-colors">{icon}</span>}

                {/* Precise Scanning Line */}
                <span className="absolute inset-x-0 top-0 h-px bg-purple-500/0 group-hover/btn:bg-purple-500/50 group-hover/btn:animate-[scan-vertical_2s_linear_infinite] shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            </span>
        </button>
    );
};
