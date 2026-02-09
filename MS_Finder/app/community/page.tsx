"use client";

import Link from "next/link";
import styles from "./community.module.css";

export default function CommunityPage() {
  return (
    <main className={styles.mainContainer}>

      <section className={styles.sectionCard}>
        <h1 className={styles.title}>Join the Conversation</h1>
        <p className={styles.text}>
          Share your cinematic experiences with others. M&S Finder is more than just a tool; 
          it's a place for movie lovers to connect.
        </p>

        <Link href="/community/add-comment" className={styles.submitBtn}>
          Write a Comment
        </Link>
      </section>

      <section className={styles.sectionCard}>
        <h2 className={`${styles.title} ${styles.sectionSubtitle}`}>Reviews & Comments</h2>
        <p className={styles.text}>
          Check out what the community is saying about the latest releases. 
          Rate your favorites and leave your thoughts.
        </p>
        <Link href="/community/reviews" className={styles.submitBtn}>
          Explore All Reviews
        </Link>
      </section>

      <section className={styles.sectionCard} style={{ textAlign: 'center' }}>
        <div className={styles.statsContainer}>
          <div>
            <h3 className={styles.statsNumber}>1.2k</h3>
            <p className={styles.text}>Reviews</p>
          </div>
          <div>
            <h3 className={styles.statsNumber}>500+</h3>
            <p className={styles.text}>Members</p>
          </div>
        </div>
      </section>

    </main>
  );
}
