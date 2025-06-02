import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const GlowContainer = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  pointerEvents: 'none',
  zIndex: 9999,
});

const Canvas = styled('canvas')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
});

class GlowPoint {
  constructor(x, y, radius, alpha) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.alpha = alpha;
    this.targetAlpha = alpha;
  }

  update() {
    this.alpha = this.alpha + (this.targetAlpha - this.alpha) * 0.1;
    this.targetAlpha *= 0.95;
  }

  draw(ctx) {
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius
    );
    gradient.addColorStop(0, `rgba(59, 130, 246, ${this.alpha})`);
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function CursorGlow({ isActive = true }) {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef();
  const lastPointRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new point every 50ms if mouse has moved
      const now = Date.now();
      if (now - lastPointRef.current > 50 && isActive) {
        pointsRef.current.push(new GlowPoint(
          mousePos.x,
          mousePos.y,
          30 + Math.random() * 20,
          0.3
        ));
        lastPointRef.current = now;
      }

      // Update and draw points
      pointsRef.current = pointsRef.current.filter(point => point.alpha > 0.01);
      pointsRef.current.forEach(point => {
        point.update();
        point.draw(ctx);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isActive) return null;

  return (
    <GlowContainer>
      <Canvas ref={canvasRef} />
    </GlowContainer>
  );
} 