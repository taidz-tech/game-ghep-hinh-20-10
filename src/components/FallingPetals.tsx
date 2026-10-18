import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  scaleX: number;
  scaleSpeed: number;
  color: string;
  opacity: number;
  type: 'petal' | 'heart' | 'sparkle';
}

export const FallingPetals: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const petalColors = [
      '#f43f5e', // rose-500
      '#fb7185', // rose-400
      '#fda4af', // rose-300
      '#f472b6', // pink-400
      '#e11d48', // rose-600
      '#ff80bf', // romantic blossom
    ];

    const isLowPower = typeof navigator !== 'undefined' && (/HeadlessChrome/i.test(navigator.userAgent) || navigator.hardwareConcurrency < 4);
    const particleCount = isLowPower ? 28 : 55;

    const createParticle = (initialY = -20): Petal => {
      const randType = Math.random();
      let type: 'petal' | 'heart' | 'sparkle' = 'petal';
      if (randType > 0.85) type = 'heart';
      else if (randType > 0.7) type = 'sparkle';

      return {
        type,
        x: Math.random() * width,
        y: initialY === -20 ? Math.random() * height : initialY,
        size: type === 'sparkle' ? 2 + Math.random() * 4 : 10 + Math.random() * 16,
        speedY: type === 'heart' ? -(0.5 + Math.random() * 0.8) : 0.8 + Math.random() * 1.6,
        speedX: (Math.random() - 0.5) * 1.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        scaleX: Math.random(),
        scaleSpeed: 0.015 + Math.random() * 0.02,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        opacity: 0.4 + Math.random() * 0.5,
      };
    };

    const particles: Petal[] = Array.from({ length: particleCount }, () => createParticle());

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) => {
      c.save();
      c.translate(x, y);
      c.globalAlpha = alpha * 0.7;
      c.fillStyle = color;
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
      c.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawPetal = (c: CanvasRenderingContext2D, p: Petal) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      c.scale(p.scaleX, 1);
      c.globalAlpha = p.opacity;

      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(p.size / 2, -p.size / 3, p.size, -p.size / 2, p.size * 0.9, 0);
      c.bezierCurveTo(p.size, p.size / 2, p.size / 2, p.size / 3, 0, 0);
      c.fillStyle = p.color;
      c.fill();

      // Delicate inner petal contour
      c.lineWidth = 0.5;
      c.strokeStyle = 'rgba(255,255,255,0.4)';
      c.stroke();

      c.restore();
    };

    const drawSparkle = (c: CanvasRenderingContext2D, p: Petal) => {
      c.save();
      c.translate(p.x, p.y);
      c.globalAlpha = p.opacity * Math.abs(Math.sin(p.rotation * 2));
      c.fillStyle = '#fef08a'; // gold sparkle
      c.shadowColor = '#fde047';
      c.shadowBlur = 6;
      c.beginPath();
      c.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.rotation += p.rotSpeed;
        p.scaleX = Math.sin(time * 0.002 + p.rotation);

        p.y += p.speedY * 60 * delta;
        p.x += Math.sin(time * 0.001 + p.y * 0.01) * 0.8 + p.speedX;

        if (p.type === 'heart') {
          // Heart floats upward
          if (p.y < -30) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity);
        } else if (p.type === 'sparkle') {
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          drawSparkle(ctx, p);
        } else {
          // Petal falls downward
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          drawPetal(ctx, p);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 h-full w-full"
      aria-hidden="true"
    />
  );
};
