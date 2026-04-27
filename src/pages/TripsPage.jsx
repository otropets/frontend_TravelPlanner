import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTrips, createTrip, getMyInvitations, acceptInvitation, declineInvitation } from "../services/api";
import Navbar from "../components/Navbar";

function TripsPage() {
    const [trips, setTrips] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [tripName, setTripName] = useState("");
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchTrips();
        fetchInvitations();
    }, []);

    const fetchTrips = async () => {
        try {
            const data = await getTrips(token);
            setTrips(data);
        } catch (err) {
            setError("Failed to load trips");
        }
    };

    const fetchInvitations = async () => {
        try {
            const data = await getMyInvitations(token);
            setInvitations(data);
        } catch (err) {
            console.error("Failed to load invitations");
        }
    };

    const handleCreateTrip = async (e) => {
        e.preventDefault();
        if (!tripName.trim() || !destination.trim()) {
            setError("Trip name and destination are required");
            return;
        }
        if (startDate && endDate && endDate < startDate) {
            setError("End date cannot be before start date");
            return;
        }
        try {
            await createTrip(token, { tripName, destination, startDate, endDate });
            setShowForm(false);
            setTripName("");
            setDestination("");
            setStartDate("");
            setEndDate("");
            setError("");
            fetchTrips();
        } catch (err) {
            setError("Failed to create trip");
        }
    };

    const handleAccept = async (participantId) => {
        try {
            await acceptInvitation(token, participantId);
            fetchInvitations();
            fetchTrips();
        } catch (err) {
            setError("Failed to accept invitation");
        }
    };

    const handleDecline = async (participantId) => {
        try {
            await declineInvitation(token, participantId);
            fetchInvitations();
        } catch (err) {
            setError("Failed to decline invitation");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="page">
                <div className="page-header">
                    <h2>My Trips</h2>
                    <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                        + New Trip
                    </button>
                </div>

                {error && <p className="error">{error}</p>}

                {showForm && (
                    <div className="form-container">
                        <h3>Create Trip</h3>
                        <form onSubmit={handleCreateTrip}>
                            <input placeholder="Trip name" value={tripName}
                                onChange={(e) => setTripName(e.target.value)} />
                            <input placeholder="Destination" value={destination}
                                onChange={(e) => setDestination(e.target.value)} />
                            <input type="date" value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} />
                            <input type="date" value={endDate}
                                onChange={(e) => setEndDate(e.target.value)} />
                            <button type="submit" className="btn-primary">Create</button>
                            <button type="button" className="btn-secondary"
                                onClick={() => setShowForm(false)} style={{ marginLeft: "8px" }}>
                                Cancel
                            </button>
                        </form>
                    </div>
                )}

                {invitations.length > 0 && (
                    <div className="invitation-card">
                        <h3 style={{ marginBottom: "12px" }}>Pending Invitations</h3>
                        {invitations.map(inv => (
                            <div key={inv.participantId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eee" }}>
                                <span>Trip invitation — Role: {inv.role}</span>
                                <div>
                                    <button className="btn-success" onClick={() => handleAccept(inv.participantId)}
                                        style={{ marginRight: "8px" }}>Accept</button>
                                    <button className="btn-danger" onClick={() => handleDecline(inv.participantId)}>
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {trips.map(trip => (
                    <div key={trip.tripId} className="card"
                        onClick={() => navigate(`/trips/${trip.tripId}`)}>
                        <h3>{trip.tripName}</h3>
                        <p>{trip.destination}</p>
                        <p>{trip.startDate} → {trip.endDate}</p>
                    </div>
                ))}

                {trips.length === 0 && <p>No trips yet. Create your first trip!</p>}
            </div>
        </div>
    );
}

export default TripsPage;