import React, { useCallback, useRef } from "react";

type TiltProps = React.HTMLAttributes<HTMLDivElement> & {
  maxTiltDeg?: number; // max degrees
  scale?: number;
  glare?: boolean;
};

const Tilt: React.FC<TiltProps> = ({
  children,
  className,
  maxTiltDeg = 8,
  scale = 1.02,
  glare = false,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback<React.MouseEventHandler<HTMLDivElement>>(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      const tiltX = (maxTiltDeg / 2 - px * maxTiltDeg).toFixed(2);
      const tiltY = ((py * maxTiltDeg - maxTiltDeg / 2) * 0.9).toFixed(2);
      el.style.transform = `perspective(800px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(${scale})`;
      if (glare) {
        el.style.setProperty("--glare-x", `${px * 100}%`);
        el.style.setProperty("--glare-y", `${py * 100}%`);
      }
    },
    [maxTiltDeg, scale, glare]
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transition: "transform 200ms cubic-bezier(0.2, 0.6, 0.2, 1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
        backgroundImage: glare
          ? `radial-gradient(200px 200px at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.08), transparent 60%)`
          : undefined,
        backgroundBlendMode: glare ? ("screen" as const) : undefined,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Tilt;
