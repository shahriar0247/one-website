import React from 'react';
import { motion } from 'framer-motion';

const ToolPage = ({ title, description, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
        >
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                {description}
              </p>
            )}
            <div className="space-y-8">{children}</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ToolPage; 