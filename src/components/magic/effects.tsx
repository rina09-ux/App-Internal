import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';

/**
 * Shared, dependency-free "Magic UI" style visual primitives.
 * Pure presentation layer — no data fetching, no business logic.
 * Safe to drop into any existing component without touching props/state.
 */

/** Wraps children with a rotating gradient border beam. Pass a rounded className on the child. */
export const BorderBeamWrap: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`border-beam-wrap ${className}`}>{children}</div>;

/** Infinite horizontal marquee for logo rails / trust badges. */
export const Marquee: React.FC<{ children: React.ReactNode; className?: string; reverse?: boolean }> = ({
  children,
  className = '',
  reverse = false,
}) => (
  <div className={`marquee-viewport overflow-hidden ${className}`}>
    <div
      className="marquee-track"
      style={reverse ? { animationDirection: 'reverse' } : undefined}
    >
      <div className="flex shrink-0 items-center gap-8 pr-8">{children}</div>
      <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
        {children}
      </div>
    </div>
  </div>
);

/** A handful of diagonal "meteor" streaks for ambient dark backgrounds. */
export const Meteors: React.FC<{ count?: number; className?: string }> = ({ count = 8, className = '' }) => {
  const meteors = Array.from({ length: count }, (_, i) => i);
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {meteors.map((i) => (
        <span
          key={i}
          className="meteor"
          style={{
            top: `${Math.random() * 20}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${5 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
};

/** Lightweight canvas particle field — subtle floating blue dots. */
export const ParticleField: React.FC<{ density?: number; className?: string }> = ({
  density = 40,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width ?? canvas.clientWidth;
      height = rect?.height ?? canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const particles = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      o: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(50, 95, 232, ${p.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
};

/**
 * Architectural composition primitives.
 * These exist to break the repeated "equal-width rectangle grid" pattern
 * that reads as templated/AI-generated, in favor of asymmetric, layered,
 * blueprint-inspired layouts — closer to the MagicUI reference aesthetic.
 */

/** SVG wave seam to join two sections without a hard horizontal rule. */
export const SectionWave: React.FC<{ fill?: string; flip?: boolean; className?: string }> = ({
  fill = '#ffffff',
  flip = false,
  className = '',
}) => (
  <div className={`pointer-events-none w-full overflow-hidden leading-[0] ${className}`} aria-hidden="true">
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`h-12 w-full lg:h-20 ${flip ? 'rotate-180' : ''}`}
    >
      <path
        d="M0,32 C240,80 480,0 720,24 C960,48 1200,88 1440,40 L1440,80 L0,80 Z"
        fill={fill}
      />
    </svg>
  </div>
);

/** Faint blueprint-style dot grid, for architectural/technical texture on light sections. */
export const DotGrid: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_40%,#000_60%,transparent_100%)] ${className}`}
    aria-hidden="true"
  />
);

/** Freeform (non-circular) ambient glow — reads less like a stock "blurred dot". */
export const BlobGlow: React.FC<{ className?: string; colorClass?: string }> = ({
  className = '',
  colorClass = 'bg-blue-500/15',
}) => <div className={`blob-glow pointer-events-none absolute ${colorClass} ${className}`} aria-hidden="true" />;

/**
 * Animated number counter — counts up (or down) once it scrolls into view.
 * Ported from MagicUI's NumberTicker, adapted to this project's dependency-free
 * "magic" primitives (no `cn` helper / no Tailwind-merge dependency required).
 * `value` accepts the final displayed number; `suffix`/`prefix` render around it
 * (e.g. suffix="%" or prefix="-") without being part of the animated count.
 */
export const NumberTicker: React.FC<{
  value: number;
  startValue?: number;
  direction?: 'up' | 'down';
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  className?: string;
}> = ({
  value,
  startValue = 0,
  direction = 'up',
  decimalPlaces = 0,
  prefix = '',
  suffix = '',
  delay = 0,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? value : startValue);
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      motionValue.set(direction === 'down' ? startValue : value);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [motionValue, isInView, delay, value, direction, startValue]);

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent =
            prefix +
            Intl.NumberFormat('en-US', {
              minimumFractionDigits: decimalPlaces,
              maximumFractionDigits: decimalPlaces,
            }).format(Number(Number(latest).toFixed(decimalPlaces))) +
            suffix;
        }
      }),
    [springValue, decimalPlaces, prefix, suffix]
  );

  return (
    <span ref={ref} className={`inline-block tabular-nums ${className}`}>
      {prefix}{startValue}{suffix}
    </span>
  );
};

/** Parses a metric string like "94%", "10x", "3.2 Days", "12+", "< 5s" into an
 *  animated leading number plus static prefix/suffix. Falls back to plain text
 *  if no number is found (e.g. "Zero", "Dual", "FIPS", "24/7" — treated as text). */
export const AnimatedMetric: React.FC<{ value: string; className?: string }> = ({
  value,
  className = '',
}) => {
  const match = value.match(/-?\d+(\.\d+)?/);
  if (!match || match.index === undefined) {
    return <span className={className}>{value}</span>;
  }
  const numStr = match[0];
  const num = parseFloat(numStr);
  const decimalPlaces = numStr.includes('.') ? numStr.split('.')[1].length : 0;
  const prefix = value.slice(0, match.index);
  const suffix = value.slice(match.index + numStr.length);
  return (
    <span className={className}>
      <NumberTicker value={num} decimalPlaces={decimalPlaces} prefix={prefix} suffix={suffix} />
    </span>
  );
};

/** Dashed connector path drawn between two points inside a relatively-positioned parent (SVG overlay, 0-1 fractional coords). */
export const ConnectorLine: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  stroke?: string;
  className?: string;
}> = ({ from, to, stroke = '#93c5fd', className = '' }) => (
  <svg
    className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <line
      x1={`${from.x * 100}%`}
      y1={`${from.y * 100}%`}
      x2={`${to.x * 100}%`}
      y2={`${to.y * 100}%`}
      stroke={stroke}
      strokeWidth={1.5}
      className="connector-line"
      opacity={0.5}
    />
  </svg>
);
