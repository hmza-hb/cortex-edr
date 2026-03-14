"use client";

import React, { useState, useMemo } from "react";
import { Folder, File, ChevronRight, ChevronDown, FileText, Code2, Database } from "lucide-react";

interface FileNode {
    name: string;
    path: string;
    type: "file" | "folder";
    tag?: string;
    annotation?: string;
    children?: FileNode[];
}

interface FileTreeVisualizerProps {
    files: string[]; // Fallback list
    annotatedFiles?: {
        path: string;
        tag?: string;
        annotation?: string;
    }[];
}

const getFileIcon = (filename: string) => {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.ts') || lower.endsWith('.tsx') || lower.endsWith('.js') || lower.endsWith('.jsx')) return <Code2 className="w-4 h-4 text-blue-400/80" />;
    if (lower.endsWith('.sql') || lower.includes('prisma')) return <Database className="w-4 h-4 text-purple-400/80" />;
    return <FileText className="w-4 h-4 text-gray-400/80" />;
};

const getTagStyles = (tag: string) => {
    const lower = tag.toLowerCase();
    const base = "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ";
    switch (lower) {
        case 'service': return base + "bg-blue-500/10 text-blue-400";
        case 'config': return base + "bg-green-500/10 text-green-400";
        case 'db': return base + "bg-purple-500/10 text-purple-400";
        case 'test': return base + "bg-amber-500/10 text-amber-400";
        case 'infra': return base + "bg-teal-500/10 text-teal-400";
        case 'shared': return base + "bg-white/10 text-white/60";
        default: return base + "bg-white/5 text-white/40";
    }
};

export function FileTreeVisualizer({ files, annotatedFiles = [] }: FileTreeVisualizerProps) {
    // Start collapsed as per Rule 7
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

    const tree = useMemo(() => {
        const root: FileNode = { name: "root", path: "", type: "folder", children: [] };

        // Merge list of files with potential annotations
        const fileMap = new Map<string, { tag?: string; annotation?: string }>();
        annotatedFiles.forEach(af => fileMap.set(af.path, { tag: af.tag, annotation: af.annotation }));

        files.forEach((filepath) => {
            const parts = filepath.split("/").filter(Boolean);
            let current = root;

            parts.forEach((part, index) => {
                const isFile = index === parts.length - 1;
                const pathSoFar = parts.slice(0, index + 1).join("/");

                let child = current.children?.find(c => c.name === part);
                if (!child) {
                    const metadata = fileMap.get(pathSoFar) || {};
                    child = {
                        name: part,
                        path: pathSoFar,
                        type: isFile ? "file" : "folder",
                        tag: metadata.tag,
                        annotation: metadata.annotation,
                        children: isFile ? undefined : []
                    };
                    current.children = current.children || [];
                    current.children.push(child);
                }
                current = child;
            });
        });

        const sortNode = (node: FileNode) => {
            if (node.children) {
                node.children.sort((a, b) => {
                    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
                    return a.name.localeCompare(b.name);
                });
                node.children.forEach(sortNode);
            }
        };
        sortNode(root);
        return root.children || [];
    }, [files, annotatedFiles]);

    const toggleFolder = (path: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        } else {
            newExpanded.add(path);
        }
        setExpandedFolders(newExpanded);
    };

    const renderNode = (node: FileNode, level: number = 0) => {
        const isExpanded = expandedFolders.has(node.path);

        // Indentation Spacers (Rule 2 for File Tree)
        const spacers = Array.from({ length: level }).map((_, i) => (
            <span key={i} className="inline-block w-[18px] h-full shrink-0 border-l border-white/5" />
        ));

        const isFolder = node.type === "folder";

        return (
            <div key={node.path} className="flex flex-col">
                <div
                    className="flex items-center group cursor-pointer hover:bg-white/[0.03] transition-colors h-[28px] pr-4 select-none"
                    onClick={() => isFolder ? toggleFolder(node.path) : null}
                >
                    {spacers}

                    {/* Toggle Indicator */}
                    <div className="w-[18px] flex items-center justify-center text-white/20 group-hover:text-white/40">
                        {isFolder && (
                            <span className="text-[10px]">
                                {isExpanded ? "▼" : "▶"}
                            </span>
                        )}
                    </div>

                    {/* Icon */}
                    <div className="mr-2">
                        {isFolder ? <Folder className="w-4 h-4 text-blue-500/60" /> : getFileIcon(node.name)}
                    </div>

                    {/* Name */}
                    <span className={`text-[13px] font-medium tracking-tight truncate flex-1 ${isFolder ? 'text-white/90' : 'text-white/60'}`}>
                        {node.name}
                    </span>

                    {/* Metadata: Tag and Annotation (Rule 2 & 4) */}
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                        {node.tag && (
                            <span className={getTagStyles(node.tag)}>
                                {node.tag}
                            </span>
                        )}
                        {node.annotation && (
                            <span className="text-[11px] text-white/20 font-normal">
                                — {node.annotation}
                            </span>
                        )}
                    </div>
                </div>

                {/* Collapsible Children with transition (Rule 1 for File Tree) */}
                {isFolder && node.children && (
                    <div
                        className={`overflow-hidden transition-all duration-200 ease-in-out`}
                        style={{
                            maxHeight: isExpanded ? '5000px' : '0px',
                            opacity: isExpanded ? 1 : 0
                        }}
                    >
                        {node.children.map(child => renderNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (!files || files.length === 0) return null;

    return (
        <div className="font-mono bg-[#050505] overflow-y-auto custom-scrollbar rounded-[32px] py-4">
            {tree.map(node => renderNode(node))}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
}
