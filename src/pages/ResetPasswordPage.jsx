import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        try {
            await resetPassword(token, password);
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Reset Password</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>New Password</label>
                <input type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="btn-primary">Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPasswordPage;