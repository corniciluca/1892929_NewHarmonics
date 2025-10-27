// In songApi.js
import { apiRequest } from './api'; // 1. Import the helper

// 2. Remove the old BASE_URL. apiRequest uses API_GATEWAY_URL

export async function getSongs() {
  // 3. Use apiRequest for all functions
  return apiRequest('/songs');
}

export async function getSongsByArtistId(artistId) {
  // Use apiRequest to send the auth token automatically
  return apiRequest(`/songs/artist/${artistId}`);
}

export async function getSong(id) {
  return apiRequest(`/songs/${id}`);
}

export async function uploadSong({ file, title, artist, artistId, album, genre }) {
  const formData = new FormData();
  if (file) formData.append("file", file);
  formData.append("title", title);
  formData.append("artist", artist);
  formData.append("artistId", artistId);
  formData.append("album", album);
  formData.append("genre", genre);

  // 4. Use apiRequest for the upload
  return apiRequest('/songs/upload', {
    method: "POST",
    body: formData, // The change in api.js will handle this correctly
  });
}

export async function updateSong(id, song) {
  return apiRequest(`/songs/${id}`, {
    method: "PUT",
    body: JSON.stringify(song), // apiRequest will set 'Content-Type: json'
  });
}

export async function deleteSong(id) {
  return apiRequest(`/songs/${id}`, { method: "DELETE" });
}

// Search endpoints (Elasticsearch powered on the backend)
export async function searchSongs(q) {
  const encoded = encodeURIComponent(q || '');
  return apiRequest(`/songs/search?q=${encoded}`);
}

export async function searchSongsByTitle(q) {
  const encoded = encodeURIComponent(q || '');
  return apiRequest(`/songs/search/title?q=${encoded}`);
}

export async function getTrendingSongs() {
  return apiRequest('/songs/search/trending');
}

export async function getRecentSongs() {
  return apiRequest('/songs/search/recent');
}

export async function getUserFeed(userId) {
  return apiRequest(`/feed/${userId}`);
}