"use client";

import styles from "../signin/SignIn.module.css"; 
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth/auth-client"; 
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "", // Better Auth koristi 'name' za puno ime
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    setError("");
    setSuccess("");

    // Pozivamo Better Auth signUp metodu umjesto fetch-a
    await authClient.signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      callbackURL: "/", // Kamo preusmjeriti nakon uspjeha
    }, {
      onRequest: () => {
        setLoading(true);
      },
      onResponse: () => {
        setLoading(false);
      },
      onError: (ctx) => {
        // Prikazuje točnu grešku (npr. "Email already in use")
        setError(ctx.error.message);
      },
      onSuccess: () => {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => {
          router.push("/"); // Vodi korisnika na početnu stranicu
        }, 1500);
      },
    });
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name</label>
            <input 
              type="text" 
              name="name" // Promijenjeno u 'name' kako bi odgovaralo authClient-u
              className={styles.input} 
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
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
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
             <input 
  type={showPassword ? "text" : "password"} // ✅ text ili password
  name="password"                             // OBAVEZNO za handleChange
  className={`${styles.input} ${styles.passwordInput}${error ? styles.inputError : ""}`}
  placeholder="Enter your password" 
  value={formData.password}
  onChange={handleChange}
  required
/>

              <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.passwordToggle}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <AiOutlineEye size={16}/> : <AiOutlineEyeInvisible size={16}/>}
              </button>
            </div>
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