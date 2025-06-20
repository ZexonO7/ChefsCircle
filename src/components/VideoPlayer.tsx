
import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  duration: string;
}

const VideoPlayer = ({ videoUrl, title, duration }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  // For demo purposes, we'll use a placeholder video or image
  const placeholderImage = "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80";

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-black group">
        <img 
          src={placeholderImage} 
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePlayPause}
            className="bg-white/90 hover:bg-white rounded-full p-4 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-chef-charcoal" />
            ) : (
              <Play className="w-8 h-8 text-chef-charcoal ml-1" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-4 text-white">
            <button onClick={handlePlayPause} className="hover:text-chef-gold transition-colors">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <div className="flex-1 bg-white/30 rounded-full h-1">
              <div className="bg-chef-gold h-1 rounded-full w-1/3"></div>
            </div>
            
            <span className="text-sm">2:34 / {duration}</span>
            
            <button onClick={handleMute} className="hover:text-chef-gold transition-colors">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            <button className="hover:text-chef-gold transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="absolute top-4 right-4 bg-chef-gold/90 text-chef-charcoal px-3 py-1 rounded-full text-sm font-medium">
          Demo Video
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;
