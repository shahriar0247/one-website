import React from 'react';
import PropTypes from 'prop-types';

const ToolPage = ({ title, description, children }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {children}
      </div>
    </div>
  );
};

ToolPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ToolPage; 