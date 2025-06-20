
import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  duration: string;
}

const VideoPlayer = ({ videoUrl, title, duration }: VideoPlayerProps) => {
  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : '';

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
      <div className="relative aspect-video bg-black">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {/* Video Title Overlay */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium max-w-[calc(100%-2rem)]">
          <p className="truncate">{title}</p>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-4 right-4 bg-chef-gold/90 text-chef-charcoal px-3 py-1 rounded-full text-sm font-medium">
          {duration}
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;
