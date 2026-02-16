"use client";
import React, { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export const PixelFlipWords = ({
    words,
    duration = 3000,
    className,
}: {
    words: string[];
    duration?: number;
    className?: string;
}) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayWord, setDisplayWord] = useState(words[0]);
    const [isAnimating, setIsAnimating] = useState(false);

    const binaryChars = useMemo(() => ["0", "1"], []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isAnimating) return;

            const nextIndex = (currentWordIndex + 1) % words.length;
            const nextWord = words[nextIndex];
            setIsAnimating(true);

            // Scramble animation
            let iteration = 0;
            const scrambleInterval = setInterval(() => {
                setDisplayWord(prev =>
                    prev.split("").map((char, index) => {
                        if (index < iteration) {
                            return nextWord[index] || "";
                        }
                        return binaryChars[Math.floor(Math.random() * 2)];
                    }).join("")
                );

                if (iteration >= nextWord.length && iteration >= words[currentWordIndex].length) {
                    clearInterval(scrambleInterval);
                    setCurrentWordIndex(nextIndex);
                    setDisplayWord(nextWord);
                    setIsAnimating(false);
                }
                iteration += 1 / 3;
            }, 30);

        }, duration);

        return () => clearInterval(interval);
    }, [currentWordIndex, isAnimating, words, duration, binaryChars]);

    // Colors for different words
    const colors = [
        "text-purple-500",
        "text-cyan-500",
        "text-emerald-500",
        "text-amber-500",
        "text-rose-500"
    ];

    return (
        <span className={cn(
            "inline-block font-mono min-w-[300px] text-center transition-colors duration-500",
            colors[currentWordIndex % colors.length],
            className
        )}>
            {displayWord}
        </span>
    );
};
