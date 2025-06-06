import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

export default function ToolCard({
  title,
  description,
  inputPlaceholder,
  onSubmit,
  loading,
  result,
  inputValue,
  onInputChange,
  actionText = 'Generate',
  children
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="glass-card overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 gradient-text">
              {title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <textarea
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={onInputChange}
              className={cn(
                "w-full min-h-[200px] p-4 rounded-xl border transition-all duration-200",
                "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700",
                "text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                "resize-y font-mono text-sm leading-relaxed"
              )}
            />
          </div>

          {/* Action Button */}
          <div className="flex justify-end mb-6">
            <motion.button
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              onClick={onSubmit}
              disabled={loading || !inputValue?.trim()}
              className={cn(
                "btn-primary relative overflow-hidden",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                actionText
              )}
            </motion.button>
          </div>

          {/* Custom Children (for special tool interfaces) */}
          {children && (
            <div className="mb-6">
              {children}
            </div>
          )}

          {/* Results Section */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 dark:border-gray-700 pt-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Results
                </h3>
                <button
                  onClick={() => navigator.clipboard.writeText(typeof result === 'string' ? result : JSON.stringify(result))}
                  className="btn-ghost text-sm"
                >
                  Copy Results
                </button>
              </div>
              
              <div className={cn(
                "p-4 rounded-xl border bg-gray-50 dark:bg-gray-900/50",
                "border-gray-200 dark:border-gray-700"
              )}>
                <div className="prose dark:prose-invert max-w-none">
                  {typeof result === 'string' ? (
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-900 dark:text-gray-100">
                      {result}
                    </pre>
                  ) : (
                    result
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 