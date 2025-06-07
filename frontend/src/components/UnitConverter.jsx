import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import { 
  ArrowsRightLeftIcon,
  ArrowPathIcon,
  StarIcon as StarOutlineIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const UNIT_CATEGORIES = [
  {
    id: 'length',
    name: 'Length',
    icon: '📏',
    units: [
      { id: 'km', name: 'Kilometers', factor: 1000 },
      { id: 'm', name: 'Meters', factor: 1 },
      { id: 'cm', name: 'Centimeters', factor: 0.01 },
      { id: 'mm', name: 'Millimeters', factor: 0.001 },
      { id: 'mi', name: 'Miles', factor: 1609.34 },
      { id: 'yd', name: 'Yards', factor: 0.9144 },
      { id: 'ft', name: 'Feet', factor: 0.3048 },
      { id: 'in', name: 'Inches', factor: 0.0254 },
    ],
  },
  {
    id: 'mass',
    name: 'Mass',
    icon: '⚖️',
    units: [
      { id: 'kg', name: 'Kilograms', factor: 1 },
      { id: 'g', name: 'Grams', factor: 0.001 },
      { id: 'mg', name: 'Milligrams', factor: 0.000001 },
      { id: 'lb', name: 'Pounds', factor: 0.453592 },
      { id: 'oz', name: 'Ounces', factor: 0.0283495 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: '🌡️',
    units: [
      { id: 'c', name: 'Celsius' },
      { id: 'f', name: 'Fahrenheit' },
      { id: 'k', name: 'Kelvin' },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: '🥛',
    units: [
      { id: 'l', name: 'Liters', factor: 1 },
      { id: 'ml', name: 'Milliliters', factor: 0.001 },
      { id: 'gal', name: 'Gallons (US)', factor: 3.78541 },
      { id: 'qt', name: 'Quarts (US)', factor: 0.946353 },
      { id: 'pt', name: 'Pints (US)', factor: 0.473176 },
      { id: 'cup', name: 'Cups (US)', factor: 0.236588 },
      { id: 'floz', name: 'Fluid Ounces (US)', factor: 0.0295735 },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    icon: '📐',
    units: [
      { id: 'km2', name: 'Square Kilometers', factor: 1000000 },
      { id: 'm2', name: 'Square Meters', factor: 1 },
      { id: 'cm2', name: 'Square Centimeters', factor: 0.0001 },
      { id: 'mm2', name: 'Square Millimeters', factor: 0.000001 },
      { id: 'ha', name: 'Hectares', factor: 10000 },
      { id: 'ac', name: 'Acres', factor: 4046.86 },
      { id: 'mi2', name: 'Square Miles', factor: 2589988.11 },
      { id: 'ft2', name: 'Square Feet', factor: 0.092903 },
      { id: 'in2', name: 'Square Inches', factor: 0.00064516 },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    icon: '⏰',
    units: [
      { id: 'yr', name: 'Years', factor: 31536000 },
      { id: 'mo', name: 'Months', factor: 2592000 },
      { id: 'wk', name: 'Weeks', factor: 604800 },
      { id: 'd', name: 'Days', factor: 86400 },
      { id: 'h', name: 'Hours', factor: 3600 },
      { id: 'min', name: 'Minutes', factor: 60 },
      { id: 's', name: 'Seconds', factor: 1 },
      { id: 'ms', name: 'Milliseconds', factor: 0.001 },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: '🏃',
    units: [
      { id: 'mps', name: 'Meters per Second', factor: 1 },
      { id: 'kph', name: 'Kilometers per Hour', factor: 0.277778 },
      { id: 'mph', name: 'Miles per Hour', factor: 0.44704 },
      { id: 'fps', name: 'Feet per Second', factor: 0.3048 },
      { id: 'knot', name: 'Knots', factor: 0.514444 },
    ],
  },
];

export default function UnitConverter() {
  const [selectedCategory, setSelectedCategory] = useState(UNIT_CATEGORIES[0]);
  const [fromUnit, setFromUnit] = useState(selectedCategory.units[0]);
  const [toUnit, setToUnit] = useState(selectedCategory.units[1]);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('unitConverterFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Load history from localStorage
    const savedHistory = localStorage.getItem('unitConverterHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    // Save favorites to localStorage
    localStorage.setItem('unitConverterFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    // Save history to localStorage
    localStorage.setItem('unitConverterHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    // Reset units when category changes
    setFromUnit(selectedCategory.units[0]);
    setToUnit(selectedCategory.units[1]);
    setFromValue('');
    setToValue('');
  }, [selectedCategory]);

  const convert = (value, from, to) => {
    if (!value || isNaN(value)) return '';

    if (selectedCategory.id === 'temperature') {
      // Special handling for temperature
      let celsius;
      switch (from.id) {
        case 'c':
          celsius = value;
          break;
        case 'f':
          celsius = (value - 32) * 5/9;
          break;
        case 'k':
          celsius = value - 273.15;
          break;
      }

      switch (to.id) {
        case 'c':
          return celsius.toFixed(2);
        case 'f':
          return ((celsius * 9/5) + 32).toFixed(2);
        case 'k':
          return (celsius + 273.15).toFixed(2);
      }
    } else {
      // Standard conversion using factors
      const baseValue = value * from.factor;
      return (baseValue / to.factor).toFixed(4);
    }
  };

  const handleFromValueChange = (value) => {
    setFromValue(value);
    const result = convert(value, fromUnit, toUnit);
    setToValue(result);

    if (value && result) {
      const conversion = {
        timestamp: new Date().toISOString(),
        category: selectedCategory.id,
        from: { value, unit: fromUnit.id },
        to: { value: result, unit: toUnit.id },
      };
      setHistory(prev => [conversion, ...prev].slice(0, 10));
    }
  };

  const handleToValueChange = (value) => {
    setToValue(value);
    const result = convert(value, toUnit, fromUnit);
    setFromValue(result);

    if (value && result) {
      const conversion = {
        timestamp: new Date().toISOString(),
        category: selectedCategory.id,
        from: { value: result, unit: fromUnit.id },
        to: { value, unit: toUnit.id },
      };
      setHistory(prev => [conversion, ...prev].slice(0, 10));
    }
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const toggleFavorite = () => {
    const favorite = {
      category: selectedCategory.id,
      fromUnit: fromUnit.id,
      toUnit: toUnit.id,
    };
    const key = `${favorite.category}:${favorite.fromUnit}:${favorite.toUnit}`;
    
    setFavorites(prev => {
      const exists = prev.some(f => 
        `${f.category}:${f.fromUnit}:${f.toUnit}` === key
      );
      
      if (exists) {
        return prev.filter(f => 
          `${f.category}:${f.fromUnit}:${f.toUnit}` !== key
        );
      } else {
        return [...prev, favorite];
      }
    });
  };

  const isFavorite = () => {
    return favorites.some(f =>
      f.category === selectedCategory.id &&
      f.fromUnit === fromUnit.id &&
      f.toUnit === toUnit.id
    );
  };

  const copyToClipboard = () => {
    if (!fromValue || !toValue) return;
    
    const text = `${fromValue} ${fromUnit.name} = ${toValue} ${toUnit.name}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPage
      title="Unit Converter"
      description="Convert between different units of measurement with precision."
    >
      <div className="space-y-8">
        {/* Category Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {UNIT_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-200 text-center",
                category.id === selectedCategory.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              <span className="text-2xl mb-2 block">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="space-y-6">
            {/* From Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From
              </label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={fromUnit.id}
                  onChange={(e) => setFromUnit(selectedCategory.units.find(u => u.id === e.target.value))}
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {selectedCategory.units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
                <input
                type="number"
                value={fromValue}
                  onChange={(e) => handleFromValueChange(e.target.value)}
                  placeholder="Enter value"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapUnits}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowsRightLeftIcon className="w-6 h-6" />
              </button>
            </div>

            {/* To Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To
              </label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={toUnit.id}
                  onChange={(e) => setToUnit(selectedCategory.units.find(u => u.id === e.target.value))}
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {selectedCategory.units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                value={toValue}
                  onChange={(e) => handleToValueChange(e.target.value)}
                  placeholder="Enter value"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <button
                onClick={toggleFavorite}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isFavorite()
                    ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                )}
              >
                {isFavorite() ? (
                  <StarSolidIcon className="w-6 h-6" />
                ) : (
                  <StarOutlineIcon className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={copyToClipboard}
                disabled={!fromValue || !toValue}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  copied
                    ? "text-green-500"
                    : fromValue && toValue
                    ? "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                )}
              >
                {copied ? (
                  <CheckIcon className="w-6 h-6" />
                ) : (
                  <ClipboardIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-5 h-5 text-gray-400" />
              <span className="font-medium">Recent Conversions</span>
            </div>
            {showHistory ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 space-y-2"
              >
                {history.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent conversions
                  </p>
                ) : (
                  history.map((item, index) => {
                    const category = UNIT_CATEGORIES.find(c => c.id === item.category);
                    const fromUnit = category.units.find(u => u.id === item.from.unit);
                    const toUnit = category.units.find(u => u.id === item.to.unit);

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div>
                          <span className="text-sm">
                            {item.from.value} {fromUnit.name} = {item.to.value} {toUnit.name}
                          </span>
                          <p className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setFromUnit(fromUnit);
                            setToUnit(toUnit);
                            setFromValue(item.from.value);
                            setToValue(item.to.value);
                          }}
                          className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <ArrowPathIcon className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="font-medium mb-4 flex items-center space-x-2">
              <StarSolidIcon className="w-5 h-5 text-yellow-500" />
              <span>Favorite Conversions</span>
            </h3>

            <div className="grid gap-2">
              {favorites.map((favorite, index) => {
                const category = UNIT_CATEGORIES.find(c => c.id === favorite.category);
                const fromUnit = category.units.find(u => u.id === favorite.fromUnit);
                const toUnit = category.units.find(u => u.id === favorite.toUnit);

                return (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedCategory(category);
                      setFromUnit(fromUnit);
                      setToUnit(toUnit);
                      setFromValue('');
                      setToValue('');
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span>
                        {fromUnit.name} → {toUnit.name}
                      </span>
                    </div>
                    <ArrowPathIcon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ToolPage>
  );
} 