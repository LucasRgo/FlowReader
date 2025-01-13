import React, { useState, useContext, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, TextField, Typography } from '@mui/material';
import CircularProgress from "@mui/material/CircularProgress";
import './login.css';
import { CSSTransition } from 'react-transition-group';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const LoginRegisterComponent = ({ initialMode = 'login' }) => {
    const nodeRef = useRef(null);
    const navigate = useNavigate();
    const [mode, setMode] = useState(initialMode);
    const [inProp, setInProp] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, login } = useContext(AuthContext);

    const toggleMode = () => {
        setInProp(false);
        setTimeout(() => {
            setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
            setInProp(true);
            setError(''); // Clear errors when switching modes
        }, 500);
    };

    async function handleRegister() {
        if (password !== confirmation) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            await register({ username, password });
            window.location.reload();
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error("Registration error:", error);
            setIsLoading(false);
        }
    }

    const handleLogin = async () => {
        setIsLoading(true);

        try {
            await login({ username, password });
            window.location.reload();
        } catch (error) {
            setError('Incorrect username or password.');
            console.error("Login error:", error);
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (mode === 'login') {
            handleLogin();
        } else if (mode === 'signup') {
            handleRegister();
        }
    };

    return (
        <div className="gradient-background">
            {isLoading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <CircularProgress
                        size={150}
                        sx={{ color: 'white' }}
                    />
                </div>
            ) : (
                <CSSTransition
                    in={inProp}
                    timeout={500}
                    classNames="form-transition"
                    unmountOnExit
                    nodeRef={nodeRef}
                >
                    <div ref={nodeRef} className="form-container">
                        <img
                            src={`${process.env.PUBLIC_URL}/FlowReader.png`}
                            style={{ maxHeight: '250px' }}
                            alt="FlowReader"
                        />
                        <h1 className="display-4">
                            {mode === 'login' ? 'Welcome Back!' : 'Register'}
                        </h1>
                        <div className="toggle-block">
                            <Typography variant="body2">
                                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                            </Typography>
                            <button
                                onClick={toggleMode}
                                className="btn btn-outline-secondary rounded-pill btn-sm"
                            >
                                {mode === 'login' ? 'Register' : 'Log In'}
                            </button>
                        </div>

                        {error && (
                            <Typography color="error" variant="body2" style={{ marginTop: '1rem' }}>
                                {error}
                            </Typography>
                        )}

                        <LoginForm
                            mode={mode}
                            onSubmit={handleSubmit}
                            setUsername={setUsername}
                            setPassword={setPassword}
                            setConfirmation={setConfirmation}
                        />
                    </div>
                </CSSTransition>
            )}
        </div>
    );
};

const LoginForm = ({ mode, onSubmit, setUsername, setPassword, setConfirmation }) => (
    <form onSubmit={onSubmit} style={{ marginTop: '1rem' }}>
        <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
            fullWidth
            margin="normal"
            label="Password"
            variant="outlined"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
        />
        {mode === 'signup' && (
            <TextField
                fullWidth
                margin="normal"
                label="Confirm Password"
                variant="outlined"
                type="password"
                onChange={(e) => setConfirmation(e.target.value)}
            />
        )}
        <Button
            variant="contained"
            fullWidth
            type="submit"
            id="button-primary"
            className="rounded-3 mt-3"
        >
            {mode === 'login' ? 'Log In' : 'Sign Up'}
        </Button>
    </form>
);

export default LoginRegisterComponent;
