

// export default function CommunityPage() {
//   return (
//     <main>
     
//       <h1>Community</h1>
//       <p>Reviews and Comments</p>
//     </main>
//   );
// }
"use client";

import Link from "next/link";
import styles from "../support/support.module.css"; 

export default function CommunityPage() {
  return (
    <main className={styles.mainContainer}>
      
    
      <section className={styles.sectionCard}>
        <h1 className={styles.title}>Join the Conversation</h1>
        <p className={styles.text}>
          Share your cinematic experiences with others. M&S Finder is more than just a tool; 
          it's a place for movie lovers to connect.
        </p>
      </section>

      
      <section className={styles.sectionCard}>
        <h2 className={styles.title} style={{ fontSize: "1.5rem" }}>Reviews & Comments</h2>
        <p className={styles.text} style={{ marginBottom: "25px" }}>
          Check out what the community is saying about the latest releases. 
          Rate your favorites and leave your thoughts.
        </p>
        
        
        <Link href="/community/reviews" className={styles.submitBtn} style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
          Explore All Reviews
        </Link>
      </section>

   
      <section className={styles.sectionCard} style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <h3 style={{ color: '#6246ea' }}>1.2k</h3>
            <p className={styles.text}>Reviews</p>
          </div>
          <div>
            <h3 style={{ color: '#6246ea' }}>500+</h3>
            <p className={styles.text}>Members</p>
          </div>
        </div>
      </section>

    </main>
  );
}