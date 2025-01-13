import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress } from '@mui/material';
import './PdfPageViewer.css';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';
import Tooltip from '@mui/material/Tooltip';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfPageViewer = ({ pdf, currentPage, handlePageChange, title }) => {
  const [loading, setLoading] = useState(true);
  const [pageNum, setPageNum] = useState(currentPage);
  const [pageDetails, setPageDetails] = useState(null);
  const canvasRef = useRef(null);


  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        const loadingTask = pdfjsLib.getDocument(pdf);
        const pdfDocument = await loadingTask.promise;

        setPageDetails({
          total: pdfDocument.numPages
        });

        // Render the initial page
        await renderPage(pdfDocument, currentPage);
        setLoading(false);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setLoading(false);
      }
    };

    loadPdf();
  }, [pdf]);

  // Effect to handle page changes
  useEffect(() => {
    const changePage = async () => {
      if (pageDetails && currentPage >= 1 && currentPage <= pageDetails.total) {
        setPageNum(currentPage);

        try {
          const loadingTask = pdfjsLib.getDocument(pdf);
          const pdfDocument = await loadingTask.promise;
          await renderPage(pdfDocument, currentPage);
        } catch (error) {
          console.error('Error rendering page:', error);
        }
      }
    };

    changePage();
  }, [currentPage, pageDetails]);

  // Function to render a specific page
  const renderPage = async (pdfDocument, pageNumber) => {
    const page = await pdfDocument.getPage(pageNumber);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Get the container width dynamically
    const container = canvas.parentElement;
    const containerWidth = container.offsetWidth;

    // Calculate scale to fit the width
    const viewport = page.getViewport({ scale: 1 });
    const scale = containerWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;

    // Render page on canvas
    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport,
    };
    await page.render(renderContext);
  };


  // Previous page handler
  const handlePreviousPage = () => {
    if (pageNum > 1) {
      handlePageChange(pageNum - 1);
    }
  };

  // Next page handler
  const handleNextPage = () => {
    if (pageDetails && pageNum < pageDetails.total) {
      handlePageChange(pageNum + 1);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "85vh"
      }}>
        <CircularProgress
          size={150}
          sx={{ color: 'orangered' }}
        />
      </div>
    );
  }

  return (
    <div className="pdfViewerContainer">
      <div className="pdfNavigationControls">
        <button
          className="pdfNavigationButton"
          onClick={handlePreviousPage}
          disabled={pageNum <= 1}
        >
          Previous
        </button>
        <span className="pdfPageInfo">
          Page {pageNum} of {pageDetails?.total || "?"}
        </span>
        <button
          className="pdfNavigationButton"
          onClick={handleNextPage}
          disabled={pageDetails && pageNum >= pageDetails.total}
        >
          Next
        </button>
      </div>
      <div className="pdfCanvasContainer">
        <Tooltip
          title={title}
          color="warning"
          placement="top"
          size="lg"
          arrow placement="right"
          variant="outlined">
          <canvas
            ref={canvasRef}
            className="pdfCanvas"
          />
        </Tooltip>
      </div>
      <h6 className="display-6 mt-3" >You're progress on this book is {((currentPage / pageDetails.total) * 100).toFixed(2)}% !</h6>
    </div>
  );
};

export default PdfPageViewer;
