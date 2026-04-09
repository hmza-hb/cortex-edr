"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, SkipForward, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundMusicProps {
    status: 'pending' | 'processing' | 'completed' | 'failed';
}

const SONGS = [
    { name: "Built Future", url: "/assets/songs/built-future.mpeg" },
    { name: "Fire", url: "/assets/songs/fire.mpeg" },
    { name: "Koto", url: "/assets/songs/koto.mpeg" },
    { name: "Look", url: "/assets/songs/look.mpeg" },
    { name: "Midnight", url: "/assets/songs/midnight.mpeg" },
    { name: "Trust", url: "/assets/songs/trust.mpeg" },
];

export function BackgroundMusic({ status }: BackgroundMusicProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [isMuted, setIsMuted] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Effect to handle play/stop based on status
    useEffect(() => {
        if (!audioRef.current) return;

        if (status === 'processing') {
            if (hasInteracted) {
                audioRef.current.play().catch(console.error);
                setIsPlaying(true);
            }
        } else if (status === 'completed' || status === 'failed') {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [status, hasInteracted]);

    // Handle user interaction to allow autoplay
    useEffect(() => {
        const handleInteraction = () => {
            setHasInteracted(true);
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(console.error);
            setIsPlaying(true);
        }
    };

    const nextSong = () => {
        const nextIndex = (currentSongIndex + 1) % SONGS.length;
        setCurrentSongIndex(nextIndex);
        // Playback will be triggered by autoPlay or a separate effect if needed, 
        // but changing src with autoPlay=true usually works to start next song.
        setIsPlaying(true);
    };

    const handleSongEnd = () => {
        nextSong();
    };

    // Auto-play when status changes to processing if we have interaction
    useEffect(() => {
        if (status === 'processing' && hasInteracted && audioRef.current && !isPlaying) {
            audioRef.current.play().catch(console.error);
            setIsPlaying(true);
        }
    }, [status, hasInteracted, isPlaying]);

    return (
        <div className="flex items-center gap-4 bg-zinc-900/40 backdrop-blur-xl border border-white/5 px-4 py-2 rounded-2xl shadow-2xl">
            <audio
                ref={audioRef}
                src={SONGS[currentSongIndex].url}
                onEnded={handleSongEnd}
                autoPlay={status === 'processing' && hasInteracted}
            />

            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center relative overflow-hidden group">
                    <Music className={cn(
                        "w-4 h-4 text-indigo-400 transition-all duration-500",
                        isPlaying && "animate-pulse scale-110"
                    )} />
                    {isPlaying && (
                        <div className="absolute bottom-1.5 inset-x-1.5 flex items-end justify-between px-0.5 gap-[1px] h-2">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-[2px] bg-indigo-400 rounded-full"
                                    animate={{ 
                                        height: ["20%", "100%", "40%", "80%", "20%"] 
                                    }}
                                    transition={{ 
                                        duration: 0.5 + Math.random() * 0.5, 
                                        repeat: Infinity,
                                        delay: i * 0.1
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex flex-col min-w-[100px]">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Scanning Audio</span>
                    <span className="text-[10px] font-bold text-zinc-300 truncate max-w-[120px]">
                        {SONGS[currentSongIndex].name}
                    </span>
                </div>
            </div>

            <div className="h-8 w-px bg-white/5 mx-2" />

            <div className="flex items-center gap-2">
                <button
                    onClick={togglePlay}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-all active:scale-90"
                    title={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                    onClick={nextSong}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-all active:scale-90"
                    title="Next Song"
                >
                    <SkipForward className="w-4 h-4 fill-current" />
                </button>

                <div className="flex items-center gap-3 ml-2 group/vol">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 rounded-xl text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <div className="relative w-20 h-1.5 bg-white/5 rounded-full overflow-hidden flex items-center">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => {
                                setVolume(parseFloat(e.target.value));
                                setIsMuted(false);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <motion.div 
                            className="h-full bg-indigo-500/50"
                            style={{ width: `${volume * 100}%` }}
                        />
                        <div className="absolute right-0 top-0 bottom-0 left-0 border border-white/5 rounded-full pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
