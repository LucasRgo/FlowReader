import { useNavigate } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import { AuthContext } from '../../context/authContext';
import { FaTrash } from 'react-icons/fa';
import './Books.css';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [deletingBooks, setDeletingBooks] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { axiosInstance } = useContext(AuthContext);
    const navigate = useNavigate();

    const getBooks = async () => {
        try {
            const response = await axiosInstance.get('/api/books/');
            if (response.status === 200) {
                setBooks(response.data);
            } else {
                setError(`Error: ${response.status}`);
            }
        } catch (error) {
            setError(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const onDeleteBook = (bookId) => {
        setDeletingBooks((prev) => ({ ...prev, [bookId]: true }));

        // Wait for the animation to complete before removing the book from the state
        setTimeout(async () => {
            try {
                setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
                const response = await axiosInstance.delete(`/api/books/${bookId}/delete/`)

            } catch (error) {
                console.error('Failed to delete book:', error);
            } finally {
                setDeletingBooks((prev) => {
                    const updated = { ...prev };
                    delete updated[bookId];
                    return updated;
                });
            }
        }, 500);
    };


    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    const handleDeleteBook = (bookId, event) => {
        event.stopPropagation();
        onDeleteBook(bookId);
    };

    React.useEffect(() => {
        getBooks();
    }, []);

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
        <div className="book-grid">
            {books.map((book) => (
                <div
                    key={book.id}
                    className={`book-card ${deletingBooks[book.id] ? 'hide' : ''}`}
                    onClick={() => handleBookClick(book.id)}
                >
                    <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="book-image"
                    />
                    <div className="book-title">{book.title}</div>
                    <button
                        onClick={(e) => handleDeleteBook(book.id, e)}
                        className="delete-button"
                    >
                        <FaTrash />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Books;
