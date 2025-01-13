import React, { useContext } from 'react';
import { Link } from 'react-router-dom';  // For navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './navbar.css'

function NavbarComponent({ user, logout }) {
  const username = user.username;

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
      <img src={`${process.env.PUBLIC_URL}/FlowReader.png`} style={{maxHeight: '50px'}}  />
        <Link className="navbar-brand" to="/">
          <strong>FlowReader</strong>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Upload a book
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/books">
                My books
              </Link>
            </li>
            {!user && (
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
            )}
          </ul>
          <span className="navbar-text">
            {user ? (
              <>
                Signed in as:<strong> {username}</strong>
                <button
                  className="ms-2 btn btn-outline-orange btn-sm rounded-pill"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                Not signed in:
                <Link className="ms-2" to="/login">
                  <button className="btn btn-outline-orange btn-sm rounded-pill">
                    Log In
                  </button>
                </Link>
              </>
            )}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default NavbarComponent;
