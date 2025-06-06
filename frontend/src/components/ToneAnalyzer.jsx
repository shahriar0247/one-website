import React, { useState } from 'react';
import ToolCard from './ToolCard';

export default function ToneAnalyzer() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/tone/analyze', {
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
        error: 'Failed to analyze tone. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getToneColor = (tone, confidence) => {
    const baseColors = {
      positive: 'green',
      negative: 'red',
      neutral: 'gray',
      happy: 'yellow',
      sad: 'blue',
      angry: 'red',
      excited: 'orange',
      calm: 'green',
    };
    
    const color = baseColors[tone.toLowerCase()] || 'blue';
    return confidence > 0.7 ? color : 'gray';
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

    return (
      <div className="space-y-6">
        {result.overall_tone && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Overall Tone
            </h4>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {result.overall_tone}
                </span>
                {result.confidence && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(result.confidence * 100)}% confidence
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {result.emotions && result.emotions.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Detected Emotions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.emotions.map((emotion, index) => {
                const color = getToneColor(emotion.name, emotion.confidence);
                return (
                  <div key={index} className={`p-3 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg border border-${color}-200 dark:border-${color}-800`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {emotion.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${emotion.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 w-10">
                          {Math.round(emotion.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {result.sentiment && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Sentiment Analysis
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Polarity: {result.sentiment.polarity > 0 ? 'Positive' : result.sentiment.polarity < 0 ? 'Negative' : 'Neutral'}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Score: {result.sentiment.polarity?.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Subjectivity
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Score: {result.sentiment.subjectivity?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {result.suggestions && result.suggestions.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Suggestions
            </h4>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <span className="flex-shrink-0 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">{suggestion}</span>
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
      title="Tone Analyzer"
      description="Analyze the emotional tone and sentiment of your text using advanced AI algorithms."
      inputPlaceholder="Enter text to analyze its tone and emotional content..."
      onSubmit={handleSubmit}
      loading={loading}
      result={renderResult()}
      inputValue={text}
      onInputChange={(e) => setText(e.target.value)}
      actionText="Analyze Tone"
    />
  );
} 