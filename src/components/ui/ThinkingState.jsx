import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import NeuralCore from './NeuralCore';
import ThoughtTimeline from './ThoughtTimeline';

const Container = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  background: theme.palette.mode === 'light'
    ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(15, 23, 42, 0.8)',
  borderRadius: theme.shape.borderRadius * 2,
  backdropFilter: 'blur(8px)',
  border: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  overflow: 'hidden',
}));

const ThoughtBubble = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2, 3),
  background: theme.palette.mode === 'light'
    ? 'rgba(255, 255, 255, 0.9)'
    : 'rgba(15, 23, 42, 0.9)',
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(3),
  maxWidth: '80%',
  textAlign: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-8px',
    left: '50%',
    transform: 'translateX(-50%) rotate(45deg)',
    width: '16px',
    height: '16px',
    background: 'inherit',
  },
}));

const EdgeFlicker = styled(motion.div)(({ theme, position }) => ({
  position: 'absolute',
  [position]: 0,
  width: position === 'left' || position === 'right' ? '2px' : '100%',
  height: position === 'top' || position === 'bottom' ? '2px' : '100%',
  background: `linear-gradient(${position === 'left' || position === 'right' ? '180deg' : '90deg'}, 
    ${theme.palette.primary.main}00,
    ${theme.palette.primary.main}40,
    ${theme.palette.primary.main}00)`,
  opacity: 0,
}));

const thinkingStates = [
  { emoji: '🤖', text: 'Reading and analyzing your document...' },
  { emoji: '🧠', text: 'Identifying key themes and insights...' },
  { emoji: '🔍', text: 'Extracting core concepts...' },
  { emoji: '📊', text: 'Organizing information...' },
  { emoji: '✨', text: 'Crafting the perfect summary...' },
];

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex]);

  return displayText;
};

export default function ThinkingState({ currentStep = 0 }) {
  const [flickerEdge, setFlickerEdge] = useState(null);
  const progress = (currentStep / (thinkingStates.length - 1)) * 100;

  useEffect(() => {
    if (currentStep > 0) {
      const edges = ['top', 'right', 'bottom', 'left'];
      const randomEdge = edges[Math.floor(Math.random() * edges.length)];
      setFlickerEdge(randomEdge);
      
      const timeout = setTimeout(() => {
        setFlickerEdge(null);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [currentStep]);

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {['top', 'right', 'bottom', 'left'].map(position => (
        <EdgeFlicker
          key={position}
          position={position}
          animate={{
            opacity: flickerEdge === position ? [0, 1, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}

      <NeuralCore />
      
      <AnimatePresence mode="wait">
        {thinkingStates[currentStep] && (
          <ThoughtBubble
            key={currentStep}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" component="span" sx={{ mr: 1 }}>
              {thinkingStates[currentStep].emoji}
            </Typography>
            <Typography variant="body1" component="span">
              <TypewriterText text={thinkingStates[currentStep].text} />
            </Typography>
          </ThoughtBubble>
        )}
      </AnimatePresence>

      <ThoughtTimeline currentStep={currentStep + 1} progress={progress} />
    </Container>
  );
} 