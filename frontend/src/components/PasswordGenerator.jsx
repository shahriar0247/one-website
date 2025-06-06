import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import {
  KeyIcon,
  ArrowPathIcon,
  ClipboardIcon,
  CheckIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
  });
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState('');

  const generatePassword = () => {
    let chars = '';
    
    if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.numbers) chars += '0123456789';
    if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setPassword('');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(result);
  };

  const calculateStrength = (pass) => {
    let score = 0;
    
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Fair';
    if (score <= 5) return 'Good';
    return 'Strong';
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const updateOption = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  useEffect(() => {
    if (password) {
      setStrength(calculateStrength(password));
    }
  }, [password]);

  const strengthColors = {
    'Weak': 'text-red-500',
    'Fair': 'text-yellow-500',
    'Good': 'text-blue-500',
    'Strong': 'text-green-500',
  };

  return (
    <ToolPage
      title="Password Generator"
      description="Generate secure passwords with customizable options and strength analysis."
    >
      <div className="space-y-8">
        {/* Generated Password Display */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Generated Password
          </h3>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex-1 font-mono text-lg break-all">
              {password}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                )}
              >
                {copied ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <ClipboardIcon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={generatePassword}
                className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowPathIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Strength Indicator */}
          {password && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password Strength:
              </span>
              <span className={cn("text-sm font-medium", strengthColors[strength])}>
                {strength}
              </span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Settings */}
          <div className="space-y-6">
            {/* Length Setting */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Password Length: {length}
              </h3>
              <input
                type="range"
                min="4"
                max="50"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>4</span>
                <span>50</span>
              </div>
            </div>

            {/* Character Options */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Character Options
              </h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={options.lowercase}
                    onChange={(e) => updateOption('lowercase', e.target.checked)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">Lowercase letters (a-z)</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={options.uppercase}
                    onChange={(e) => updateOption('uppercase', e.target.checked)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">Uppercase letters (A-Z)</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={options.numbers}
                    onChange={(e) => updateOption('numbers', e.target.checked)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">Numbers (0-9)</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={options.symbols}
                    onChange={(e) => updateOption('symbols', e.target.checked)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">Symbols (!@#$%^&*)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Tips */}
          <div className="space-y-6">
            {/* Security Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Security Tips
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Use unique passwords for each account</li>
                <li>• Enable two-factor authentication when possible</li>
                <li>• Consider using a password manager</li>
                <li>• Avoid using personal information in passwords</li>
                <li>• Update passwords regularly</li>
              </ul>
            </div>

            {/* Strength Guidelines */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Strength Guidelines
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>12+ characters with mixed case, numbers, and symbols</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>8+ characters with variety</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>6+ characters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Less than 6 characters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
} 