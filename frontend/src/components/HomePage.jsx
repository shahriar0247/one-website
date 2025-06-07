import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon,
  PhotoIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  ArrowRightIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  ScissorsIcon,
  PencilIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

const tools = [
  {
    category: 'Text Tools',
    icon: DocumentTextIcon,
    color: 'from-blue-500 to-cyan-500',
    tools: [
      { name: 'Text Case Converter', path: '/text-case-converter', description: 'Convert text between different cases' },
      { name: 'JSON Formatter', path: '/json-formatter', description: 'Format and validate JSON data' },
      { name: 'URL Encoder', path: '/url-encoder', description: 'Encode and decode URLs and Base64' },
      { name: 'Grammar Checker', path: '/grammar-checker', description: 'Check and improve your writing' },
      { name: 'Case Converter', path: '/case-converter', description: 'Convert text between different cases' },
      { name: 'Paraphraser', path: '/paraphrase', description: 'Rewrite text while keeping meaning' },
      { name: 'Line Breaks', path: '/line-breaks', description: 'Add or remove line breaks' },
    ]
  },
  {
    category: 'Image Tools',
    icon: PhotoIcon,
    color: 'from-purple-500 to-pink-500',
    tools: [
      { name: 'Image Resizer', path: '/image-resizer', description: 'Resize images to any dimensions' },
      { name: 'Image Converter', path: '/image-converter', description: 'Convert between image formats' },
      { name: 'Image Compressor', path: '/image-compressor', description: 'Reduce image file sizes' },
      { name: 'Image to Text', path: '/image-to-text', description: 'Extract text from images' },
    ]
  },
  {
    category: 'AI Tools',
    icon: CpuChipIcon,
    color: 'from-green-500 to-emerald-500',
    tools: [
      { name: 'Mini GPT', path: '/mini-gpt', description: 'AI-powered text generation' },
      { name: 'Tone Analyzer', path: '/tone-analyzer', description: 'Analyze text sentiment and tone' },
      { name: 'Fake News Detector', path: '/fake-news-detector', description: 'Detect misinformation' },
    ]
  },
  {
    category: 'Productivity Tools',
    icon: WrenchScrewdriverIcon,
    color: 'from-orange-500 to-red-500',
    tools: [
      { name: 'Password Generator', path: '/password-generator', description: 'Generate secure passwords' },
      { name: 'QR Code Generator', path: '/qr-code-generator', description: 'Generate QR codes instantly' },
      { name: 'Hash Generator', path: '/hash-generator', description: 'Generate secure hash values' },
      { name: 'Color Picker', path: '/color-picker', description: 'Pick and generate color palettes' },
      { name: 'QR Generator', path: '/qr-generator', description: 'Generate QR codes instantly' },
      { name: 'Unit Converter', path: '/unit-converter', description: 'Convert between different units' },
      { name: 'PDF Converter', path: '/pdf-converter', description: 'Convert files to PDF format' },
    ]
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    description: 'Comprehensive PDF manipulation tools',
    tools: [
      {
        name: 'PDF Studio',
        description: 'Complete PDF toolkit with compression, merging, splitting, editing, OCR, and more.',
        href: '/pdf',
        icon: DocumentTextIcon,
        color: 'from-red-500 to-red-600',
        features: [
          'Smart compression',
          'PDF merging',
          'Page splitting',
          'Text editing',
          'OCR extraction',
          'Form creation'
        ]
      },
      {
        name: 'PDF Compressor',
        description: 'Reduce PDF file size while maintaining quality',
        href: '/pdf/compress',
        icon: ArrowsUpDownIcon,
        color: 'from-blue-500 to-blue-600',
        features: [
          'Smart compression',
          'Quality control',
          'Batch processing',
          'Size preview'
        ]
      },
      {
        name: 'PDF Merger',
        description: 'Combine multiple PDFs into one document',
        href: '/pdf/merge',
        icon: DocumentDuplicateIcon,
        color: 'from-green-500 to-green-600',
        features: [
          'Drag & drop',
          'Reorder pages',
          'Preview',
          'Batch merge'
        ]
      },
      {
        name: 'PDF Splitter',
        description: 'Split PDFs into multiple files or extract pages',
        href: '/pdf/split',
        icon: ScissorsIcon,
        color: 'from-yellow-500 to-yellow-600',
        features: [
          'Split by range',
          'Extract pages',
          'Batch splitting',
          'Preview'
        ]
      },
      {
        name: 'PDF Editor',
        description: 'Edit PDF content, add forms, and annotate',
        href: '/pdf/editor',
        icon: PencilIcon,
        color: 'from-purple-500 to-purple-600',
        features: [
          'Text editing',
          'Form creation',
          'Annotations',
          'Page management'
        ]
      },
      {
        name: 'PDF OCR',
        description: 'Extract text from scanned PDFs',
        href: '/pdf/ocr',
        icon: MagnifyingGlassIcon,
        color: 'from-indigo-500 to-indigo-600',
        features: [
          'Text extraction',
          'Multi-language',
          'Format preservation',
          'Batch processing'
        ]
      }
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Add new statistics section
const stats = [
  { name: 'Active Users', value: '50K+', icon: UserGroupIcon },
  { name: 'Tools Available', value: '20+', icon: WrenchScrewdriverIcon },
  { name: 'Files Processed', value: '1M+', icon: ChartBarIcon },
  { name: 'Average Processing Time', value: '<2s', icon: ClockIcon },
];

// Add featured tools with previews
const featuredTools = [
  {
    name: 'Color Picker',
    path: '/color-picker',
    description: 'Advanced color selection with multiple formats',
    preview: '/previews/color-picker.gif'
  },
  {
    name: 'Image Converter',
    path: '/image-converter',
    description: 'Convert images between multiple formats with ease',
    preview: '/previews/image-converter.gif'
  },
  {
    name: 'PDF Tools',
    path: '/pdf-converter',
    description: 'Comprehensive PDF manipulation suite',
    preview: '/previews/pdf-tools.gif'
  }
];

const FEATURED_TOOLS = [
  // ... existing tools ...
  {
    name: 'PDF Studio',
    description: 'Complete PDF toolkit with compression, merging, splitting, editing, OCR, and more.',
    href: '/pdf',
    icon: DocumentTextIcon,
    color: 'from-red-500 to-red-600',
    features: [
      'Smart compression',
      'PDF merging',
      'Page splitting',
      'Text editing',
      'OCR extraction',
      'Form creation'
    ]
  },
  // ... other tools ...
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState(tools);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredTools(tools);
      return;
    }

    const filtered = tools.map(category => ({
      ...category,
      tools: category.tools.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
      )
    })).filter(category => category.tools.length > 0);

    setFilteredTools(filtered);
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        {/* Animated background */}
        <motion.div 
          style={{ opacity, scale }}
          className="absolute inset-0 opacity-20"
        >
          <div className="floating absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl"></div>
          <div className="floating absolute top-40 right-20 w-32 h-32 bg-purple-500 rounded-full blur-xl"></div>
          <div className="floating absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-500 rounded-full blur-xl"></div>
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              All Your Tools in
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> One Place</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Powerful, free online tools for everyday tasks. No installation needed.
            </p>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tools... (e.g., 'compress image', 'check grammar')"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/grammar-checker"
                className="btn-primary inline-flex items-center justify-center group"
              >
                Get Started
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn-secondary">
                Explore All Tools
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/60 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Featured Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Discover our most popular and powerful tools
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card group hover:scale-105 transition-transform duration-300"
              >
                <Link to={tool.path} className="block p-6">
                  <div className="aspect-video rounded-lg overflow-hidden mb-6 bg-gray-200 dark:bg-gray-700">
                    <img
                      src={tool.preview}
                      alt={tool.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {tool.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              All Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Find the perfect tool for your task
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid gap-12"
          >
            {filteredTools.map((category, categoryIndex) => {
              const IconComponent = category.icon;
              return (
                <motion.div key={category.id} variants={itemVariants}>
                  <div className="mb-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className={cn(
                        "p-3 rounded-2xl bg-gradient-to-r",
                        category.color,
                        "shadow-lg"
                      )}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
                      {category.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {category.tools.map((tool, toolIndex) => (
                      <motion.div
                        key={tool.name}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to={tool.href}
                          className="tool-card block h-full"
                        >
                          <div className="text-center">
                            <div className={cn(
                              "w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r transition-all duration-300 tool-icon flex items-center justify-center",
                              category.color
                            )}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                              {tool.name}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                              {tool.description}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {searchQuery && filteredTools.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                No tools found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try searching with different keywords or browse all available tools above.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Get Started in Seconds
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
              No sign-up required. Just choose a tool and start working.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Choose a Tool
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select from our wide range of powerful tools
                </p>
              </div>

              <div className="glass-card p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Upload or Input
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Add your files or text with a simple drag & drop
                </p>
              </div>

              <div className="glass-card p-6">
                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Get Results
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Download or copy your processed results instantly
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 