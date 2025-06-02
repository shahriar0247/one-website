import React, { createContext, useContext, useState } from 'react';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import SettingsIcon from '@mui/icons-material/Settings';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useTheme } from '../../theme/ThemeProvider';

const SettingsContext = createContext({
  fontSize: 16,
  setFontSize: () => {},
  fontFamily: 'Inter',
  setFontFamily: () => {},
  soundEnabled: true,
  setSoundEnabled: () => {},
});

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 320,
    padding: theme.spacing(3),
    background: theme.palette.mode === 'light'
      ? 'rgba(255, 255, 255, 0.9)'
      : 'rgba(15, 23, 42, 0.9)',
    backdropFilter: 'blur(8px)',
  },
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SettingRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
}));

export function SettingsProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { mode, toggleMode } = useTheme();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <SettingsContext.Provider value={{
      fontSize,
      setFontSize,
      fontFamily,
      setFontFamily,
      soundEnabled,
      setSoundEnabled,
    }}>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: (theme) => theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(8px)',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          '&:hover': {
            background: (theme) => theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 1)'
              : 'rgba(15, 23, 42, 1)',
          },
        }}
      >
        <SettingsIcon />
      </IconButton>

      <StyledDrawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Style Settings
        </Typography>

        <Section>
          <SettingRow>
            <Typography>Theme Mode</Typography>
            <Switch
              checked={mode === 'dark'}
              onChange={toggleMode}
            />
          </SettingRow>

          <SettingRow>
            <Typography>Sound Effects</Typography>
            <Switch
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              icon={<VolumeOffIcon />}
              checkedIcon={<VolumeUpIcon />}
            />
          </SettingRow>

          <SettingRow>
            <Typography>Font Size</Typography>
            <Box sx={{ width: 120 }}>
              <Slider
                value={fontSize}
                onChange={(e, value) => setFontSize(value)}
                min={12}
                max={20}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
          </SettingRow>

          <SettingRow>
            <Typography>Font Family</Typography>
            <FormControl size="small" sx={{ width: 120 }}>
              <Select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <MenuItem value="Inter">Inter</MenuItem>
                <MenuItem value="Mono">Mono</MenuItem>
                <MenuItem value="Serif">Serif</MenuItem>
              </Select>
            </FormControl>
          </SettingRow>
        </Section>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
          Changes are saved automatically
        </Typography>
      </StyledDrawer>

      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 