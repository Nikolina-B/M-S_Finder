import React from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1>Discover Amazing Movies</h1>
          <p>Find your favorites, explore by genre, and stay up-to-date with the latest releases.</p>
          <button>Get Started</button>
        </div>
      </div>
    </section>
  );
}

