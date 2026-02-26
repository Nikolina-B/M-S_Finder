
"use client"; 

import styles from "../signin/SignIn.module.css";
import Link from "next/link";
import { authClient } from "@/app/lib/auth/auth-client"; 
import { useState } from "react";
import { useRouter } from "next/navigation";



export default function ForgotPasswordPage() {

  const [email,setEmail] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  //const router = useRouter();
  const [success, setSuccess]=useState("");


  const formatError = (msg: string) => {
    if (msg.includes("Invalid email")) return "Please enter a valid email address.";
    return msg;
  };
const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    await authClient.requestPasswordReset({
      email,
      redirectTo:`${window.location.origin}/reset-password`,
      
    }, {
      onRequest: () => {
        setLoading(true);
      },
      onResponse: () => {
        setLoading(false);
      },
      onSuccess:()=>{
        setSuccess(
            "If an account with that email exists, you will recieve a password reset link shortly."
        );

      },
      
      onError: (ctx) => {
        
        setError(formatError(ctx.error.message || "Something went wrong."));
      },
    
    });
  };
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Forgot password?</h1>
        <p className={styles.subtitle}>Enter your mail to reset the password.</p>
        
        {/* Dodan form tag za handleSubmit */}
        <form onSubmit={handleForgotPassword}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input 
              type="email" 
              className={`${styles.input} ${error ? styles.inputError : ""}`}
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
        
          {error && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "10px" }}>{error}</p>}
          {success && <p style={{color:"#22c55e",fontSize: "0.85rem", marginBottom: "10px"}}>{success}</p>}
          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

        </form>

       
      </div>
    </main>
  );
}

