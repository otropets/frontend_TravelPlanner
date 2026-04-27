import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav style={{ padding: "12px 20px", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span onClick={() => navigate("/trips")} style={{ cursor: "pointer", fontWeight: "bold", fontSize: "18px" }}>
                Travel Planner
            </span>
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
}

export default Navbar;