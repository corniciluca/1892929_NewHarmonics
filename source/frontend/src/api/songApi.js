// In songApi.js
import { apiRequest } from './api'; // 1. Import the helper


export async function getSongs() {
  // Use apiRequest for all functions
  return apiRequest('/songs');
}

export async function getSongsByArtistId(artistId) {
  // Use apiRequest to send the auth token automatically
  return apiRequest(`/songs/artist/${artistId}`);
}

export async function getSong(id) {
  return apiRequest(`/songs/${id}`);
}

export async function uploadSong({ file, title, artist, artistId, album, genre, coverImageFile }) {
  const formData = new FormData();
  if (file) formData.append("file", file);
  if (coverImageFile) formData.append("coverImage", coverImageFile);
  formData.append("title", title);
  formData.append("artist", artist);
  formData.append("artistId", artistId);
  formData.append("album", album);
  formData.append("genre", genre);

  // Use apiRequest for the upload
  return apiRequest('/songs/upload', {
    method: "POST",
    body: formData,
  });
}

export async function updateSong(id, song) {
  return apiRequest(`/songs/${id}`, {
    method: "PUT",
    body: JSON.stringify(song), // apiRequest will set 'Content-Type: json'
  });
}

/**
 * Updates a song's details, including optional audio and cover files.
 * This sends multipart/form-data.
 * @param {string} id - The ID of the song to update.
 * @param {object} songData - An object { title, album, genre, audioFile, coverFile }.
 */
export async function updateSongDetails(id, songData) {
  const formData = new FormData();

  // Add text data
  formData.append("title", songData.title);
  formData.append("album", songData.album);
  formData.append("genre", songData.genre);

  // Conditionally add files (if they are not null)
  if (songData.audioFile) {
    formData.append("audioFile", songData.audioFile);
  }
  if (songData.coverFile) {
    // Note: The backend controller expects "coverFile"
    formData.append("coverFile", songData.coverFile);
  }

  // Use the new endpoint
  return apiRequest(`/songs/${id}/update`, {
    method: "POST",
    body: formData, // apiRequest will handle FormData correctly (no JSON.stringify)
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
  return apiRequest('/feed');
}

/**
 * Likes a specific song.
 * Corresponds to POST /songs/{songId}/like.
 * @param {string} songId - The ID of the song to like.
 * @returns {Promise<void>}
 */
export const likeSong = (songId) => {
    return apiRequest(`/songs/${songId}/like`, {
        method: 'POST',
    });
};

/**
 * Unlikes a specific song.
 * Corresponds to DELETE /songs/{songId}/like.
 * @param {string} songId - The ID of the song to unlike.
 * @returns {Promise<void>}
 */
export const unlikeSong = (songId) => {
    return apiRequest(`/songs/${songId}/like`, {
        method: 'DELETE',
    });
};

/**
 * Gets the list of songs liked by the currently authenticated user.
 * Corresponds to GET /songs/liked. The user is identified via the JWT/X-User-Id header.
 * @returns {Promise<Array<any>>} - Array of song objects.
 */
export const getLikedSongs = () => {
    return apiRequest('/songs/liked');
}