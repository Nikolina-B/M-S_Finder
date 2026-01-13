
"use client";

import React from "react";
import styles from "./Hero.module.css";
import Link from "next/link"; 

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>Discover and enjoy movies and series</h1>
        <p>Create a free account to save your watchlist, write reviews.</p>

       
        <Link href="/explore">
          <button className={styles.startButton}>Start Exploring</button>
        </Link>
      </div>
    </section>
  );
}
