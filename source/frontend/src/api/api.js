// L'URL di base ora punta sempre all'API Gateway
const API_GATEWAY_URL = 'http://localhost:9000';


export async function apiRequest(path, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

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
    // CHIAMATA A /auth/register (come da filtro gateway)
    const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(user),
    });

    // SALVA IL TOKEN
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
    // CHIAMA /auth/validate
    return apiRequest('/auth/validate');
}

