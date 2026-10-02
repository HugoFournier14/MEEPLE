import React, { useEffect, useRef } from 'react';

export const MeepleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particles: meeple shapes and dice sparkles
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotSpeed: number;
      alpha: number;
      type: 'meeple' | 'dice' | 'dust';
    }

    const particles: Particle[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 10 + Math.random() * 16,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -0.2 - Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      alpha: 0.15 + Math.random() * 0.25,
      type: Math.random() > 0.6 ? 'meeple' : Math.random() > 0.3 ? 'dice' : 'dust',
    }));

    const drawMeeple = (ctx: CanvasRenderingContext2D, size: number) => {
      // Classic meeple silhouette drawn relative to center
      ctx.beginPath();
      const s = size / 20;
      // Head
      ctx.arc(0, -7 * s, 3.5 * s, 0, Math.PI * 2);
      // Torso & legs
      ctx.moveTo(-2 * s, -4 * s);
      ctx.lineTo(-7 * s, -1 * s);
      ctx.lineTo(-6 * s, 2 * s);
      ctx.lineTo(-3 * s, 1 * s);
      ctx.lineTo(-4 * s, 8 * s);
      ctx.lineTo(-1 * s, 8 * s);
      ctx.lineTo(0, 4 * s);
      ctx.lineTo(1 * s, 8 * s);
      ctx.lineTo(4 * s, 8 * s);
      ctx.lineTo(3 * s, 1 * s);
      ctx.lineTo(6 * s, 2 * s);
      ctx.lineTo(7 * s, -1 * s);
      ctx.lineTo(2 * s, -4 * s);
      ctx.closePath();
      ctx.fill();
    };

    const drawDice = (ctx: CanvasRenderingContext2D, size: number) => {
      const half = size / 2;
      ctx.beginPath();
      ctx.roundRect(-half, -half, size, size, 3);
      ctx.stroke();
      // Pips
      ctx.beginPath();
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'meeple') {
          ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha})`; // warm orange
          drawMeeple(ctx, p.size);
        } else if (p.type === 'dice') {
          ctx.strokeStyle = `rgba(234, 179, 8, ${p.alpha})`; // warm gold
          ctx.fillStyle = `rgba(234, 179, 8, ${p.alpha})`;
          ctx.lineWidth = 1;
          drawDice(ctx, p.size);
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60"
    />
  );
};
