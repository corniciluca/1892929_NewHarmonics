// This now points to the API Gateway, which will route to the song service
const BASE_URL = "http://localhost:8082/songs";

export async function getSongs() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function getSong(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
}

export async function uploadSong({ file, title, artist, album, genre }) {
  const formData = new FormData();
  if (file) formData.append("file", file);
  formData.append("title", title);
  formData.append("artist", artist);
  formData.append("album", album);
  formData.append("genre", genre);

  // Note: The upload path is directly to the service for now
  const res = await fetch(`http://localhost:8082/songs/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateSong(id, song) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(song),
  });
  return res.json();
}

export async function deleteSong(id) {
  return fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}