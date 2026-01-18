
"use client";

import styles from "../signin/SignIn.module.css"; 
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Registration failed");
        return;
      }

      setSuccess("✅ Registration successful! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              name="full_name"
              className={styles.input} 
              placeholder="Enter your name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              className={styles.input} 
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              className={styles.input} 
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p style={{ color: "#ef4444", fontSize: "0.9rem", marginTop: "10px" }}>{error}</p>}
          {success && <p style={{ color: "#22c55e", fontSize: "0.9rem", marginTop: "10px" }}>{success}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#ccc" }}>
          Already have an account?{" "}
          <Link href="/signin" style={{ color: "#6366f1", fontWeight: "bold" }}>
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}