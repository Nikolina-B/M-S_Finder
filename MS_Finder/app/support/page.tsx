
"use client";

import { useState } from "react";
import styles from "./support.module.css"; 

export default function SupportPage() {
  const [status, setStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Message sent successfully!");
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <main className={styles.mainContainer}>
      
     
      <section className={styles.sectionCard}>
        <h1 className={styles.title}>About Us</h1>
        <p className={styles.text}>
          Welcome to M&S Finder. We are dedicated to providing the best experience 
          for our community. Our mission is to help you find and track your 
          favorite content easily and efficiently.
        </p>
      </section>

      
      <section className={styles.sectionCard}>
        <h2 className={styles.title} style={{ fontSize: "1.6rem" }}>Contact Us</h2>
        <form onSubmit={handleSubmit} className={styles.formList}>
          
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Your Name</label>
            <input type="text" className={styles.inputField} required placeholder="Enter your name" />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email Address</label>
            <input type="email" className={styles.inputField} required placeholder="Enter your email" />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Message</label>
            <textarea 
              className={styles.inputField} 
              rows={4} 
              required 
              placeholder="How can we help you?"
              style={{ resize: "none", fontFamily: "inherit" }}
            ></textarea>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Send Message
          </button>
        </form>

        {status && <p className={styles.statusMessage}>{status}</p>}
      </section>

    </main>
  );
}