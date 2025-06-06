import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  HomeIcon,
  DocumentTextIcon,
  PhotoIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../utils/cn';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, current: false },
  { 
    name: 'Text Tools', 
    icon: DocumentTextIcon,
    children: [
      { name: 'Grammar Checker', href: '/grammar-checker' },
      { name: 'Case Converter', href: '/case-converter' },
      { name: 'Paraphraser', href: '/paraphrase' },
      { name: 'Line Breaks', href: '/line-breaks' },
    ]
  },
  { 
    name: 'Image Tools', 
    icon: PhotoIcon,
    children: [
      { name: 'Image Resizer', href: '/image-resizer' },
      { name: 'Image Converter', href: '/image-converter' },
      { name: 'Image Compressor', href: '/image-compressor' },
      { name: 'Image to Text', href: '/image-to-text' },
    ]
  },
  { 
    name: 'AI Tools', 
    icon: CpuChipIcon,
    children: [
      { name: 'Mini GPT', href: '/mini-gpt' },
      { name: 'Tone Analyzer', href: '/tone-analyzer' },
      { name: 'Fake News Detector', href: '/fake-news-detector' },
    ]
  },
  { 
    name: 'Productivity', 
    icon: WrenchScrewdriverIcon,
    children: [
      { name: 'Color Picker', href: '/color-picker' },
      { name: 'QR Generator', href: '/qr-generator' },
      { name: 'Unit Converter', href: '/unit-converter' },
      { name: 'PDF Converter', href: '/pdf-converter' },
    ]
  },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState(new Set());

  const isHomePage = location.pathname === '/';

  const toggleSection = (sectionName) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Simple search logic - redirect to relevant tool
      const query = searchQuery.toLowerCase();
      if (query.includes('grammar')) navigate('/grammar-checker');
      else if (query.includes('image') && query.includes('resize')) navigate('/image-resizer');
      else if (query.includes('pdf')) navigate('/pdf-converter');
      else if (query.includes('color')) navigate('/color-picker');
      else if (query.includes('qr')) navigate('/qr-generator');
      else navigate('/');
    }
  };

  if (isHomePage) {
    // Minimal header for homepage
    return (
      <div className="min-h-screen">
        <header className="absolute top-0 left-0 right-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">O</span>
                </div>
                <span className="ml-3 text-xl font-bold text-white">One-Use Tools</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                  {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </nav>
        </header>
        {children}
      </div>
    );
  }

  // Full layout for tool pages
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto glass border-r border-gray-200 dark:border-gray-800 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
              <span className="ml-3 text-lg font-bold gradient-text">One-Use Tools</span>
            </Link>
          </div>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="mt-6 mb-8">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </form>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                const isExpanded = expandedSections.has(item.name);
                
                if (item.children) {
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => toggleSection(item.name)}
                        className={cn(
                          'group w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                          'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                      >
                        <div className="flex items-center">
                          <IconComponent className="w-5 h-5 mr-3" />
                          {item.name}
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mt-1 ml-8 space-y-1"
                          >
                            {item.children.map((child) => (
                              <li key={child.name}>
                                <Link
                                  to={child.href}
                                  className={cn(
                                    'block px-3 py-2 text-sm rounded-lg transition-colors',
                                    location.pathname === child.href
                                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                                  )}
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }

                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        location.pathname === item.href
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      <IconComponent className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="flex h-16 items-center justify-between px-4 glass border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">O</span>
            </div>
            <span className="ml-3 text-lg font-bold gradient-text">One-Use Tools</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-72 glass border-r border-gray-200 dark:border-gray-800 px-6 py-6 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">O</span>
                  </div>
                  <span className="ml-3 text-lg font-bold gradient-text">One-Use Tools</span>
                </Link>
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSearch} className="mt-6 mb-8">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </form>

              <nav className="mt-8">
                {/* Mobile navigation content - same as desktop */}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 