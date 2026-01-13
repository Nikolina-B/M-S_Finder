
"use client";

import styles from "../signin/SignIn.module.css"; 
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        
        <div className={styles.inputGroup}>
          <label>Full Name</label>
          <input type="text" className={styles.input} placeholder="Enter your name" />
        </div>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input type="email" className={styles.input} placeholder="Enter your email" />
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input type="password" className={styles.input} placeholder="Create a password" />
        </div>

        <button className={styles.button}>Register</button>

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