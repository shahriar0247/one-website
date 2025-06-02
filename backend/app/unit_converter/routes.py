from flask import request, jsonify
from . import unit_converter_bp

# Conversion factors for each unit category
CONVERSION_FACTORS = {
    'length': {
        'mm': 0.001,  # base unit: meters
        'cm': 0.01,
        'm': 1,
        'km': 1000,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144,
        'mi': 1609.344
    },
    'weight': {
        'mg': 0.000001,  # base unit: kilograms
        'g': 0.001,
        'kg': 1,
        'oz': 0.0283495,
        'lb': 0.453592,
        't': 1000
    },
    'temperature': {
        'c': 'celsius',
        'f': 'fahrenheit',
        'k': 'kelvin'
    },
    'volume': {
        'ml': 0.001,  # base unit: liters
        'l': 1,
        'gal': 3.78541,
        'qt': 0.946353,
        'pt': 0.473176,
        'cup': 0.236588,
        'floz': 0.0295735
    },
    'area': {
        'mm2': 0.000001,  # base unit: square meters
        'cm2': 0.0001,
        'm2': 1,
        'km2': 1000000,
        'in2': 0.00064516,
        'ft2': 0.092903,
        'yd2': 0.836127,
        'ac': 4046.86,
        'ha': 10000
    }
}

def convert_temperature(value, from_unit, to_unit):
    # Convert to Kelvin first (as intermediate)
    if from_unit == 'c':
        kelvin = value + 273.15
    elif from_unit == 'f':
        kelvin = (value - 32) * 5/9 + 273.15
    else:  # from_unit == 'k'
        kelvin = value
    
    # Convert from Kelvin to target unit
    if to_unit == 'c':
        return kelvin - 273.15
    elif to_unit == 'f':
        return (kelvin - 273.15) * 9/5 + 32
    else:  # to_unit == 'k'
        return kelvin

@unit_converter_bp.route('/convert', methods=['POST'])
def convert():
    try:
        data = request.get_json()
        value = float(data.get('value', 0))
        from_unit = data.get('from_unit', '').lower()
        to_unit = data.get('to_unit', '').lower()
        category = data.get('category', '')

        if not all([value is not None, from_unit, to_unit, category]):
            return jsonify({
                'success': False,
                'error': 'Missing required parameters'
            }), 400

        if category not in CONVERSION_FACTORS:
            return jsonify({
                'success': False,
                'error': 'Invalid category'
            }), 400

        if category == 'temperature':
            result = convert_temperature(value, from_unit, to_unit)
        else:
            # Get conversion factors
            factors = CONVERSION_FACTORS[category]
            if from_unit not in factors or to_unit not in factors:
                return jsonify({
                    'success': False,
                    'error': 'Invalid units for the selected category'
                }), 400

            # Convert to base unit then to target unit
            base_value = value * factors[from_unit]
            result = base_value / factors[to_unit]

        return jsonify({
            'success': True,
            'result': round(result, 8)
        })

    except ValueError as e:
        return jsonify({
            'success': False,
            'error': 'Invalid numeric value'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500 