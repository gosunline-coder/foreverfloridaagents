"use client";

import { useEffect, useRef } from "react";

export function VidyardPlayer({ url, onEnded }: { url: string, onEnded: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRendered = useRef(false);

  useEffect(() => {
    // Extract Vidyard UUID from share/play URL
    const idMatch = url.match(/vidyard\.com\/(?:watch\/)?([a-zA-Z0-9_-]+)/);
    const uuid = idMatch ? idMatch[1] : null;

    if (!uuid || !containerRef.current || playerRendered.current) return;

    const renderVidyard = () => {
      if ((window as any).VidyardV4) {
        playerRendered.current = true;
        (window as any).VidyardV4.api.renderPlayer({
          uuid: uuid,
          container: containerRef.current,
          type: 'inline',
          width: '100%',
          height: '100%',
          events: {
            playerComplete: () => {
              if (onEnded) onEnded();
            }
          }
        });
      }
    };

    if (!(window as any).VidyardV4) {
      const script = document.createElement('script');
      script.src = 'https://play.vidyard.com/embed/v4.js';
      script.async = true;
      script.onload = renderVidyard;
      document.body.appendChild(script);
    } else {
      renderVidyard();
    }
  }, [url, onEnded]);

  return <div ref={containerRef} className="w-full h-full bg-black flex items-center justify-center">
    {!playerRendered.current && <span className="text-white text-sm animate-pulse">Loading Vidyard Player...</span>}
  </div>;
}
