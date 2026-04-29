import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                navigate("/trips");
            } else {
                setError("Invalid credentials");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="btn-primary">Login</button>
                <p>Don't have an account? <a href="/register">Register</a></p>
                <p>Forgot your password? <a href="/forgot-password">Reset it</a></p>
            </form>
        </div>
    );
}

export default LoginPage;