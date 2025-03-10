import { useEffect } from "react";

export default function ShootingStars() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes shooting-star {
        0% {
          transform: translateX(0) translateY(0);
          opacity: 1;
        }
        100% {
          transform: translateX(-200px) translateY(200px);
          opacity: 0;
        }
      }

      .shooting-star {
        position: absolute;
        width: 2px;
        height: 100px;
        background: linear-gradient(45deg, white, rgba(255, 255, 255, 0));
        animation: shooting-star 1s linear infinite;
      }

      .background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 100%);
        overflow: hidden;
        z-index: -1;
      }

      .star {
        position: absolute;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
      }
    `;
    document.head.appendChild(style);

    const createShootingStar = () => {
      const star = document.createElement("div");
      star.className = "shooting-star";
      star.style.top = `${Math.random() * window.innerHeight}px`;
      star.style.left = `${Math.random() * window.innerWidth}px`;
      document.body.appendChild(star);

      setTimeout(() => {
        document.body.removeChild(star);
      }, 1000);
    };

    const createStarsBackground = () => {
      const background = document.querySelector(".background");
      if (background) {
        for (let i = 0; i < 100; i++) {
          const star = document.createElement("div");
          star.className = "star";
          star.style.top = `${Math.random() * 100}%`;
          star.style.left = `${Math.random() * 100}%`;
          background.appendChild(star);
        }
      }
    };

    const interval = setInterval(createShootingStar, 500);
    createStarsBackground();

    return () => {
      clearInterval(interval);
      document.head.removeChild(style);
    };
  }, []);

  return <div className="background"></div>;
}
