import React, { useState, useEffect } from 'react';
import ToolPage from './ui/ToolPage';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const UNIT_CATEGORIES = {
  length: {
    name: 'Length',
    units: [
      { value: 'mm', label: 'Millimeters (mm)' },
      { value: 'cm', label: 'Centimeters (cm)' },
      { value: 'm', label: 'Meters (m)' },
      { value: 'km', label: 'Kilometers (km)' },
      { value: 'in', label: 'Inches (in)' },
      { value: 'ft', label: 'Feet (ft)' },
      { value: 'yd', label: 'Yards (yd)' },
      { value: 'mi', label: 'Miles (mi)' },
    ],
  },
  weight: {
    name: 'Weight',
    units: [
      { value: 'mg', label: 'Milligrams (mg)' },
      { value: 'g', label: 'Grams (g)' },
      { value: 'kg', label: 'Kilograms (kg)' },
      { value: 'oz', label: 'Ounces (oz)' },
      { value: 'lb', label: 'Pounds (lb)' },
      { value: 't', label: 'Metric Tons (t)' },
    ],
  },
  temperature: {
    name: 'Temperature',
    units: [
      { value: 'c', label: 'Celsius (°C)' },
      { value: 'f', label: 'Fahrenheit (°F)' },
      { value: 'k', label: 'Kelvin (K)' },
    ],
  },
  volume: {
    name: 'Volume',
    units: [
      { value: 'ml', label: 'Milliliters (ml)' },
      { value: 'l', label: 'Liters (l)' },
      { value: 'gal', label: 'Gallons (gal)' },
      { value: 'qt', label: 'Quarts (qt)' },
      { value: 'pt', label: 'Pints (pt)' },
      { value: 'cup', label: 'Cups' },
      { value: 'floz', label: 'Fluid Ounces (fl oz)' },
    ],
  },
  area: {
    name: 'Area',
    units: [
      { value: 'mm2', label: 'Square Millimeters (mm²)' },
      { value: 'cm2', label: 'Square Centimeters (cm²)' },
      { value: 'm2', label: 'Square Meters (m²)' },
      { value: 'km2', label: 'Square Kilometers (km²)' },
      { value: 'in2', label: 'Square Inches (in²)' },
      { value: 'ft2', label: 'Square Feet (ft²)' },
      { value: 'yd2', label: 'Square Yards (yd²)' },
      { value: 'ac', label: 'Acres (ac)' },
      { value: 'ha', label: 'Hectares (ha)' },
    ],
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set default units when category changes
    const units = UNIT_CATEGORIES[category].units;
    setFromUnit(units[0].value);
    setToUnit(units[1].value);
    setFromValue('');
    setToValue('');
  }, [category]);

  const handleConvert = async () => {
    if (!fromValue || !fromUnit || !toUnit) return;

    try {
      const response = await fetch('http://localhost:5000/api/unit-converter/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: fromValue,
          from_unit: fromUnit,
          to_unit: toUnit,
          category,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setToValue(data.result);
        setError(null);
      } else {
        throw new Error(data.error || 'Conversion failed');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (fromValue) {
      handleConvert();
    } else {
      setToValue('');
    }
  }, [fromValue, fromUnit, toUnit]);

  const handleSwapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  return (
    <ToolPage
      title="Unit Converter"
      description="Convert between different units of measurement with high precision."
      icon={<SwapHorizIcon />}
    >
      <Paper sx={{ p: 3 }}>
        <Tabs
          value={category}
          onChange={(e, newValue) => setCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 4 }}
        >
          {Object.entries(UNIT_CATEGORIES).map(([key, { name }]) => (
            <Tab key={key} value={key} label={name} />
          ))}
        </Tabs>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>From Unit</InputLabel>
                <Select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  label="From Unit"
                >
                  {UNIT_CATEGORIES[category].units.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Value"
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                placeholder="Enter value to convert"
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={2}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconButton
                onClick={handleSwapUnits}
                size="large"
                sx={{
                  bgcolor: 'background.default',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <CompareArrowsIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>To Unit</InputLabel>
                <Select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  label="To Unit"
                >
                  {UNIT_CATEGORIES[category].units.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Result"
                value={toValue}
                InputProps={{ readOnly: true }}
                placeholder="Conversion result"
              />
            </Stack>
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>
    </ToolPage>
  );
} 