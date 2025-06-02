import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const ToastContext = createContext({
  showToast: () => {},
});

const ToastContainer = styled('div')({
  position: 'fixed',
  top: 24,
  right: 24,
  zIndex: 2000,
});

const ToastContent = styled(motion.div)(({ theme, type = 'success' }) => {
  const colors = {
    success: {
      bg: theme.palette.mode === 'light' ? '#ecfdf5' : '#064e3b',
      border: theme.palette.mode === 'light' ? '#6ee7b7' : '#34d399',
      text: theme.palette.mode === 'light' ? '#065f46' : '#d1fae5',
    },
    error: {
      bg: theme.palette.mode === 'light' ? '#fef2f2' : '#7f1d1d',
      border: theme.palette.mode === 'light' ? '#fca5a5' : '#f87171',
      text: theme.palette.mode === 'light' ? '#991b1b' : '#fee2e2',
    },
    info: {
      bg: theme.palette.mode === 'light' ? '#eff6ff' : '#172554',
      border: theme.palette.mode === 'light' ? '#93c5fd' : '#3b82f6',
      text: theme.palette.mode === 'light' ? '#1e40af' : '#dbeafe',
    },
  };

  return {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    borderRadius: 12,
    backgroundColor: colors[type].bg,
    border: `1px solid ${colors[type].border}`,
    color: colors[type].text,
    boxShadow: theme.palette.mode === 'light'
      ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
      : 'none',
    marginBottom: 8,
    minWidth: 300,
    maxWidth: 500,
  };
});

const IconWrapper = styled('div')({
  marginRight: 12,
  display: 'flex',
  alignItems: 'center',
});

const Message = styled('div')({
  flex: 1,
  marginRight: 12,
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer>
        <AnimatePresence>
          {toasts.map(({ id, message, type }) => (
            <ToastContent
              key={id}
              type={type}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <IconWrapper>
                {type === 'success' && <CheckCircleIcon />}
                {type === 'error' && <ErrorIcon />}
                {type === 'info' && <InfoIcon />}
              </IconWrapper>
              <Message>{message}</Message>
              <IconButton
                size="small"
                onClick={() => removeToast(id)}
                sx={{ color: 'inherit', opacity: 0.7 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </ToastContent>
          ))}
        </AnimatePresence>
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 