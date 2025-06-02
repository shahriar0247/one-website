import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const Container = styled(motion.div)(({ theme }) => ({
  background: theme.palette.mode === 'light'
    ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(15, 23, 42, 0.8)',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${theme.palette.divider}`,
}));

const InsightContainer = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  background: theme.palette.mode === 'light'
    ? 'rgba(255, 255, 255, 0.5)'
    : 'rgba(15, 23, 42, 0.5)',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  overflow: 'hidden',
}));

const ConfidenceMeter = styled(motion.div)(({ theme, confidence }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  background: theme.palette.mode === 'light'
    ? `linear-gradient(90deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}10)`
    : `linear-gradient(90deg, ${theme.palette.primary.main}40, ${theme.palette.primary.main}20)`,
  width: `${confidence}%`,
  zIndex: 0,
}));

const InsightContent = styled(Box)({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const GlowingIcon = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: theme.palette.mode === 'light'
    ? 'rgba(255, 255, 255, 0.9)'
    : 'rgba(15, 23, 42, 0.9)',
  boxShadow: `0 0 10px ${theme.palette.primary.main}40`,
  marginBottom: theme.spacing(2),
}));

export default function UnderstandingPanel({ insights }) {
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <GlowingIcon
          animate={{
            boxShadow: [
              '0 0 10px rgba(59, 130, 246, 0.4)',
              '0 0 20px rgba(59, 130, 246, 0.6)',
              '0 0 10px rgba(59, 130, 246, 0.4)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <LightbulbIcon color="primary" />
        </GlowingIcon>
        <Typography variant="h6" sx={{ ml: 2 }}>
          What I Understood
        </Typography>
      </Box>

      <AnimatePresence>
        {insights.map((insight, index) => (
          <InsightContainer
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ConfidenceMeter
              confidence={insight.confidence}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            />
            <InsightContent>
              <Typography variant="body1">
                {insight.text}
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ ml: 2, minWidth: 60 }}
              >
                {insight.confidence}%
              </Typography>
            </InsightContent>
          </InsightContainer>
        ))}
      </AnimatePresence>
    </Container>
  );
} 