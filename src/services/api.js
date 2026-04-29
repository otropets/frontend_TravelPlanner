const BASE_URL = "http://localhost:8080";
//const BASE_URL = "https://travelplanner-production-d32c.up.railway.app";

// auth

export const login = async (email, password) => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    return response.json();
};

export const register = async (username, email, password, firstName, lastName) => {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, firstName, lastName })
    });
    return response.json();
};

// trips

export const getTrips = async (token) => {
    const response = await fetch(`${BASE_URL}/api/trips`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
};

export const getTrip = async (token, tripId) => {
    const response = await fetch(`${BASE_URL}/api/trips/${tripId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
};

export const createTrip = async (token, tripData) => {
    const response = await fetch(`${BASE_URL}/api/trips`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(tripData)
    });
    return response.json();
};

export const updateTrip = async (token, tripId, tripData) => {
    const response = await fetch(`${BASE_URL}/api/trips/${tripId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(tripData)
    });
    return response.json();
};

export const deleteTrip = async (token, tripId) => {
    await fetch(`${BASE_URL}/api/trips/${tripId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
};

// participants

export const getParticipants = async (token, tripId) => {
    const response = await fetch(`${BASE_URL}/api/participants/trip/${tripId}/list`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
};

export const inviteParticipant = async (token, tripId, email, role) => {
    const response = await fetch(`${BASE_URL}/api/participants/${tripId}/invite`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email, tripRole: role })
    });
    return response.json();
};

export const acceptInvitation = async (token, participantId) => {
    const response = await fetch(`${BASE_URL}/api/participants/${participantId}/accept`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
};

export const declineInvitation = async (token, participantId) => {
    const response = await fetch(`${BASE_URL}/api/participants/${participantId}/decline`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
};

export const removeParticipant = async (token, participantId) => {
    await fetch(`${BASE_URL}/api/participants/${participantId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
};


// expenses

export const getExpenses = async (token, tripId) => {
    const response = await fetch(`${BASE_URL}/api/expenses/trip/${tripId}/list`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
};

export const createExpense = async (token, tripId, expenseData) => {
    const response = await fetch(`${BASE_URL}/api/expenses/${tripId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(expenseData)
    });
    return response.json();
};

export const deleteExpense = async (token, expenseId) => {
    await fetch(`${BASE_URL}/api/expenses/${expenseId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
};

export const getMyInvitations = async (token) => {
    const response = await fetch(`${BASE_URL}/api/participants/invitations`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
};

// places
export const getPlaces = async (token, tripId) => {
    const response = await fetch(`${BASE_URL}/api/trips/${tripId}/places`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
};

export const addPlace = async (token, tripId, placeData) => {
    const response = await fetch(`${BASE_URL}/api/trips/${tripId}/places`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(placeData)
    });
    return response.json();
};

export const deletePlace = async (token, placeId, tripId) => {
    await fetch(`${BASE_URL}/api/trips/${tripId}/places/${placeId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
};
export const changeRole = async (token, participantId, role) => {
    const response = await fetch(`${BASE_URL}/api/participants/${participantId}/role`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role: role })
    });
    return response.json();
};


export const forgotPassword = async (email) => {
    await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });
};

export const resetPassword = async (token, password) => {
    const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
    });
    console.log("response status:", response.status);
    const text = await response.text();
    console.log("response body:", text);
    
    if (!response.ok) {
        throw new Error(text || "Something went wrong");
    }
};