import React, { useState } from 'react';
import ToolCard from './ToolCard';

export default function FakeNewsDetector() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/fake-news/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (data.success) {
        const parsedResult = typeof data.result === 'string' 
          ? JSON.parse(data.result) 
          : data.result;

        setResult(parsedResult);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult({
        error: 'Failed to analyze content. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCredibilityColor = (score) => {
    if (score >= 0.8) return 'green';
    if (score >= 0.6) return 'yellow';
    if (score >= 0.4) return 'orange';
    return 'red';
  };

  const getCredibilityLabel = (score) => {
    if (score >= 0.8) return 'Highly Credible';
    if (score >= 0.6) return 'Likely Credible';
    if (score >= 0.4) return 'Questionable';
    return 'Likely False';
  };

  const renderResult = () => {
    if (!result) return null;
    if (result.error) {
      return (
        <div className="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          {result.error}
        </div>
    );
    }

    const credibilityScore = result.credibility_score || 0;
    const color = getCredibilityColor(credibilityScore);
    const label = getCredibilityLabel(credibilityScore);

    return (
      <div className="space-y-6">
        {/* Overall Assessment */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <span className={`w-2 h-2 bg-${color}-500 rounded-full mr-2`}></span>
            Credibility Assessment
          </h4>
          <div className={`p-4 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg border border-${color}-200 dark:border-${color}-800`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {label}
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(credibilityScore * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className={`bg-${color}-500 h-3 rounded-full transition-all duration-500`}
                style={{ width: `${credibilityScore * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Warning Signs */}
        {result.warning_signs && result.warning_signs.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Warning Signs
            </h4>
            <ul className="space-y-2">
              {result.warning_signs.map((warning, index) => (
                <li key={index} className="flex items-start p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <span className="flex-shrink-0 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    !
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">{warning}</span>
                </li>
                  ))}
            </ul>
          </div>
            )}

        {/* Positive Indicators */}
        {result.positive_indicators && result.positive_indicators.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Positive Indicators
            </h4>
            <ul className="space-y-2">
              {result.positive_indicators.map((indicator, index) => (
                <li key={index} className="flex items-start p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <span className="flex-shrink-0 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    ✓
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">{indicator}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Analysis Details */}
        {result.analysis && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Detailed Analysis
            </h4>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                {result.analysis}
              </p>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Recommendations
            </h4>
            <ul className="space-y-2">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <span className="flex-shrink-0 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">{recommendation}</span>
                </li>
                ))}
            </ul>
          </div>
          )}
      </div>
    );
  };

  return (
    <ToolCard
      title="Fake News Detector"
      description="Analyze text content to detect potential misinformation and assess credibility using AI-powered fact-checking."
      inputPlaceholder="Paste news article, social media post, or any text content to analyze for potential misinformation..."
      onSubmit={handleSubmit}
      loading={loading}
      result={renderResult()}
      inputValue={text}
      onInputChange={(e) => setText(e.target.value)}
      actionText="Analyze Content"
    />
  );
} 