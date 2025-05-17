import React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
  backdropFilter: 'blur(8px)',
  backgroundColor: theme.palette.background.card,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.palette.mode === 'light'
    ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    : 'none',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'visible',
}));

const StyledTextArea = styled('textarea')(({ theme }) => ({
  width: '100%',
  minHeight: '200px',
  padding: '1rem',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(15, 23, 42, 0.5)',
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: '1rem',
  resize: 'vertical',
  outline: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:focus': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
  },
}));

const ResultBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'light'
    ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(15, 23, 42, 0.5)',
  border: `1px solid ${theme.palette.divider}`,
}));

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

export default function ToolCard({
  title,
  description,
  inputPlaceholder,
  onSubmit,
  loading,
  result,
  inputValue,
  onInputChange,
  actionText = 'Generate',
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <StyledCard>
        <Box sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #60a5fa, #818cf8)'
                : 'linear-gradient(45deg, #2563eb, #4f46e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 4 }}
          >
            {description}
          </Typography>

          <StyledTextArea
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={onInputChange}
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={loading || !inputValue.trim()}
              sx={{
                minWidth: 120,
                position: 'relative',
              }}
            >
              {loading ? (
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: (theme) => theme.palette.primary.contrastText 
                  }} 
                />
              ) : actionText}
            </Button>
          </Box>

          {result && (
            <ResultBox>
              <Typography 
                variant="body1"
                component="div" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  fontFamily: (theme) => theme.typography.fontFamily,
                }}
              >
                {result}
              </Typography>
            </ResultBox>
          )}
        </Box>
      </StyledCard>
    </motion.div>
  );
} 