import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthContext } from './context/authContext';
import { useContext } from 'react';
import LoginRegisterComponent from './components/login';
import PDFUploader from './components/userFunctions/PDFuploader';
import Footer from './components/essencial/foooter';
import NavbarComponent from './components/essencial/navbar';
import Books from './components/userFunctions/Books';
import Reader from './components/userFunctions/Reader';
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      {user && <NavbarComponent user={user} logout={logout} />}
      <Routes>
        <Route exact path="/" element={user ? <PDFUploader /> : <LoginRegisterComponent /> } />
        <Route exact path="/books" element={user ? <Books /> : <Navigate to="/" />} />
        <Route exact path="/book/:bookId" element={user ? <Reader /> : <Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
