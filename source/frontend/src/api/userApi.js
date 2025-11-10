/**
 * Questo file contiene tutte le funzioni API specifiche per la gestione degli utenti.
 */
import { apiRequest } from './api';

/**
 * Ottiene i dati di un utente specifico tramite il suo ID.
 * Utile per la pagina del profilo pubblico.
 * @param {number | string} userId - L'ID dell'utente da recuperare.
 * @returns {Promise<any>} - I dati dell'utente.
 */
export const getUserById = (userId) => {
    return apiRequest(`/users/${userId}`);
};

/**
 * Aggiorna i dati dell'utente attualmente loggato.
 * @param {number | string} userId - L'ID dell'utente da aggiornare.
 * @param {object} userData - I nuovi dati dell'utente.
 * @returns {Promise<any>} - I dati dell'utente aggiornati.
 */
export const updateUser = (userId, userData) => {
    return apiRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
};

/**
 * Elimina l'account di un utente.
 * @param {number | string} userId - L'ID dell'utente da eliminare.
 * @returns {Promise<any>}
 */
export const deleteUser = (userId) => {
    return apiRequest(`/users/${userId}`, {
        method: 'DELETE',
    });
};

/**
 * Ottiene la lista degli artisti seguiti dall'utente specificato.
 * Corrisponde a GET /users/{id}/followed.
 * @param {number | string} userId - L'ID dell'utente (follower).
 * @returns {Promise<Array<any>>} - Array di oggetti utente (artisti).
 */
export const getFollowedArtists = (userId) => {
    return apiRequest(`/users/${userId}/followed`);
};


/**
 * Aggiunge un artista alla lista dei seguiti dell'utente loggato.
 * Corrisponde al percorso corretto: POST /users/follow/{artistId}.
 * NON passa il followerId nel path, lo ottiene dal JWT/X-User-Id header.
 * @param {number | string} artistId - L'ID dell'artista da seguire.
 * @returns {Promise<void>}
 */
export const followArtist = (artistId) => {
    return apiRequest(`/users/follow/${artistId}`, {
        method: 'POST',
    });
};

/**
 * Rimuove un artista dalla lista dei seguiti dell'utente loggato.
 * Corrisponde al percorso corretto: DELETE /users/unfollow/{artistId}.
 * NON passa il followerId nel path, lo ottiene dal JWT/X-User-Id header.
 * @param {number | string} artistId - L'ID dell'artista da smettere di seguire.
 * @returns {Promise<void>}
 */
export const unfollowArtist = (artistId) => {
    return apiRequest(`/users/unfollow/${artistId}`, {
        method: 'DELETE',
    });
};