
"use client"; 

import styles from "./SignIn.module.css";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign In</h1>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label> 
          <input type="email" className={styles.input} placeholder="Enter your email" />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Password</label>
          <input type="password" className={styles.input} placeholder="Enter your password" />
        </div>

        <button className={styles.button}>Login</button>

        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#ccc" }}>
          Don't have an account?{" "}
          <Link href="/register" style={{ color: "#6366f1", fontWeight: "bold" }}>
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}