
import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export function WorldGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.6, 1], // Earth Blue
      markerColor: [0.1, 0.8, 0.2], // Eco Green markers
      glowColor: [0.6, 0.8, 1], // Light Blue glow
      markers: [
        { location: [-6.2088, 106.8456], size: 0.1 }, // Jakarta
        { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
        { location: [51.5074, -0.1278], size: 0.05 }, // London
        { location: [40.7128, -74.006], size: 0.05 }, // NY
      ],
      // @ts-ignore
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be mutated in place for performance.
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
    />
  );
}
