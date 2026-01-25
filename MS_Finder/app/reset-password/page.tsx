
"use client"; 

import styles from "../signin/SignIn.module.css";
import Link from "next/link";
import { authClient } from "@/app/lib/auth/auth-client"; 
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";




export default function ResetPasswordPage() {

const searchParams = useSearchParams();
 const token = searchParams.get("token");
  const router = useRouter();

  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Min. 8 characters.");
    if (!token) {
      setError("Invalid or expired reset link.");
      return;
    }
     await authClient.resetPassword(
      {
        token:token,
        newPassword: password,
      },
      {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onSuccess: () => {
          router.push("/signin");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      }
    );
  };
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.subtitle}>Enter your new password.</p>
        
        {/* Dodan form tag za handleSubmit */}
        <form onSubmit={handleResetPassword}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input 
                type={ showPassword ? "" : "password" }
                className={`${styles.input} ${styles.passwordInput}${error ? styles.inputError : ""}`}
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          
          {/* Prikaz greške ako prijava ne uspije */}
          {error && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "10px" }}>{error}</p>}
          
          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Reseting..." : "Reset"}
          </button>

        </form>

       
      </div>
    </main>
  );
}

