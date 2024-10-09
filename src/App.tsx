import React, { useRef, useEffect, useState } from 'react';
import { Aperture } from 'lucide-react';

const placeholderImages = Array(50)
  .fill(null)
  .map((_, index) => `https://picsum.photos/300/200?random=${index}`);

function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const scrollContent = scrollContainer.firstElementChild as HTMLElement;
      if (scrollContent) {
        const scrollWidth = scrollContent.scrollWidth;
        let animationFrameId: number;
        let lastTimestamp: number;

        const scroll = (timestamp: number) => {
          if (!lastTimestamp) lastTimestamp = timestamp;
          const deltaTime = timestamp - lastTimestamp;
          lastTimestamp = timestamp;

          if (!isHovering) {
            setScrollPosition((prevPosition) => {
              let newPosition = prevPosition + 0.05 * deltaTime;
              if (newPosition >= scrollWidth / 2) {
                newPosition = 0;
              }
              return newPosition;
            });
          }
          animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
      }
    }
  }, [isHovering]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft);
    }
  };

  const handleScroll = () => {
    if (isHovering && scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft);
    }
  };

  return (
    <div
      className="h-screen bg-cover bg-center bg-fixed overflow-hidden"
      style={{
        backgroundImage: 'url("https://www.game-broz.com/web/bg2.png")',
      }}
    >
      <div className="h-full flex flex-col bg-black bg-opacity-50 p-4 space-y-4">
        <div className="flex justify-center items-center h-16">
          <img
            src="https://www.game-broz.com/web/logo.png"
            alt="Logo"
            className="h-full"
          />
        </div>
        <div className="h-3/4 overflow-hidden bg-white bg-opacity-80">
          <div className="h-full overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-5 gap-1 p-1">
              {placeholderImages.map((src, index) => (
                <div key={index} className="aspect-[3/2]">
                  <img
                    src={src}
                    alt={`Placeholder ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-grow overflow-hidden bg-white bg-opacity-80">
          <div
            ref={scrollRef}
            className="h-full overflow-x-auto no-scrollbar"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onScroll={handleScroll}
          >
            <div className="flex h-full" style={{ width: 'max-content' }}>
              {[...placeholderImages, ...placeholderImages].map(
                (src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Horizontal Placeholder ${index + 1}`}
                    className="h-full w-auto object-cover flex-shrink-0"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
