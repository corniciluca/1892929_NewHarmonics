import React, { useState } from "react";

export default function AddUserTest() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [ok, setOk] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setOk(null);

    const user = { username, email, role, password };

    try {
      const res = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      setOk("User created successfully: " + JSON.stringify(data));
    } catch (e) {
      console.error("Fetch error:", e);
      setError(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2em auto", padding: "2em", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Add User Test</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="username" style={{ display: "block", marginBottom: 5 }}>Username</label>
          <input
            id="username"
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., john_doe"
            required
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: 5 }}>Email</label>
          <input
            id="email"
            type="email"
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., john.doe@example.com"
            required
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="role" style={{ display: "block", marginBottom: 5 }}>Role</label>
          <input
            id="role"
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., ARTIST or LISTENER"
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: 5 }}>Password</label>
          <input
            id="password"
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
          />
        </div>
        <button 
          type="submit"
          style={{ width: "100%", padding: 10, backgroundColor: "#007bff", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
        >
          Create User
        </button>
      </form>
      {ok && <div style={{ color: "green", marginTop: 15, padding: 10, backgroundColor: "#e6ffed", borderRadius: 4 }}>{ok}</div>}
      {error && <div style={{ color: "red", marginTop: 15, padding: 10, backgroundColor: "#ffe6e6", borderRadius: 4 }}>{error}</div>}
    </div>
  );
}
