"use client";

import { useEffect, useRef, useState } from "react";

export function VidyardPlayer({ url, onEnded }: { url: string, onEnded: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerRendered, setPlayerRendered] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Extract Vidyard UUID from share/play URL
    const idMatch = url.match(/vidyard\.com\/(?:watch\/)?([a-zA-Z0-9_-]+)/);
    const uuid = idMatch ? idMatch[1] : null;

    if (!uuid || !containerRef.current || initialized.current) return;

    const renderVidyard = () => {
      if ((window as any).VidyardV4 && containerRef.current) {
        initialized.current = true;
        setPlayerRendered(true);
        (window as any).VidyardV4.api.renderPlayer({
          uuid: uuid,
          container: containerRef.current,
          type: 'inline'
        });

        (window as any).VidyardV4.api.addReadyListener((_: any, player: any) => {
          if (player.uuid === uuid) {
            player.on('playerComplete', () => {
              if (onEnded) onEnded();
            });
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

  return <div className="relative w-full h-full bg-black flex items-center justify-center">
    <div ref={containerRef} className="w-full" style={{ maxWidth: '100%', maxHeight: '100%' }}></div>
    {!playerRendered && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-white text-sm animate-pulse">Loading Vidyard Player...</span>
      </div>
    )}
  </div>;
}
