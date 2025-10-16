import React, { useState } from "react";

export default function UploadSongTest() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [ok, setOk] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setOk(null);

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("album", album);
    formData.append("genre", genre);

    try {
      const res = await fetch("http://localhost:8082/songs/upload", { // Or "http://localhost:8082/songs/upload" for direct service call
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      setOk("Song uploaded: " + JSON.stringify(data));
    } catch (e) {
      console.error("Fetch error:", e);
      setError(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2em auto" }}>
      <h2>Upload Song Test</h2>
      <form onSubmit={handleSubmit}>
        <input
          style={{ display: "block", marginBottom: 10 }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          style={{ display: "block", marginBottom: 10 }}
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Artist"
        />
        <input
          style={{ display: "block", marginBottom: 10 }}
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          placeholder="Album"
        />
        <input
          style={{ display: "block", marginBottom: 10 }}
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Genre"
        />
        <input
          style={{ display: "block", marginBottom: 10 }}
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload Song</button>
      </form>
      {ok && <div style={{ color: "green", marginTop: 10 }}>{ok}</div>}
      {error && (
        <div style={{ color: "red", marginTop: 10 }}>Error: {error}</div>
      )}
    </div>
  );
}