"use client";
import { useState } from 'react';
import { Form, Button, Image } from 'react-bootstrap';

export default function ImageUploader({ onImageSelect }) {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUrlInput, setIsUrlInput] = useState(true);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewUrl(url);
    onImageSelect({ type: 'url', data: url });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        onImageSelect({ type: 'file', data: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleInputType = () => {
    setIsUrlInput(!isUrlInput);
    setPreviewUrl('');
    setImageUrl('');
    setSelectedFile(null);
    onImageSelect({ type: 'clear' });
  };

  return (
    <Form.Group className="mb-3">
      <div className="d-flex align-items-center mb-2">
        <Form.Label className="me-3 mb-0">Imagen</Form.Label>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={toggleInputType}
        >
          {isUrlInput ? 'Subir desde dispositivo' : 'Usar URL'}
        </Button>
      </div>

      {isUrlInput ? (
        <Form.Control
          type="url"
          placeholder="https://ejemplo.com/imagen.jpg"
          value={imageUrl}
          onChange={handleUrlChange}
        />
      ) : (
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
        />
      )}

      {previewUrl && (
        <div className="mt-3">
          <p className="text-muted small">Vista previa:</p>
          <Image
            src={previewUrl}
            alt="Preview"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '200px', 
              objectFit: 'contain'
            }}
          />
        </div>
      )}
    </Form.Group>
  );
} 