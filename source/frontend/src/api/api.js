// L'URL di base ora punta sempre all'API Gateway
const API_GATEWAY_URL = 'http://localhost:9000';

/**
 * Funzione helper per tutte le chiamate API.
 * Aggiunge l'header di autorizzazione se è presente un token.
 * Gestisce la logica di base della richiesta e degli errori.
 * È esportata per essere usata da altri file API (es. userApi.js).
 */
export async function apiRequest(path, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // --- ADD THIS BLOCK ---
    // If we are sending FormData (like a file), we MUST let the browser
    // set the Content-Type header itself (so it can add the 'boundary').
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }
    // --- END OF NEW BLOCK ---

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_GATEWAY_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        // Tenta di leggere il corpo dell'errore, altrimenti usa lo status
        const errorBody = await response.json().catch(() => ({ message: `HTTP Error: ${response.status}` }));
        // Check for the "error" key from your gateway filter
        throw new Error(errorBody.error || errorBody.message || 'Qualcosa è andato storto');
    }

    // Evita errori se la risposta non ha corpo (es. su DELETE o Logout)
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

/**
 * Esegue il login e salva il token e i dati utente.
 * @returns {Promise<any>} I dati dell'utente.
 */
export async function login(username, password) {
    const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });

    // Salva solo il token. L'app recupererà l'utente separatamente.
    if (response && response.token) {
        localStorage.setItem('authToken', response.token);
    } else {
        localStorage.removeItem('authToken');
        throw new Error("La risposta del login non è valida.");
    }
    // Non restituisce più l'utente
}

/**
 * Esegue il logout pulendo il localStorage.
 * Non è necessario chiamare un endpoint se il backend è stateless (JWT).
 */
export function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
}

/**
 * Chiama l'endpoint di registrazione.
 */
export async function register(user) {
    // 1. CHIAMATA A /auth/register (come da filtro gateway)
    const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(user),
    });

    // 2. SALVA IL TOKEN
    if (response && response.token) {
        localStorage.setItem('authToken', response.token);
    } else {
        throw new Error("La risposta della registrazione non è valida.");
    }
}

/**
* Verifica se il token è valido chiamando il nuovo endpoint.
 * @returns {Promise<any>} Dati di validazione: { valid: true, userId: "1", ... }
 */
export async function checkLoginStatus() {
    // 3. CHIAMA /auth/validate
    return apiRequest('/auth/validate');
}

