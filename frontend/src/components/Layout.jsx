import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '../theme/ThemeProvider';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SummarizeIcon from '@mui/icons-material/Summarize';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import { motion } from 'framer-motion';

const drawerWidth = 280;

const MotionListItem = styled(motion.div)({
  width: '100%',
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backdropFilter: 'blur(8px)',
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(15, 23, 42, 0.8)',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const tools = [
  { path: '/word-counter', label: 'Word Counter', icon: <FormatSizeIcon /> },
  { path: '/grammar-checker', label: 'Grammar Checker', icon: <SpellcheckIcon /> },
  { path: '/paraphraser', label: 'Paraphraser', icon: <AutoFixHighIcon /> },
  { path: '/summarizer', label: 'Summarizer', icon: <SummarizeIcon /> },
  { path: '/case-converter', label: 'Case Converter', icon: <TextFieldsIcon /> },
  { path: '/remove-line-breaks', label: 'Remove Line Breaks', icon: <FormatClearIcon /> },
];

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
};

export default function Layout({ children }) {
  const location = useLocation();
  const { mode, toggleMode } = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <StyledAppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontWeight: 700,
              background: mode === 'dark' 
                ? 'linear-gradient(45deg, #60a5fa, #818cf8)' 
                : 'linear-gradient(45deg, #2563eb, #4f46e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            One-Use Tools
          </Typography>
          <IconButton onClick={toggleMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            backdropFilter: 'blur(8px)',
            backgroundColor: (theme) => theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(15, 23, 42, 0.8)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', px: 2, py: 3 }}>
          <List>
            {tools.map((tool, index) => (
              <MotionListItem
                key={tool.path}
                initial="hidden"
                animate="visible"
                custom={index}
                variants={listItemVariants}
              >
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component={RouterLink}
                    to={tool.path}
                    selected={location.pathname === tool.path}
                    sx={{
                      borderRadius: 2,
                      '&.Mui-selected': {
                        backgroundColor: (theme) => theme.palette.mode === 'light'
                          ? 'rgba(37, 99, 235, 0.08)'
                          : 'rgba(59, 130, 246, 0.08)',
                        '&:hover': {
                          backgroundColor: (theme) => theme.palette.mode === 'light'
                            ? 'rgba(37, 99, 235, 0.12)'
                            : 'rgba(59, 130, 246, 0.12)',
                        },
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: (theme) => location.pathname === tool.path 
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary
                      }}
                    >
                      {tool.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={tool.label}
                      primaryTypographyProps={{
                        fontWeight: location.pathname === tool.path ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </MotionListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          minHeight: '100vh',
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
} 