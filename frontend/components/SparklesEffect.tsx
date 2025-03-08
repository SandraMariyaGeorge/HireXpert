import { useEffect, useRef } from "react";

const SparklesEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sparkles: { x: number; y: number; size: number; opacity: number }[] = [];

    const createSparkle = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2 + 1;
      const opacity = Math.random();
      sparkles.push({ x, y, size, opacity });
    };

    const drawSparkles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparkles.forEach((sparkle, index) => {
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${sparkle.opacity})`;
        ctx.fill();
        sparkle.opacity -= 0.01;
        if (sparkle.opacity <= 0) {
          sparkles.splice(index, 1);
        }
      });
    };

    const animate = () => {
      drawSparkles();
      createSparkle();
      requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      sparkles.length = 0;
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
};

export default SparklesEffect;
