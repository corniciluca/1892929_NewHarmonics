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