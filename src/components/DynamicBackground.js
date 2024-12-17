import React, { useEffect, useRef } from "react";

// Configuración de temas estáticos y dinámicos
const THEMES = {
  static1: "linear-gradient(to bottom, #3a7bd5, #00d2ff)", // Azul degradado
  static2: "radial-gradient(circle, #ff9a9e, #fad0c4)", // Rosado
  static3: "linear-gradient(to right, #ff7e5f, #feb47b)", // Naranja degradado
  dynamic: { particlesColor: "#00d2ff" }, // Fondo dinámico con partículas
};

// Fondo estático basado en CSS
const StaticBackground = ({ theme }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: theme,
        zIndex: -1,
      }}
    />
  );
};

// Fondo dinámico con partículas
const DynamicBackground = ({ particlesColor }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Configuración del canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    // Crear partículas
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.color = particlesColor;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebote en los bordes
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

        this.draw();
      }
    }

    // Inicializar partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animación
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => particle.update());

      requestAnimationFrame(animate);
    };

    animate();
  }, [particlesColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  );
};

// Componente principal que alterna fondos
const DynamicBackgroundHandler = ({ type = "static1" }) => {
  switch (type) {
    case "static1":
      return <StaticBackground theme={THEMES.static1} />;
    case "static2":
      return <StaticBackground theme={THEMES.static2} />;
    case "static3":
      return <StaticBackground theme={THEMES.static3} />;
    case "dynamic":
      return <DynamicBackground particlesColor={THEMES.dynamic.particlesColor} />;
    default:
      return <StaticBackground theme={THEMES.static1} />;
  }
};

// Ejemplo de uso
export default function AppBackground({ type = "static1" }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <DynamicBackgroundHandler type={type} />
    </div>
  );
}
