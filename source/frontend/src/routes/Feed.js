import React, { useState, useEffect } from 'react';

function FeedPage() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeed = async () => {
            const token = localStorage.getItem('authToken'); // Get the stored JWT

            if (!token) {
                setError("You must be logged in to view your feed.");
                setLoading(false);
                return;
            }

            try {
                // The URL MUST use the API GATEWAY's exposed port (9000),
                // typically defined in an environment variable or config file.
                const apiUrl = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:9000';

                const response = await fetch(`${apiUrl}/feed`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Pass the JWT in the Authorization header
                        'Content-Type': 'application/json',
                    }
                });

                if (response.status === 401 || response.status === 403) {
                    setError("Authentication failed. Please log in again.");
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setSongs(data);
            } catch (e) {
                setError(e.message || "Failed to fetch feed data.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    if (loading) return <div>Loading your feed...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Your Personalized Feed</h1>
            {songs.length === 0 ? (
                <p>No songs in your feed yet. Follow some artists!</p>
            ) : (
                <ul>
                    {songs.map(song => (
                        <li key={song.id}>{song.title} by {song.artist}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default FeedPage;