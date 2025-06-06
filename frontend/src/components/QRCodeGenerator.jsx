import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import QRCode from 'qrcode';
import {
  QrCodeIcon,
  ArrowDownTrayIcon,
  ClipboardIcon,
  CheckIcon,
  LinkIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  WifiIcon,
  CreditCardIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

const QR_TYPES = [
  {
    id: 'url',
    name: 'Website URL',
    icon: LinkIcon,
    placeholder: 'https://example.com',
  },
  {
    id: 'text',
    name: 'Plain Text',
    icon: QrCodeIcon,
    placeholder: 'Enter any text...',
  },
  {
    id: 'email',
    name: 'Email',
    icon: EnvelopeIcon,
    placeholder: 'email@example.com',
  },
  {
    id: 'phone',
    name: 'Phone Number',
    icon: PhoneIcon,
    placeholder: '+1234567890',
  },
  {
    id: 'wifi',
    name: 'WiFi Network',
    icon: WifiIcon,
    placeholder: 'Network Name',
  },
  {
    id: 'location',
    name: 'Location',
    icon: MapPinIcon,
    placeholder: 'Latitude, Longitude',
  },
];

const ERROR_CORRECTION_LEVELS = [
  { value: 'L', label: 'Low (~7%)' },
  { value: 'M', label: 'Medium (~15%)' },
  { value: 'Q', label: 'Quartile (~25%)' },
  { value: 'H', label: 'High (~30%)' },
];

const PRESET_COLORS = [
  { name: 'Classic', dark: '#000000', light: '#ffffff' },
  { name: 'Blue', dark: '#1e40af', light: '#dbeafe' },
  { name: 'Green', dark: '#16a34a', light: '#dcfce7' },
  { name: 'Purple', dark: '#9333ea', light: '#f3e8ff' },
  { name: 'Red', dark: '#dc2626', light: '#fee2e2' },
];

export default function QRCodeGenerator() {
  const [selectedType, setSelectedType] = useState(QR_TYPES[0]);
  const [inputValue, setInputValue] = useState('');
  const [extraFields, setExtraFields] = useState({});
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // QR Code options
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('M');
  const [margin, setMargin] = useState(4);
  const [scale, setScale] = useState(8);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');

  const formatContent = (type, value, extra) => {
    switch (type) {
      case 'email':
        return `mailto:${value}${extra.subject ? `?subject=${encodeURIComponent(extra.subject)}` : ''}`;
      case 'phone':
        return `tel:${value}`;
      case 'wifi':
        return `WIFI:T:${extra.security || 'WPA'};S:${value};P:${extra.password || ''};H:${extra.hidden ? 'true' : 'false'};;`;
      case 'location':
        return `geo:${value},${extra.longitude || '0'}`;
      default:
        return value;
    }
  };

  const generateQRCode = async () => {
    if (!inputValue.trim()) {
      setQrCode('');
      return;
    }

    setLoading(true);
    try {
      const content = formatContent(selectedType.id, inputValue, extraFields);

      const options = {
        errorCorrectionLevel,
        margin,
        scale,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      };

      const dataURL = await QRCode.toDataURL(content, options);
      setQrCode(dataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateQRCode();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, extraFields, selectedType, errorCorrectionLevel, margin, scale, darkColor, lightColor]);

  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrCode;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async () => {
    if (!qrCode) return;

    try {
      const response = await fetch(qrCode);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy QR code:', err);
    }
  };

  const applyColorPreset = (preset) => {
    setDarkColor(preset.dark);
    setLightColor(preset.light);
  };

  const renderExtraFields = () => {
    switch (selectedType.id) {
      case 'email':
        return (
          <input
            type="text"
            placeholder="Subject (optional)"
            value={extraFields.subject || ''}
            onChange={(e) => setExtraFields(prev => ({ ...prev, subject: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'wifi':
        return (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={extraFields.password || ''}
              onChange={(e) => setExtraFields(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={extraFields.security || 'WPA'}
              onChange={(e) => setExtraFields(prev => ({ ...prev, security: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password</option>
            </select>
          </div>
        );

      case 'location':
        return (
          <input
            type="text"
            placeholder="Longitude"
            value={extraFields.longitude || ''}
            onChange={(e) => setExtraFields(prev => ({ ...prev, longitude: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      default:
        return null;
    }
  };

  return (
    <ToolPage
      title="QR Code Generator"
      description="Generate QR codes for URLs, text, email, WiFi, and more with customization options."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          {/* Type Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              QR Code Type
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {QR_TYPES.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type);
                      setInputValue('');
                      setExtraFields({});
                    }}
                    className={cn(
                      "flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200",
                      selectedType.id === type.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-sm font-medium">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Fields */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Content
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder={selectedType.placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {renderExtraFields()}
            </div>
          </div>

          {/* Advanced Options */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full mb-4"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Advanced Options
              </h3>
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-400" />
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Error Correction */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Error Correction Level
                    </label>
                    <select
                      value={errorCorrectionLevel}
                      onChange={(e) => setErrorCorrectionLevel(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {ERROR_CORRECTION_LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Size Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Size: {scale}px per module
                      </label>
                      <input
                        type="range"
                        min="4"
                        max="20"
                        value={scale}
                        onChange={(e) => setScale(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Margin: {margin} modules
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={margin}
                        onChange={(e) => setMargin(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Color Presets */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color Presets
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {PRESET_COLORS.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => applyColorPreset(preset)}
                          className="flex flex-col items-center p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <div
                            className="w-6 h-6 rounded-full border mb-1"
                            style={{ backgroundColor: preset.dark }}
                          />
                          <span className="text-xs">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Foreground Color
                      </label>
                      <input
                        type="color"
                        value={darkColor}
                        onChange={(e) => setDarkColor(e.target.value)}
                        className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Background Color
                      </label>
                      <input
                        type="color"
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column - QR Code Display */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Generated QR Code
            </h3>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="text-gray-500">Generating...</span>
                  </div>
                ) : qrCode ? (
                  <img src={qrCode} alt="Generated QR Code" className="max-w-full h-auto" />
                ) : (
                  <div className="text-center">
                    <QrCodeIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Enter content to generate QR code</p>
                  </div>
                )}
              </div>

              {qrCode && (
                <div className="flex space-x-4">
                  <button
                    onClick={downloadQRCode}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                  
                  <button
                    onClick={copyToClipboard}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    )}
                  >
                    {copied ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <ClipboardIcon className="w-5 h-5" />
                    )}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              QR Code Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Support for URLs, text, email, phone, WiFi</li>
              <li>• Customizable colors and error correction levels</li>
              <li>• High-quality PNG output with adjustable size</li>
              <li>• Copy to clipboard or download functionality</li>
              <li>• Real-time preview as you type</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolPage>
  );
} 