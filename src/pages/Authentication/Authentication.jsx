import React, { useState, useContext } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import './Authentication.css';

const Authentication = () => {
    const { login, register, verify, authenticated, otpSent } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    // get the path params to redirect the user after authentication
    const from = location.state?.from || "/";


    const resetValues = () => {
        setEmail('');
        setUsername('');
        setPassword('');
        setOtp('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (otpSent) {
            try {
                await verify(email, otp);
                navigate(from);
            } catch (error) {
                alert(error.message || 'Something went wrong')
            }
        } else if (isRegistering) {
            try {
                await register(username, email, password);
            } catch (error) {
                alert(error.message || 'Something went wrong')
            }
        } else {
            try {
                await login(email, password);
            } catch (error) {
                alert(error.message || 'Something went wrong')
            }
        }
    };


    const toggleRegister = () => {
        setIsRegistering(!isRegistering);
        resetValues();
    };

    if (authenticated) {
        return <Navigate to={from} replace />;
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <h2 className="auth-title">
                    {otpSent ? "Verify OTP" : isRegistering ? "Register" : "Login"}
                </h2>
                <p className="auth-subtitle">
                    {otpSent
                        ? "Please enter the OTP sent to your email to verify your account."
                        : "Browse through the products and manage your cart."}
                </p>
                <form onSubmit={handleSubmit} className="auth-form">
                    {otpSent ? (
                        <>
                            <label htmlFor="otp" className="auth-label">
                                OTP:
                            </label>
                            <input
                                type="tel"
                                id="otp"
                                value={otp}
                                onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                                className="otp-input"
                                maxLength="6"
                                pattern="\d*"
                            />
                        </>
                    ) : isRegistering ? (
                        <>
                            <label htmlFor="username" className="auth-label">
                                Username:
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                className="auth-input"
                            />
                            <label htmlFor="email" className="auth-label">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="auth-input"
                            />
                        </>
                    ) : (
                        <>
                            <label htmlFor="email" className="auth-label">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="auth-input"
                            />
                        </>
                    )}
                    {!otpSent && (
                        <>
                            <label htmlFor="password" className="auth-label">
                                Password:
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="auth-input"
                            />
                        </>
                    )}
                    <button type="submit" className="auth-button">
                        {otpSent ? "Verify OTP" : isRegistering ? "Register" : "Login"}
                    </button>
                    {!otpSent && (
                        <p className="auth-toggle">
                            {isRegistering
                                ? "Already have an account?"
                                : "Don't have an account?"}
                            <span onClick={toggleRegister} className="auth-link">
                                {isRegistering ? " Login" : " Register"}
                            </span>
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Authentication;
