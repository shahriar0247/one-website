import React from 'react';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Container = styled(motion.div)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
}));

const Timeline = styled('div')(({ theme }) => ({
  width: '100%',
  height: '2px',
  background: theme.palette.mode === 'light'
    ? 'rgba(59, 130, 246, 0.1)'
    : 'rgba(59, 130, 246, 0.2)',
  position: 'relative',
  marginTop: theme.spacing(6),
}));

const Progress = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  filter: 'blur(1px)',
}));

const Checkpoint = styled(motion.div)(({ theme, active, completed }) => ({
  position: 'absolute',
  top: '50%',
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: completed
    ? theme.palette.primary.main
    : active
      ? theme.palette.secondary.main
      : theme.palette.mode === 'light'
        ? 'rgba(59, 130, 246, 0.2)'
        : 'rgba(59, 130, 246, 0.3)',
  transform: 'translate(-50%, -50%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: active ? `2px solid ${theme.palette.secondary.main}` : 'none',
    transform: 'translate(-50%, -50%)',
    animation: active ? 'pulse 2s infinite' : 'none',
  },
}));

const Label = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  top: '-40px',
  transform: 'translateX(-50%)',
  textAlign: 'center',
  width: '120px',
}));

const steps = [
  { id: 1, label: 'Reading', position: 0 },
  { id: 2, label: 'Analyzing', position: 33 },
  { id: 3, label: 'Extracting Ideas', position: 66 },
  { id: 4, label: 'Finalizing', position: 100 },
];

export default function ThoughtTimeline({ currentStep = 1, progress = 0 }) {
  return (
    <Container>
      <Timeline>
        <Progress
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <React.Fragment key={step.id}>
              <Checkpoint
                style={{ left: `${step.position}%` }}
                active={isActive}
                completed={isCompleted}
                animate={isActive ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <Label
                style={{ left: `${step.position}%` }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isActive || isCompleted ? 1 : 0.5,
                  y: isActive ? 0 : 10,
                }}
                transition={{ duration: 0.3 }}
              >
                <Typography
                  variant="caption"
                  color={isActive ? 'primary' : 'textSecondary'}
                  sx={{
                    fontWeight: isActive ? 600 : 400,
                    fontSize: isActive ? '0.875rem' : '0.75rem',
                  }}
                >
                  {step.label}
                </Typography>
              </Label>
            </React.Fragment>
          );
        })}
      </Timeline>
    </Container>
  );
} 