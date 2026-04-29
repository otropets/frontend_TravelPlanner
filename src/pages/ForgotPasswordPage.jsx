import { useState } from "react";
import { forgotPassword } from "../services/api";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            setMessage("Password reset link sent to your email");
            setError("");
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <div className="auth-container">
            <h2>Forgot Password</h2>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                <button type="submit" className="btn-primary">Send Reset Link</button>
                <p><a href="/login">Back to Login</a></p>
            </form>
        </div>
    );
}

export default ForgotPasswordPage;