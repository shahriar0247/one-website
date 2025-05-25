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
import { useTheme } from '../../theme/ThemeProvider';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Text Tool Icons
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FormatClearIcon from '@mui/icons-material/FormatClear';

// File Tool Icons
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import StorageIcon from '@mui/icons-material/Storage';

// Image Tool Icons
import ImageIcon from '@mui/icons-material/Image';
import CropIcon from '@mui/icons-material/Crop';
import TransformIcon from '@mui/icons-material/Transform';
import CompressIcon from '@mui/icons-material/Compress';

// AI Tool Icons
import ChatIcon from '@mui/icons-material/Chat';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FactCheckIcon from '@mui/icons-material/FactCheck';

// Productivity Tool Icons
import ColorLensIcon from '@mui/icons-material/ColorLens';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const drawerWidth = 280;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backdropFilter: 'blur(8px)',
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(15, 23, 42, 0.8)',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const tools = [
  // Text Tools
  { path: '/grammar-checker', label: 'Grammar Checker', icon: <SpellcheckIcon />, category: 'Text Tools' },
  { path: '/paraphrase', label: 'Paraphraser', icon: <AutoFixHighIcon />, category: 'Text Tools' },
  { path: '/case-converter', label: 'Case Converter', icon: <TextFieldsIcon />, category: 'Text Tools' },
  { path: '/line-breaks', label: 'Line Breaks Remover', icon: <FormatClearIcon />, category: 'Text Tools' },
  
  // File Tools
  { path: '/pdf-converter', label: 'PDF Converter', icon: <PictureAsPdfIcon />, category: 'File Tools' },
  { path: '/file-analyzer', label: 'File Size Analyzer', icon: <StorageIcon />, category: 'File Tools' },
  
  // Image Tools
  { path: '/image-to-text', label: 'Image to Text (OCR)', icon: <ImageIcon />, category: 'Image Tools' },
  { path: '/image-resizer', label: 'Image Resizer', icon: <CropIcon />, category: 'Image Tools' },
  { path: '/image-converter', label: 'Image Format Converter', icon: <TransformIcon />, category: 'Image Tools' },
  { path: '/image-compressor', label: 'Image Compressor', icon: <CompressIcon />, category: 'Image Tools' },
  
  // AI Tools
  { path: '/mini-gpt', label: 'AI Chat (MiniGPT)', icon: <ChatIcon />, category: 'AI Tools' },
  { path: '/tone-analyzer', label: 'Tone Analyzer', icon: <PsychologyIcon />, category: 'AI Tools' },
  { path: '/fake-news-detector', label: 'Fake News Detector', icon: <FactCheckIcon />, category: 'AI Tools' },
  
  // Productivity Tools
  { path: '/color-picker', label: 'Color Picker', icon: <ColorLensIcon />, category: 'Productivity Tools' },
  { path: '/qr-generator', label: 'QR Code Generator', icon: <QrCodeIcon />, category: 'Productivity Tools' },
  { path: '/unit-converter', label: 'Unit Converter', icon: <SwapHorizIcon />, category: 'Productivity Tools' },
];

// Group tools by category
const groupedTools = tools.reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = [];
  }
  acc[tool.category].push(tool);
  return acc;
}, {});

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
          {Object.entries(groupedTools).map(([category, categoryTools], categoryIndex) => (
            <React.Fragment key={category}>
              {categoryIndex > 0 && <Divider sx={{ my: 2 }} />}
              <Typography
                variant="overline"
                sx={{
                  px: 2,
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
              >
                {category}
              </Typography>
              <List>
                {categoryTools.map((tool) => (
                  <ListItem key={tool.path} disablePadding sx={{ mb: 1 }}>
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
                ))}
              </List>
            </React.Fragment>
          ))}
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