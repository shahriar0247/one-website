# One-Use Websites

A collection of utility web apps built with React and Flask. Each tool is designed to be clean, fast, and mobile-friendly.

## Prerequisites

1. Python 3.8+ and pip
2. Node.js 16+ and npm
3. [Ollama](https://ollama.ai/) installed and running locally

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```bash
   python -m app.main
   ```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on http://localhost:3000

## Available Tools

### Text Tools
1. **Grammar Checker**
   - Checks spelling, grammar, and style
   - Powered by Ollama
   - Provides detailed corrections and suggestions

2. **Paraphrasing Tool**
   - Rewrites text in different styles
   - Modes: Casual, Formal, Creative
   - Maintains original meaning while changing tone

## Development

### Adding New Tools

1. Create a new component in `frontend/src/components/`
2. Add a new route in `frontend/src/App.jsx`
3. Create corresponding backend endpoints in `backend/app/`

### Code Style

- Frontend: Follow React best practices and use Material-UI components
- Backend: Follow PEP 8 guidelines
- Use TypeScript for type safety in frontend
- Write clear documentation for all functions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this code for your own projects! 