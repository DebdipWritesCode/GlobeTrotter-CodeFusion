import React, { useEffect, useRef, useState } from "react";

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  direction?: "up" | "down" | "left" | "right";
  delayMs?: number;
};

const offsets = {
  up: "translateY(16px)",
  down: "translateY(-16px)",
  left: "translateX(16px)",
  right: "translateX(-16px)",
} as const;

const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  direction = "up",
  delayMs = 0,
  style,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: "opacity 600ms ease, transform 600ms cubic-bezier(0.2, 0.6, 0.2, 1)",
        transitionDelay: `${delayMs}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : offsets[direction],
        willChange: "opacity, transform",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Reveal;
