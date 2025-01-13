import CircularProgress from "@mui/material/CircularProgress";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { useParams } from "react-router-dom";
import PdfPageViewer from "./PdfPageViewer";
import WordByWordDisplay from "./WordByWordDisplay";

const Reader = () => {
  const { bookId } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { axiosInstance } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookData = async () => {
      if (!bookId) {
        console.error("Book ID is not provided.");
        setLoading(false);
        return;
      }
      try {
        const response = await axiosInstance.get(`/api/book/${bookId}/`);
        setBookData(response.data);
        setCurrentPage(response.data.last_page_read);
      } catch (error) {
        console.error("Failed to fetch book data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookData();
  }, [axiosInstance, bookId]);

  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    try {
      await axiosInstance.put(`/api/book/${bookId}/progress/`, {
        last_page_read: newPage,
      });
    } catch (error) {
      console.error("Failed to save reading progress:", error);
    }
  };

  if (loading) {
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
    <div className="row g-0">
      <div className="col-lg-6 text-center">
        <PdfPageViewer
          pdf={bookData.pdf}
          title={bookData.title}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </div>
      <div className="col-lg-6">
        <WordByWordDisplay
          pages={bookData.pages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Reader;
