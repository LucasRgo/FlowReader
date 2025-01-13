import React from 'react';
import './footer.css';

function Footer() {
    return (
        <>
            <footer id="footer" className="footer bg-dark text-light py-4">
                <div className="container text-center" id="footer-container">
                    <div className="row">
                        <div className="col-md-6" id="footer-brand">
                            <h1 className="red-orange"><i className="bi bi-code-slash red-orange">!</i></h1>
                            <h5 className="footer-copyright">
                                &copy; 2024 Coded by <a href="index.html" className="footer-link">Lucas R Goveia</a>, Inc. All rights reserved.
                            </h5>
                        </div>
                        <div className="col-md-3" id="footer-social-media">
                            <h4 className="footer-title">Social media</h4>
                            <ul className="footer-list list-unstyled">
                                <li className="footer-list-item">
                                    <i className="bi bi-linkedin footer-icon"></i>
                                    <a href="#-" className="footer-link">LinkedIn</a>
                                </li>
                                <li className="footer-list-item">
                                    <i className="bi bi-github footer-icon"></i>
                                    <a href="#" className="footer-link">GitHub</a>
                                </li>
                                <li className="footer-list-item">
                                    <i className="bi bi-envelope footer-icon"></i>
                                    <a href="#" className="footer-link">E-mail</a>
                                </li>
                                <li className="footer-list-item">
                                    <i className="bi bi-instagram footer-icon"></i>
                                    <a href="#" className="footer-link">Instagram</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-3" id="footer-reference">
                            <h4 className="footer-title">Reference</h4>
                            <ul className="footer-list list-unstyled">
                                <li className="footer-list-item">
                                    <a href="#-" className="footer-link">About me</a>
                                </li>
                                <li className="footer-list-item">
                                    <a href="#" className="footer-link">Services</a>
                                </li>
                                <li className="footer-list-item">
                                    <a href="#" className="footer-link">Contact</a>
                                </li>
                                <li className="footer-list-item">
                                    <a href="#" className="footer-link">Homepage</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}



export default Footer;
