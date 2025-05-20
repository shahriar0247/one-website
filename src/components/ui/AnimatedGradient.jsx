import React from 'react';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const GradientContainer = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  zIndex: -1,
  opacity: 0.5,
});

const GradientBlob = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  width: '50%',
  height: '50%',
  background: theme.palette.mode === 'light'
    ? 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, rgba(79, 70, 229, 0.05) 50%, transparent 70%)'
    : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)',
  borderRadius: '50%',
  filter: 'blur(40px)',
}));

export default function AnimatedGradient() {
  return (
    <GradientContainer>
      <GradientBlob
        initial={{ x: '0%', y: '0%' }}
        animate={{
          x: ['0%', '50%', '0%', '-50%', '0%'],
          y: ['0%', '25%', '50%', '25%', '0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <GradientBlob
        initial={{ x: '50%', y: '50%' }}
        animate={{
          x: ['50%', '0%', '-50%', '0%', '50%'],
          y: ['50%', '25%', '0%', '25%', '50%'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </GradientContainer>
  );
} 