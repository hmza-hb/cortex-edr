"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MermaidDiagramProps {
    chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
    const [svg, setSvg] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            securityLevel: "loose",
            fontFamily: "var(--font-geist-sans), Inter, sans-serif",
            flowchart: {
                curve: 'basis',
                useMaxWidth: true,
                htmlLabels: true
            },
            themeVariables: {
                primaryColor: '#3b82f6',
                secondaryColor: '#10b981',
                tertiaryColor: '#f59e0b',
                clusterBkg: 'rgba(255, 255, 255, 0.05)',
                lineColor: 'rgba(255, 255, 255, 0.2)',
                textColor: '#ffffff',
                mainBkg: 'transparent',
                nodeBorder: 'rgba(255, 255, 255, 0.1)'
            }
        });

        const renderChart = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Ensure chart is wrapped correctly if it lacks graph TD or similar
                let validChart = chart.trim();

                // Basic cleanup for LLM outputs
                if (validChart.includes("```mermaid")) {
                    validChart = validChart.replace(/```mermaid/g, "").replace(/```/g, "").trim();
                }

                if (!validChart.startsWith("graph") && !validChart.startsWith("flowchart")) {
                    validChart = "flowchart TB\n" + validChart;
                }

                const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
                const { svg: renderedSvg } = await mermaid.render(id, validChart);

                // Rule 2 check: Remove fixed height, set width: 100%
                const cleanSvg = renderedSvg
                    .replace(/height="[^"]*"/, "")
                    .replace(/style="[^"]*"/, 'style="width: 100%; max-width: 100%; height: auto;"');

                setSvg(cleanSvg);
            } catch (err: any) {
                console.error("Mermaid parsing failed", err);
                setError("Failed to render architecture diagram.");
            } finally {
                setIsLoading(false);
            }
        };

        if (chart) {
            renderChart();
        }
    }, [chart]);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    if (!chart) return null;

    if (error) {
        return (
            <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-2xl text-center">
                <p className="text-sm font-bold text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`
                relative overflow-hidden bg-white/[0.01] border border-white/5 
                group transition-all duration-300
                ${isFullscreen
                    ? "fixed inset-4 z-50 rounded-3xl bg-black/95 backdrop-blur-xl border-white/20 shadow-2xl flex flex-col items-center justify-center p-8"
                    : "rounded-[32px] p-6 h-auto min-h-[400px] flex items-center justify-center"}
            `}
        >
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl"
                >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center gap-4 py-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Rendering Blueprint</p>
                </div>
            ) : (
                <div
                    className={`
                        w-full h-auto flex items-center justify-center
                        ${isFullscreen ? "overflow-auto max-h-[85vh] max-w-full p-4" : "overflow-hidden px-4"}
                    `}
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            )}

            {/* CSS to make the SVG responsive and legible */}
            <style jsx global>{`
                .mermaid svg {
                    width: 100% !important;
                    height: auto !important;
                }
                .cluster rect {
                    fill: var(--cluster-bkg, rgba(255,255,255,0.05)) !important;
                    stroke: rgba(255,255,255,0.1) !important;
                }
                .node rect, .node circle, .node polygon, .node path {
                    stroke: rgba(255,255,255,0.15) !important;
                }
            `}</style>
        </div>
    );
}
