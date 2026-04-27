import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { useState } from "react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const greenIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

function ClickHandler({ onMapClick, readOnly }) {
    useMapEvents({
        click(e) {
            if (readOnly) return;
            onMapClick(e.latlng.lat, e.latlng.lng);
        }
    });
    return null;
}

function FlyToLocation({ coords, onDone }) {
    const map = useMap();
    if (coords) {
        map.setView(coords, 13);
        onDone();
    }
    return null;
}

function MapComponent({ places, onAddPlace, onDeletePlace, readOnly = false }) {
    const [pendingPlace, setPendingPlace] = useState(null);
    const [placeName, setPlaceName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [flyTo, setFlyTo] = useState(null);
    const [searchMarker, setSearchMarker] = useState(null);
    const [searchLabel, setSearchLabel] = useState("");
    const [mapError, setMapError] = useState("");

    if (!places || !Array.isArray(places)) return <div>Loading map...</div>;

    const handleMapClick = (lat, lng) => {
        if (readOnly) return;
        setPendingPlace({ lat, lng });
        setPlaceName("");
        setSearchMarker(null);
    };

    const handleConfirm = () => {
        if (placeName.trim()) {
            onAddPlace({ name: placeName, latitude: pendingPlace.lat, longitude: pendingPlace.lng });
            setPendingPlace(null);
            setPlaceName("");
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
            );
            const data = await response.json();
            if (data.length > 0) {
                const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                setMapError("");
                setFlyTo(coords);
                setSearchMarker(coords);
                setSearchLabel(data[0].display_name.split(",")[0]);
            } else {
                setMapError("Location not found");
            }
        } catch (err) {
            setMapError("Search failed");
        }
    };

    return (
        <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <input
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    style={{ marginBottom: 0 }}
                />
                <button className="btn-primary" onClick={handleSearch}>Search</button>
            </div>

            {mapError && (
                <p style={{ color: "red", fontSize: "13px", marginBottom: "8px", cursor: "pointer" }}
                    onClick={() => setMapError("")}>
                    {mapError} ✕
                </p>
            )}

            <MapContainer
                center={[48.8566, 2.3522]}
                zoom={5}
                style={{ height: "400px", borderRadius: "8px", marginBottom: "12px" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                <ClickHandler onMapClick={handleMapClick} readOnly={readOnly} />
                <FlyToLocation coords={flyTo} onDone={() => setFlyTo(null)} />
                {searchMarker && (
                    <Marker position={searchMarker} icon={greenIcon}>
                        <Popup>
                            {searchLabel}
                            <br />
                            <button onClick={() => setSearchMarker(null)}
                                style={{ color: "gray", border: "none", background: "none", cursor: "pointer", fontSize: "12px" }}>
                                ✕ Clear
                            </button>
                        </Popup>
                    </Marker>
                )}
                {places.map(place => (
                    <Marker key={place.placeId} position={[place.latitude, place.longitude]}>
                        <Popup>
                            <strong>{place.name}</strong>
                            {!readOnly && (
                                <>
                                    <br />
                                    <button onClick={() => onDeletePlace(place.placeId)}
                                        style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {pendingPlace && (
                <div className="form-container">
                    <p>Add place at {pendingPlace.lat.toFixed(4)}, {pendingPlace.lng.toFixed(4)}</p>
                    <input
                        placeholder="Place name"
                        value={placeName}
                        onChange={(e) => setPlaceName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                    />
                    <button className="btn-primary" onClick={handleConfirm}>Save</button>
                    <button className="btn-secondary" onClick={() => setPendingPlace(null)}
                        style={{ marginLeft: "8px" }}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default MapComponent;