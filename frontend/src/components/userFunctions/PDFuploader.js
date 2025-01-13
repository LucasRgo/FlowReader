import React, { useState, useContext } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import CircularProgress from "@mui/material/CircularProgress";
import './PDFuploader.css';
import PDFThumbnail from './PDFthumbnail';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const PDFUploader = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [thumbnail, setThumbnail] = useState(null);
  const { uploadPdf } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !pdfFile || !thumbnail) {
        console.error('All fields are required!');
        return;
    }

    setIsLoading(true);

    try {
        const response = await uploadPdf(title, pdfFile, thumbnail);
        if (response) {
            navigate("/books");
        } else {
            console.error('Upload failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during upload:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);
      setPdfFile(file);
      setPdfUrl(fileUrl);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const onThumbnailReady = useCallback((thumbnailUrl) => {
    const base64ToBlob = (base64, contentType) => {
      const byteCharacters = atob(base64.split(',')[1]);
      const byteArrays = [];
      for (let i = 0; i < byteCharacters.length; i += 512) {
        const slice = byteCharacters.slice(i, i + 512);
        const byteNumbers = new Array(slice.length);
        for (let j = 0; j < slice.length; j++) {
          byteNumbers[j] = slice.charCodeAt(j);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      return new Blob(byteArrays, { type: contentType });
    };

    const blob = base64ToBlob(thumbnailUrl, "image/png");
    const file = new File([blob], "thumbnail.png", { type: "image/png" });
    setThumbnail(file);
  }, []);

  if (isLoading) {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "85vh" }}>
          <CircularProgress
            size={150}
            sx={{ color: 'orangered' }}
          />
        </div>
    );
  }

  return (
    <div
      className={`pdfContainer ${isDragging ? 'dragActive' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {pdfUrl ? (
        <div className="formContainer">
          <PDFThumbnail pdfUrl={pdfUrl} onThumbnailReady={onThumbnailReady} />
          <form onSubmit={handleSubmit}>
            <div className="my-3">
              <label htmlFor="bookTitle">
                Enter the title of the book:
              </label>
              <input
                id="bookTitle"
                type="text"
                placeholder="Enter the title of the book"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <div>
          <p className="uploadText">
            Drag and drop a PDF file or click below to select
          </p>
          <label className="uploadButton align-self-start">
            Choose PDF File
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="fileInput"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;
