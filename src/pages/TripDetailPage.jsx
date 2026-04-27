import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrip, getParticipants, inviteParticipant, getExpenses, createExpense, deleteExpense, deleteTrip, removeParticipant, changeRole, getPlaces, addPlace, deletePlace, updateTrip } from "../services/api";
import Navbar from "../components/Navbar";
import MapComponent from "../components/MapComponent";

function TripDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    const [trip, setTrip] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [places, setPlaces] = useState([]);
    const [error, setError] = useState("");
    const [myRole, setMyRole] = useState(null);

    const [showInviteForm, setShowInviteForm] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("PARTICIPANT");

    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenseDescription, setExpenseDescription] = useState("");

    const [showEditForm, setShowEditForm] = useState(false);
    const [editTripName, setEditTripName] = useState("");
    const [editDestination, setEditDestination] = useState("");
    const [editStartDate, setEditStartDate] = useState("");
    const [editEndDate, setEditEndDate] = useState("");

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [tripData, participantsData, expensesData, placesData] = await Promise.all([
                getTrip(token, id),
                getParticipants(token, id),
                getExpenses(token, id),
                getPlaces(token, id)
            ]);
            setTrip(tripData);
            setParticipants(participantsData);
            setExpenses(expensesData);
            setPlaces(Array.isArray(placesData) ? placesData : []);
            const me = participantsData.find(p => p.username === username);
            if (me) setMyRole(me.role);
        } catch (err) {
            setError("Failed to load trip data");
        }
    };

    const handleDeleteTrip = async () => {
        if (!window.confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
            return;
        }
        try {
            await deleteTrip(token, id);
            navigate("/trips");
        } catch (err) {
            setError("Failed to delete trip");
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await inviteParticipant(token, id, inviteEmail, inviteRole);
            if (data.status === 404) {
                setError("User not found — check the email address");
                return;
            }
            if (data.status === 409) {
                setError("User is already a participant of this trip");
                return;
            }
            setShowInviteForm(false);
            setInviteEmail("");
            fetchAll();
        } catch (err) {
            setError("Failed to invite participant");
        }
    };

    const handleRemoveParticipant = async (participantId) => {
        try {
            await removeParticipant(token, participantId);
            fetchAll();
        } catch (err) {
            setError("Failed to remove participant");
        }
    };

    const handleChangeRole = async (participantId, role) => {
        try {
            await changeRole(token, participantId, role);
            fetchAll();
        } catch (err) {
            setError("Failed to change role");
        }
    };

    const handleCreateExpense = async (e) => {
        e.preventDefault();
        try {
            await createExpense(token, id, {
                name: expenseName,
                amount: parseFloat(expenseAmount),
                description: expenseDescription
            });
            setShowExpenseForm(false);
            setExpenseName("");
            setExpenseAmount("");
            setExpenseDescription("");
            fetchAll();
        } catch (err) {
            setError("Failed to create expense");
        }
    };


    const handleDeleteExpense = async (expenseId) => {
        try {
            await deleteExpense(token, expenseId);
            fetchAll();
        } catch (err) {
            setError("Failed to delete expense");
        }
    };

    const handleAddPlace = async (placeData) => {
        try {
            await addPlace(token, id, placeData);
            fetchAll();
        } catch (err) {
            setError("Failed to add place");
        }
    };

    const handleDeletePlace = async (placeId) => {
        try {
            await deletePlace(token, placeId, id);
            fetchAll();
        } catch (err) {
            setError("Failed to delete place");
        }
    };

    const handleUpdateTrip = async (e) => {
        e.preventDefault();
        if (!editTripName.trim() || !editDestination.trim()) {
            setError("Trip name and destination are required");
            return;
        }
        if (editStartDate && editEndDate && editEndDate < editStartDate) {
            setError("End date cannot be before start date");
            return;
        }
        try {
            await updateTrip(token, id, {
                tripName: editTripName,
                destination: editDestination,
                startDate: editStartDate || null,
                endDate: editEndDate || null
            });
            setShowEditForm(false);
            fetchAll();
        } catch (err) {
            setError("Failed to update trip");
        }
    };

    if (!trip) return <div style={{ padding: "40px" }}>Loading...</div>;

    const isGuest = myRole === "GUEST";
    const isAdmin = myRole === "ADMIN";

    return (
        <div>
            <Navbar />
            <div className="page">
                <button className="btn-secondary" onClick={() => navigate("/trips")}>← Back</button>

                {error && <p className="error" onClick={() => setError("")} style={{ cursor: "pointer" }}>{error} ✕</p>}
                {showDeleteConfirm && (
                    <div style={{
                        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                        background: "rgba(0,0,0,0.5)", display: "flex",
                        justifyContent: "center", alignItems: "center", zIndex: 1000
                    }}>
                        <div style={{
                            background: "white", padding: "32px", borderRadius: "8px",
                            maxWidth: "400px", width: "90%", textAlign: "center"
                        }}>
                            <h3 style={{ marginBottom: "12px" }}>Delete Trip</h3>
                            <p style={{ marginBottom: "24px", color: "#666" }}>
                                Are you sure you want to delete <strong>{trip.tripName}</strong>? This action cannot be undone.
                            </p>
                            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                                <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                                    Cancel
                                </button>
                                <button className="btn-danger" onClick={handleDeleteTrip}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="page-header" style={{ marginTop: "20px" }}>
                    <div>
                        <h2>{trip.tripName}</h2>
                        <p>{trip.destination}</p>
                        <p style={{ fontSize: "13px", color: "#666" }}>{trip.startDate} → {trip.endDate}</p>
                    </div>
                    {isAdmin && (
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button className="btn-secondary" onClick={() => {
                                setEditTripName(trip.tripName);
                                setEditDestination(trip.destination);
                                setEditStartDate(trip.startDate);
                                setEditEndDate(trip.endDate);
                                setShowEditForm(!showEditForm);
                            }}>Edit</button>
                            <button className="btn-danger" onClick={() => setShowDeleteConfirm(true)}>Delete Trip</button>
                        </div>
                    )}
                </div>

                {showEditForm && (
                    <div className="form-container">
                        <h3>Edit Trip</h3>
                        <form onSubmit={handleUpdateTrip}>
                            <input placeholder="Trip name" value={editTripName}
                                onChange={(e) => setEditTripName(e.target.value)} />
                            <input placeholder="Destination" value={editDestination}
                                onChange={(e) => setEditDestination(e.target.value)} />
                            <input type="date" value={editStartDate}
                                onChange={(e) => setEditStartDate(e.target.value)} />
                            <input type="date" value={editEndDate}
                                onChange={(e) => setEditEndDate(e.target.value)} />
                            <button type="submit" className="btn-primary">Save</button>
                            <button type="button" className="btn-secondary"
                                onClick={() => setShowEditForm(false)} style={{ marginLeft: "8px" }}>Cancel</button>
                        </form>
                    </div>
                )}

                <hr />

                <div className="section-header">
                    <h3>Participants</h3>
                    {isAdmin && (
                        <button className="btn-primary" onClick={() => setShowInviteForm(!showInviteForm)}>+ Invite</button>
                    )}
                </div>

                {showInviteForm && (
                    <div className="form-container">
                        <form onSubmit={handleInvite}>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <input placeholder="Email" value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    style={{ marginBottom: 0 }} />
                                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                                    style={{ marginBottom: 0 }}>
                                    <option value="PARTICIPANT">Participant</option>
                                    <option value="GUEST">Guest</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                                <button type="submit" className="btn-primary">Invite</button>
                                <button type="button" className="btn-secondary"
                                    onClick={() => setShowInviteForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {participants
                    .filter(p => p.status !== "DECLINED")
                    .map(p => (
                        <div key={p.participantId} className="card"
                            style={{ cursor: "default", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span><strong>{p.username}</strong> — {p.role} — {p.status}</span>
                            {isAdmin && p.username !== username && (
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <select value={p.role}
                                        onChange={(e) => handleChangeRole(p.participantId, e.target.value)}
                                        style={{ marginBottom: 0, width: "auto" }}>
                                        <option value="ADMIN">Admin</option>
                                        <option value="PARTICIPANT">Participant</option>
                                        <option value="GUEST">Guest</option>
                                    </select>
                                    <button className="btn-danger"
                                        onClick={() => handleRemoveParticipant(p.participantId)}>
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                {participants.filter(p => p.status !== "DECLINED").length === 0 && <p>No participants yet.</p>}

                <hr />

                <div className="section-header">
                    <h3>Expenses</h3>
                    {!isGuest && (
                        <button className="btn-primary" onClick={() => setShowExpenseForm(!showExpenseForm)}>
                            + Add Expense
                        </button>
                    )}
                </div>

                {showExpenseForm && (
                    <div className="form-container">
                        <form onSubmit={handleCreateExpense}>
                            <input placeholder="Name" value={expenseName}
                                onChange={(e) => setExpenseName(e.target.value)} />
                            <input placeholder="Amount" type="number" value={expenseAmount}
                                onChange={(e) => setExpenseAmount(e.target.value)} />
                            <input placeholder="Description (optional)" value={expenseDescription}
                                onChange={(e) => setExpenseDescription(e.target.value)} />
                            <button type="submit" className="btn-primary">Add</button>
                            <button type="button" className="btn-secondary"
                                onClick={() => setShowExpenseForm(false)} style={{ marginLeft: "8px" }}>Cancel</button>
                        </form>
                    </div>
                )}

                {expenses.map(e => (
                    <div key={e.expenseId} className="card"
                        style={{ cursor: "default", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <strong>{e.name}</strong> — €{e.amount}
                            {e.description && <p>{e.description}</p>}
                            <p>By: {e.createdByUsername}</p>
                        </div>
                        {!isGuest && e.createdByUsername === username && (
                            <button className="btn-danger" onClick={() => handleDeleteExpense(e.expenseId)}>
                                Delete
                            </button>
                        )}
                    </div>
                ))}
                {expenses.length === 0 && <p>No expenses yet.</p>}

                <hr />

                <h3>Places</h3>
                {!isGuest && (
                    <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>
                        Click on the map to add a place
                    </p>
                )}
                <MapComponent
                    places={places}
                    onAddPlace={handleAddPlace}
                    onDeletePlace={handleDeletePlace}
                    readOnly={isGuest}
                />
            </div>
        </div>
    );
}

export default TripDetailPage;