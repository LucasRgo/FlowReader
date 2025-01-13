import React, { memo, useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";


const PDFThumbnail = memo(({ pdfUrl, onThumbnailReady }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderThumbnail = async () => {
      const loadingTask = pdfjs.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1); // Render the first page

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const viewport = page.getViewport({ scale: 0.5 });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      const renderTask = page.render(renderContext);

      renderTask.promise
        .then(() => {
          const thumbnailDataUrl = canvas.toDataURL("image/png");
          setThumbnail(thumbnailDataUrl);
          onThumbnailReady(thumbnailDataUrl);
        })
        .catch((error) => console.error("Render failed:", error));
    };

    renderThumbnail();
  }, [pdfUrl, onThumbnailReady]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {thumbnail && <img src={thumbnail} alt="PDF Thumbnail" style={{ width: "250px" }} />}
    </div>
  );
});

export default PDFThumbnail;
