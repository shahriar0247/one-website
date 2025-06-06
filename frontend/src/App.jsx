import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import HomePage from './components/HomePage';

// Text Tools
import GrammarChecker from './components/GrammarChecker';
import Paraphrase from './components/Paraphrase';
import CaseConverter from './components/CaseConverter';
import LineBreaks from './components/LineBreaks';

// File Tools
import PdfConverter from './components/PdfConverter';
import FileAnalyzer from './components/FileAnalyzer';

// Image Tools
import ImageToText from './components/ImageToText';
import ImageResizer from './components/ImageResizer';
import ImageConverter from './components/ImageConverter';
import ImageCompressor from './components/ImageCompressor';

// AI Tools
import MiniGpt from './components/MiniGpt';
import ToneAnalyzer from './components/ToneAnalyzer';
import FakeNewsDetector from './components/FakeNewsDetector';

// Productivity Tools
import ColorPicker from './components/ColorPicker';
import QrGenerator from './components/QrGenerator';
import UnitConverter from './components/UnitConverter';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<HomePage />} />
            
            {/* Text Tools */}
            <Route path="/grammar-checker" element={<GrammarChecker />} />
            <Route path="/paraphrase" element={<Paraphrase />} />
            <Route path="/case-converter" element={<CaseConverter />} />
            <Route path="/line-breaks" element={<LineBreaks />} />

            {/* File Tools */}
            <Route path="/pdf-converter" element={<PdfConverter />} />
            <Route path="/file-analyzer" element={<FileAnalyzer />} />

            {/* Image Tools */}
            <Route path="/image-to-text" element={<ImageToText />} />
            <Route path="/image-resizer" element={<ImageResizer />} />
            <Route path="/image-converter" element={<ImageConverter />} />
            <Route path="/image-compressor" element={<ImageCompressor />} />

            {/* AI Tools */}
            <Route path="/mini-gpt" element={<MiniGpt />} />
            <Route path="/tone-analyzer" element={<ToneAnalyzer />} />
            <Route path="/fake-news-detector" element={<FakeNewsDetector />} />

            {/* Productivity Tools */}
            <Route path="/color-picker" element={<ColorPicker />} />
            <Route path="/qr-generator" element={<QrGenerator />} />
            <Route path="/unit-converter" element={<UnitConverter />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
} 