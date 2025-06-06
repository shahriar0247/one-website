import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon,
  PhotoIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

const tools = [
  {
    category: 'Text Tools',
    icon: DocumentTextIcon,
    color: 'from-blue-500 to-cyan-500',
    tools: [
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
      { name: 'Color Picker', path: '/color-picker', description: 'Pick and generate color palettes' },
      { name: 'QR Generator', path: '/qr-generator', description: 'Generate QR codes instantly' },
      { name: 'Unit Converter', path: '/unit-converter', description: 'Convert between different units' },
      { name: 'PDF Converter', path: '/pdf-converter', description: 'Convert files to PDF format' },
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

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState(tools);

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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="floating absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl"></div>
          <div className="floating absolute top-40 right-20 w-32 h-32 bg-purple-500 rounded-full blur-xl"></div>
          <div className="floating absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-500 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
            >
              <SparklesIcon className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-sm font-medium">Your Ultimate Online Toolkit</span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block">One-Use</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Online Tools
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Powerful, fast, and intuitive tools for your daily tasks. 
              From text processing to image editing, we've got you covered.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
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
      </section>

      {/* Tools Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 gradient-text">
            Choose Your Tool
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover our comprehensive suite of online utilities designed to make your workflow seamless and efficient.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-12"
        >
          {filteredTools.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <motion.div key={category.category} variants={itemVariants}>
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
                    {category.category}
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
                        to={tool.path}
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
      </section>
    </div>
  );
} 