import React, { useState } from 'react';
import ToolPage from './ui/ToolPage';
import FileUpload from './ui/FileUpload';
import FileActions from './ui/FileActions';
import FileInfo from './ui/FileInfo';

const ImageToText = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setLoading(true);
    
    // TODO: Implement actual OCR functionality
    // For now, just simulate processing
    setTimeout(() => {
      setText('Sample extracted text from image...');
      setLoading(false);
    }, 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setFile(null);
    setText('');
  };

  return (
    <ToolPage
      title="Image to Text"
      description="Extract text from images using OCR technology"
    >
      <FileUpload
        onFileSelect={handleFileSelect}
        acceptedFileTypes={{
          'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
        }}
      />

      {file && <FileInfo file={file} />}

      {loading && (
        <div className="mt-4 text-center text-gray-600">
          Processing image...
        </div>
      )}

      {text && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Extracted Text</h3>
          <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
            {text}
          </div>
          <FileActions
            onDownload={handleDownload}
            onClear={handleClear}
            downloadDisabled={!text}
          />
        </div>
      )}
    </ToolPage>
  );
};

export default ImageToText; 