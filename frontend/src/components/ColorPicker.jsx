import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { 
  ClipboardDocumentIcon,
  CheckIcon,
  EyeDropperIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { cn } from '../utils/cn';

export default function ColorPicker() {
  const [color, setColor] = useState('#3b82f6');
  const [copiedFormat, setCopiedFormat] = useState(null);

  const handleCopy = useCallback(async (text, format) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, []);

  const rgbColor = {
    r: parseInt(color.slice(1, 3), 16),
    g: parseInt(color.slice(3, 5), 16),
    b: parseInt(color.slice(5, 7), 16),
  };

  const hslColor = (() => {
    const r = rgbColor.r / 255;
    const g = rgbColor.g / 255;
    const b = rgbColor.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  })();

  const colorFormats = [
    {
      label: 'HEX',
      value: color.toUpperCase(),
      description: 'Hexadecimal color code',
    },
    {
      label: 'RGB',
      value: `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`,
      description: 'Red, Green, Blue values',
    },
    {
      label: 'RGBA',
      value: `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 1.0)`,
      description: 'RGB with alpha channel',
    },
    {
      label: 'HSL',
      value: `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`,
      description: 'Hue, Saturation, Lightness',
    },
    {
      label: 'CSS Variable',
      value: `--color-primary: ${color};`,
      description: 'CSS custom property',
    },
    {
      label: 'Tailwind',
      value: `bg-[${color}]`,
      description: 'Tailwind arbitrary value',
    },
  ];

  const presetColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="glass-card overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mr-4">
                <SwatchIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold gradient-text">
                  Color Picker
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                  Pick colors and get their values in multiple formats
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Color Picker Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <div className="flex items-center mb-4">
                  <EyeDropperIcon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Color Picker
                  </h3>
                </div>
                
                <div className="mb-6">
                  <HexColorPicker 
                    color={color} 
                    onChange={setColor}
                    style={{
                      width: '100%',
                      height: '200px',
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      HEX Value
                    </label>
                    <HexColorInput
                      color={color}
                      onChange={setColor}
                      prefixed
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color Preview
                    </label>
                    <motion.div
                      style={{ backgroundColor: color }}
                      className="w-full h-20 rounded-lg border border-gray-300 dark:border-gray-700 shadow-inner"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>
              </div>

              {/* Preset Colors */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Preset Colors
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {presetColors.map((presetColor) => (
                    <motion.button
                      key={presetColor}
                      onClick={() => setColor(presetColor)}
                      style={{ backgroundColor: presetColor }}
                      className={cn(
                        "w-12 h-12 rounded-lg border-2 transition-all duration-200",
                        color === presetColor 
                          ? "border-gray-900 dark:border-gray-100 scale-110" 
                          : "border-gray-300 dark:border-gray-700 hover:scale-105"
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Color Formats Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4"
            >
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Color Formats
                </h3>
                <div className="space-y-4">
                  {colorFormats.map(({ label, value, description }, index) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {label}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {description}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={value}
                          readOnly
                          className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-gray-900 dark:text-gray-100 focus:outline-none"
                        />
                        <motion.button
                          onClick={() => handleCopy(value, label)}
                          className={cn(
                            "p-2 rounded-lg transition-all duration-200",
                            copiedFormat === label
                              ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <AnimatePresence mode="wait">
                            {copiedFormat === label ? (
                              <motion.div
                                key="check"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <CheckIcon className="w-4 h-4" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="copy"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <ClipboardDocumentIcon className="w-4 h-4" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Color Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Color Analysis
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {Math.round((rgbColor.r * 0.299 + rgbColor.g * 0.587 + rgbColor.b * 0.114))}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Brightness</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {hslColor.s}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Saturation</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 