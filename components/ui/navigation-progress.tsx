"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NavigationProgress — a slim top-of-screen progress bar that fires on every
 * client-side route transition. Zero dependencies beyond Next.js and React.
 *
 * Implementation: We watch for pathname/searchParams changes. On change-start
 * (detected via a click listener on <a> elements) we show and animate the bar.
 * On change-complete (pathname actually changes) we finish and hide it.
 */

let globalStart: (() => void) | null = null;
let globalDone: (() => void) | null = null;

export function startNavProgress() {
    globalStart?.();
}
export function doneNavProgress() {
    globalDone?.();
}

export function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [visible, setVisible] = useState(false);
    const [width, setWidth] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const resolveRef = useRef<(() => void) | null>(null);
    const prevPathRef = useRef(pathname);

    const start = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setVisible(true);
        setWidth(5);

        // Animate to ~85% naturally — stalls there waiting for route change
        let current = 5;
        timerRef.current = setInterval(() => {
            // Logarithmic easing — fast at start, slows as it approaches 85%
            const increment = (85 - current) * 0.08;
            current = Math.min(current + Math.max(increment, 0.5), 85);
            setWidth(current);
            if (current >= 85) clearInterval(timerRef.current!);
        }, 50);
    };

    const done = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setWidth(100);
        setTimeout(() => {
            setVisible(false);
            setWidth(0);
        }, 300);
    };

    // Expose imperative API
    globalStart = start;
    globalDone = done;

    // Watch route change completion
    useEffect(() => {
        if (pathname !== prevPathRef.current) {
            prevPathRef.current = pathname;
            done();
        }
    }, [pathname, searchParams]);

    // Intercept link clicks to start the bar immediately
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as Element).closest("a");
            if (!target) return;

            const href = target.getAttribute("href");
            if (!href) return;
            // Only internal navigation
            if (href.startsWith("http") || href.startsWith("//") || href.startsWith("#")) return;
            // Don't trigger for current page
            if (href === pathname) return;

            start();
        };

        document.addEventListener("click", handleClick, true);
        return () => document.removeEventListener("click", handleClick, true);
    }, [pathname]);

    if (!visible && width === 0) return null;

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 300ms ease" }}
        >
            <div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400"
                style={{
                    width: `${width}%`,
                    transition: width === 100
                        ? "width 200ms ease-out"
                        : "width 50ms linear",
                    boxShadow: "0 0 8px rgba(99, 102, 241, 0.8), 0 0 20px rgba(99, 102, 241, 0.4)",
                }}
            />
            {/* Glowing tip */}
            <div
                className="absolute top-0 h-[2px] w-12 bg-white/60 blur-sm rounded-full"
                style={{
                    left: `calc(${width}% - 3rem)`,
                    transition: width === 100 ? "left 200ms ease-out" : "left 50ms linear",
                }}
            />
        </div>
    );
}
