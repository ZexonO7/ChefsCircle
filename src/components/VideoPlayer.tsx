
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  duration: string;
  onVideoComplete?: () => void;
  onProgressUpdate?: (progress: number) => void;
}

// Load YouTube IFrame API
const loadYouTubeAPI = (): Promise<void> => {
  return new Promise((resolve) => {
    if ((window as any).YT && (window as any).YT.Player) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('youtube-iframe-api');
    if (existingScript) {
      // Wait for existing script to load
      const checkInterval = setInterval(() => {
        if ((window as any).YT && (window as any).YT.Player) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'youtube-iframe-api';
    script.src = 'https://www.youtube.com/iframe_api';
    
    (window as any).onYouTubeIframeAPIReady = () => {
      resolve();
    };
    
    document.head.appendChild(script);
  });
};

const VideoPlayer = ({ videoUrl, title, duration, onVideoComplete, onProgressUpdate }: VideoPlayerProps) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isAPIReady, setIsAPIReady] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const playerId = useRef(`yt-player-${Math.random().toString(36).substr(2, 9)}`);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  const checkProgress = useCallback(() => {
    if (!playerRef.current || hasCompleted) return;

    try {
      const currentTime = playerRef.current.getCurrentTime?.() || 0;
      const totalDuration = playerRef.current.getDuration?.() || 0;
      
      if (totalDuration > 0) {
        const progress = (currentTime / totalDuration) * 100;
        onProgressUpdate?.(progress);

        // Mark as complete when user has watched 90% of the video
        if (progress >= 90 && !hasCompleted) {
          setHasCompleted(true);
          onVideoComplete?.();
        }
      }
    } catch (error) {
      console.error('Error checking video progress:', error);
    }
  }, [hasCompleted, onVideoComplete, onProgressUpdate]);

  useEffect(() => {
    let mounted = true;

    const initPlayer = async () => {
      if (!videoId) return;

      await loadYouTubeAPI();
      
      if (!mounted) return;
      setIsAPIReady(true);

      // Clean up existing player
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
      }

      // Create player after a small delay to ensure DOM is ready
      setTimeout(() => {
        if (!mounted || !containerRef.current) return;

        try {
          playerRef.current = new (window as any).YT.Player(playerId.current, {
            videoId: videoId,
            playerVars: {
              rel: 0,
              modestbranding: 1,
              enablejsapi: 1,
              origin: window.location.origin,
            },
            events: {
              onStateChange: (event: any) => {
                // YT.PlayerState.PLAYING = 1
                if (event.data === 1) {
                  // Start tracking progress when playing
                  if (progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                  }
                  progressIntervalRef.current = setInterval(checkProgress, 1000);
                } else if (event.data === 0) {
                  // Video ended - mark as complete
                  if (!hasCompleted) {
                    setHasCompleted(true);
                    onVideoComplete?.();
                    onProgressUpdate?.(100);
                  }
                } else {
                  // Paused or other state - stop tracking
                  if (progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                  }
                }
              },
            },
          });
        } catch (error) {
          console.error('Error creating YouTube player:', error);
        }
      }, 100);
    };

    initPlayer();

    return () => {
      mounted = false;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
      }
    };
  }, [videoId, checkProgress, hasCompleted, onVideoComplete, onProgressUpdate]);

  // Reset completion state when video changes
  useEffect(() => {
    setHasCompleted(false);
  }, [videoId]);

  if (!videoId) {
    return (
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-lg font-medium mb-2">Video Unavailable</p>
            <p className="text-sm opacity-75">Unable to load video from the provided URL</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-black" ref={containerRef}>
        <div id={playerId.current} className="w-full h-full" />
        
        {/* Video Title Overlay */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium max-w-[calc(100%-2rem)] pointer-events-none">
          <p className="truncate">{title}</p>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-4 right-4 bg-chef-gold/90 text-chef-charcoal px-3 py-1 rounded-full text-sm font-medium pointer-events-none">
          {duration}
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;
