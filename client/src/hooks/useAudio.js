// File: client/src/hooks/useAudio.js
import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * Hook quản lý nhạc nền game - Phiên bản đơn giản và ổn định
 */
export const useGameMusic = () => {
    const audioRef = useRef(null);
    const fadeIntervalRef = useRef(null);
    const hasStartedRef = useRef(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem('gameMusicMuted');
        return saved === 'true';
    });
    const [volume, setVolumeState] = useState(() => {
        const saved = localStorage.getItem('gameMusicVolume');
        return saved ? parseFloat(saved) : 0.3;
    });

    // Khởi tạo audio element một lần duy nhất
    useEffect(() => {
        const audio = new Audio('/audio/background-music.mp3');
        audio.loop = true;
        audio.volume = 0;
        audio.preload = 'auto';
        audioRef.current = audio;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        // Cleanup khi unmount
        return () => {
            // Clear fade interval nếu có
            if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current);
            }
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.pause();
            audio.src = '';
            audioRef.current = null;
            hasStartedRef.current = false;
        };
    }, []);

    // Lưu settings vào localStorage
    useEffect(() => {
        localStorage.setItem('gameMusicMuted', isMuted.toString());
    }, [isMuted]);

    useEffect(() => {
        localStorage.setItem('gameMusicVolume', volume.toString());
    }, [volume]);

    // Cập nhật volume realtime (trừ khi đang fade)
    useEffect(() => {
        if (audioRef.current && !fadeIntervalRef.current && isPlaying) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted, isPlaying]);

    const startMusic = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || isMuted) return;

        // Nếu đã start rồi thì không làm gì (tránh gọi nhiều lần)
        if (hasStartedRef.current && !audio.paused) return;

        // Clear any existing fade
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }

        hasStartedRef.current = true;

        // Fade in
        audio.volume = 0;
        audio.play().then(() => {
            const targetVolume = volume;
            const steps = 20;
            const stepDuration = 1000 / steps; // 1 giây fade in
            const volumeStep = targetVolume / steps;
            let currentStep = 0;

            fadeIntervalRef.current = setInterval(() => {
                currentStep++;
                if (audioRef.current) {
                    audioRef.current.volume = Math.min(targetVolume, volumeStep * currentStep);
                }

                if (currentStep >= steps) {
                    clearInterval(fadeIntervalRef.current);
                    fadeIntervalRef.current = null;
                }
            }, stepDuration);
        }).catch(error => {
            console.log('Play prevented:', error.message);
            hasStartedRef.current = false;
        });
    }, [isMuted, volume]);

    const stopMusic = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || audio.paused) return;

        // Clear any existing fade
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }

        // Fade out
        const startVolume = audio.volume;
        if (startVolume === 0) {
            audio.pause();
            audio.currentTime = 0;
            hasStartedRef.current = false;
            return;
        }

        const steps = 10;
        const stepDuration = 500 / steps; // 0.5 giây fade out
        const volumeStep = startVolume / steps;
        let currentStep = 0;

        fadeIntervalRef.current = setInterval(() => {
            currentStep++;
            if (audioRef.current) {
                audioRef.current.volume = Math.max(0, startVolume - (volumeStep * currentStep));
            }

            if (currentStep >= steps) {
                clearInterval(fadeIntervalRef.current);
                fadeIntervalRef.current = null;
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
                hasStartedRef.current = false;
            }
        }, stepDuration);
    }, []);

    const toggleMute = useCallback(() => {
        const audio = audioRef.current;

        setIsMuted(prev => {
            const newMuted = !prev;
            if (audio) {
                if (newMuted) {
                    audio.volume = 0;
                } else {
                    audio.volume = volume;
                    // Nếu đang pause thì play
                    if (audio.paused && hasStartedRef.current) {
                        audio.play().catch(e => console.log('Toggle play prevented:', e.message));
                    }
                }
            }
            return newMuted;
        });
    }, [volume]);

    const setVolume = useCallback((newVolume) => {
        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        setVolumeState(clampedVolume);

        // Cập nhật volume ngay lập tức nếu không bị mute và đang play
        if (audioRef.current && !isMuted && !audioRef.current.paused) {
            audioRef.current.volume = clampedVolume;
        }
    }, [isMuted]);

    return {
        startMusic,
        stopMusic,
        toggleMute,
        setVolume,
        isMuted,
        volume,
        isPlaying
    };
};

export default useGameMusic;
