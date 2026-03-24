import { useEffect, useRef, useCallback } from 'react';
import 'plyr/dist/plyr.css';

export default function VideoPlayer({ youtubeId, onEnd, onTimeUpdate, onReady, onPause }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const eventsRef = useRef({ onEnd, onTimeUpdate, onReady, onPause });

  // Keep event refs up to date without re-initializing Plyr
  useEffect(() => {
    eventsRef.current = { onEnd, onTimeUpdate, onReady, onPause };
  }, [onEnd, onTimeUpdate, onReady, onPause]);

  const extractId = useCallback((urlOrId) => {
    if (!urlOrId) return null;
    const str = typeof urlOrId === 'string' ? urlOrId : String(urlOrId);
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = str.match(regExp);
    return (match && match[7].length === 11) ? match[7] : str;
  }, []);

  const videoId = extractId(youtubeId);

  useEffect(() => {
    if (!containerRef.current || !videoId) return;

    let destroyed = false;

    // Dynamically import Plyr to avoid SSR issues
    const initPlyr = async () => {
      const PlyrModule = await import('plyr');
      const Plyr = PlyrModule.default;

      if (destroyed || !containerRef.current) return;

      // Clean up previous instance
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      // Create the embed element
      const wrapper = containerRef.current;
      wrapper.innerHTML = '';

      const div = document.createElement('div');
      div.setAttribute('data-plyr-provider', 'youtube');
      div.setAttribute('data-plyr-embed-id', videoId);
      wrapper.appendChild(div);

      // Initialize Plyr
      const player = new Plyr(div, {
        controls: [
          'play-large',
          'rewind',
          'play',
          'fast-forward',
          'progress',
          'current-time',
          'duration',
          'mute',
          'volume',
          'settings',
          'pip',
          'fullscreen',
        ],
        settings: ['quality', 'speed'],
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
        youtube: {
          noCookie: true,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          modestbranding: 1,
        },
        tooltips: { controls: true, seek: true },
        keyboard: { focused: true, global: true },
      });

      if (destroyed) {
        player.destroy();
        return;
      }

      playerRef.current = player;

      player.on('ready', () => {
        if (eventsRef.current.onReady) eventsRef.current.onReady(player);
      });

      player.on('ended', () => {
        if (eventsRef.current.onEnd) eventsRef.current.onEnd();
      });

      player.on('timeupdate', () => {
        if (eventsRef.current.onTimeUpdate) {
          eventsRef.current.onTimeUpdate(player.currentTime, player.duration);
        }
      });

      player.on('pause', () => {
        if (eventsRef.current.onPause) {
          eventsRef.current.onPause(player.currentTime);
        }
      });
    };

    initPlyr();

    return () => {
      destroyed = true;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId]);

  if (!videoId) {
    return (
      <div className="plyr-wrapper relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg" />
    );
  }

  return (
    <div className="plyr-wrapper relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
      <div ref={containerRef} />
    </div>
  );
}
