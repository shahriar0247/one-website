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
import TextCaseConverter from './components/TextCaseConverter';
import JSONFormatter from './components/JSONFormatter';

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
import QRCodeGenerator from './components/QRCodeGenerator';
import PasswordGenerator from './components/PasswordGenerator';
import HashGenerator from './components/HashGenerator';
import URLEncoder from './components/URLEncoder';

// Import PDF tools
import PDFStudio from './components/PDFStudio';
import PDFCompressor from './components/PDFCompressor';
import PDFMerger from './components/PDFMerger';
import PDFSplitter from './components/PDFSplitter';
import PDFEditor from './components/PDFEditor';
import PDFOCR from './components/PDFOCR';

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
            <Route path="/text-case-converter" element={<TextCaseConverter />} />
            <Route path="/json-formatter" element={<JSONFormatter />} />

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
            <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
            <Route path="/password-generator" element={<PasswordGenerator />} />
            <Route path="/hash-generator" element={<HashGenerator />} />
            <Route path="/url-encoder" element={<URLEncoder />} />

            {/* PDF Tools Routes */}
            <Route path="/pdf" element={<PDFStudio />} />
            <Route path="/pdf/compress" element={<PDFCompressor />} />
            <Route path="/pdf/merge" element={<PDFMerger />} />
            <Route path="/pdf/split" element={<PDFSplitter />} />
            <Route path="/pdf/editor" element={<PDFEditor />} />
            <Route path="/pdf/ocr" element={<PDFOCR />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
} 