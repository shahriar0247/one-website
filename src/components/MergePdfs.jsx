import React, { useState } from 'react';
import ToolPage from './ui/ToolPage';
import FileUpload from './ui/FileUpload';
import FileActions from './ui/FileActions';
import MergeIcon from '@mui/icons-material/Merge';
import { Typography, Box, List, ListItem, IconButton, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function MergePdfs() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (selectedFile, error) => {
    if (error) {
      setError(error);
      return;
    }
    if (selectedFile) {
      setFiles(prev => [...prev, selectedFile]);
      setError(null);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearFiles = () => {
    setFiles([]);
    setError(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:5000/api/pdf-merger/merge', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Merge failed');
      }

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'merged.pdf';

      // Create a blob from the response and download it
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFiles(items);
  };

  return (
    <ToolPage
      title="PDF Merger"
      description="Combine multiple PDF files into a single document. Drag and drop to reorder files."
      icon={<MergeIcon />}
    >
      <FileUpload
        file={null}
        onFileSelect={handleFileSelect}
        onClearFile={() => {}}
        accept=".pdf"
        maxSize={50}
        error={error}
        label="Drop PDF files here"
        description="or click to select (add multiple files)"
      />

      {files.length > 0 && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Files to Merge ({files.length})
          </Typography>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="pdf-list">
              {(provided) => (
                <List
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {files.map((file, index) => (
                    <Draggable key={file.name + index} draggableId={file.name + index} index={index}>
                      {(provided) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          secondaryAction={
                            <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                              <DeleteIcon />
                            </IconButton>
                          }
                          divider
                        >
                          <IconButton {...provided.dragHandleProps} sx={{ mr: 1 }}>
                            <DragIndicatorIcon />
                          </IconButton>
                          <ListItemText
                            primary={file.name}
                            secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                          />
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      )}

      <FileActions
        onProcess={handleMerge}
        onCancel={handleClearFiles}
        loading={loading}
        disabled={files.length < 2}
        processText="Merge PDFs"
        showCancel={files.length > 0}
      />
    </ToolPage>
  );
} 