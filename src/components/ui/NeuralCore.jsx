import React, { useRef, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { motion, useAnimation } from 'framer-motion';

const CanvasContainer = styled('div')({
  position: 'relative',
  width: '300px',
  height: '300px',
  margin: '0 auto',
});

const Canvas = styled('canvas')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

const lerp = (start, end, t) => start * (1 - t) + end * t;

class Particle {
  constructor(x, y, radius, color, ctx, canvasWidth, canvasHeight) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 0.001 + Math.random() * 0.002;
    this.distance = 50 + Math.random() * 50;
    this.lastX = x;
    this.lastY = y;
    this.brightness = Math.random();
    this.targetBrightness = Math.random();
    this.isOrbiting = Math.random() > 0.5;
  }

  update(mouseX, mouseY) {
    if (this.isOrbiting) {
      this.angle += this.speed;
      const targetX = Math.cos(this.angle) * this.distance;
      const targetY = Math.sin(this.angle) * this.distance;
      this.x = lerp(this.x, targetX, 0.1);
      this.y = lerp(this.y, targetY, 0.1);
    } else {
      // Free floating particles with mouse influence
      const dx = (mouseX - this.canvasWidth / 2) * 0.1;
      const dy = (mouseY - this.canvasHeight / 2) * 0.1;
      this.x += Math.sin(this.angle + this.distance) * 0.2 + dx * 0.01;
      this.y += Math.cos(this.angle + this.distance) * 0.2 + dy * 0.01;

      // Wrap around edges
      if (this.x > this.canvasWidth / 2) this.x = -this.canvasWidth / 2;
      if (this.x < -this.canvasWidth / 2) this.x = this.canvasWidth / 2;
      if (this.y > this.canvasHeight / 2) this.y = -this.canvasHeight / 2;
      if (this.y < -this.canvasHeight / 2) this.y = this.canvasHeight / 2;
    }

    // Smooth brightness transition
    this.brightness = lerp(this.brightness, this.targetBrightness, 0.05);
    if (Math.abs(this.brightness - this.targetBrightness) < 0.01) {
      this.targetBrightness = Math.random();
    }
  }

  draw() {
    const gradient = this.ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius
    );
    gradient.addColorStop(0, `${this.color}${Math.floor(this.brightness * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, `${this.color}00`);
    
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    // Draw connection lines to nearby particles
    if (this.isOrbiting) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(this.x, this.y);
      this.ctx.strokeStyle = `${this.color}${Math.floor(this.brightness * 40).toString(16).padStart(2, '0')}`;
      this.ctx.stroke();
    }

    this.lastX = this.x;
    this.lastY = this.y;
  }
}

export default function NeuralCore() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef();
  const controls = useAnimation();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = 300 * dpr;
    const height = 300 * dpr;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = '300px';
    canvas.style.height = '300px';

    ctx.scale(dpr, dpr);

    // Create particles
    particlesRef.current = Array.from({ length: 50 }, () => {
      return new Particle(
        0, 0, // Start at center
        Math.random() * 3 + 2, // Random radius
        '#3b82f6', // Blue color
        ctx,
        width,
        height
      );
    });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Draw core glow
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
      gradient.addColorStop(0, '#3b82f680');
      gradient.addColorStop(1, '#3b82f600');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(mousePos.x, mousePos.y);
        particle.draw();
      });

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <CanvasContainer>
      <Canvas ref={canvasRef} />
    </CanvasContainer>
  );
} 