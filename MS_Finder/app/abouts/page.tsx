// "use client";

// import styles from "./abouts.module.css";
// import Link from "next/link";
// import { HiOutlineArrowLeft } from "react-icons/hi";
// import { FaMagic, FaSmileBeam, FaFilm } from "react-icons/fa"; // Ikone za vizualni dojam

// export default function AboutPage() {
//   return (
//     <main className={styles.aboutContainer}>
      

//       {/* Hero sekcija s tvojim novim tekstom */}
//       <section className={styles.heroSection}>
//         <h1 className={styles.title}>About <span className={styles.highlight}>M&S Finder</span></h1>
//         <p className={styles.mainDescription}>
//           At M&S Finder, we believe finding your next favorite movie or series should be 
//           <strong> fun and effortless</strong>. Gone are the days of endless scrolling—our app 
//           helps you discover exactly what you want, when you want it.
//         </p>
//       </section>

//       {/* Grid sa specifičnim porukama */}
//       <div className={styles.featureGrid}>
//         <div className={styles.featureCard}>
//           <FaSmileBeam className={styles.icon} />
//           <h3>Personal Guide</h3>
//           <p>Think of us as your personal entertainment guide, ready to suggest the perfect film or show for any mood.</p>
//         </div>

//         <div className={styles.featureCard}>
//           <FaMagic className={styles.icon} />
//           <h3>Hidden Gems</h3>
//           <p>Whether you’re in the mood for a timeless classic, a hidden gem, or the latest blockbuster.</p>
//         </div>

//         <div className={styles.featureCard}>
//           <FaFilm className={styles.icon} />
//           <h3>Easy Discovery</h3>
//           <p>M&S Finder makes it easy to explore, choose, and enjoy. No more wasting time, just pure cinema magic.</p>
//         </div>
//       </div>

//       <div className={styles.ctaSection}>
//         <h2>Ready to find your next favorite?</h2>
//         <Link href="/explore" className={styles.exploreBtn}>Explore</Link>
//       </div>
//     </main>
//   );
// }
"use client";

import styles from "./abouts.module.css";
import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { FaMagic, FaSmileBeam, FaFilm, FaCoffee, FaUsers, FaHeart } from "react-icons/fa";

export default function AboutPage() {
  return (
    <main className={styles.aboutContainer}>
     

      {/* Hero sekcija */}
      <section className={styles.heroSection}>
        <h1 className={styles.title}>About <span className={styles.highlight}>M&S Finder</span></h1>
        <p className={styles.mainDescription}>
          At M&S Finder, we believe finding your next favorite movie or series should be 
          <strong> fun and effortless</strong>. Gone are the days of endless scrolling—our app 
          helps you discover exactly what you want, when you want it.
        </p>
      </section>

      {/* Grid sa značajkama */}
      <div className={styles.featureGrid}>
        <div className={styles.featureCard}>
          <FaSmileBeam className={styles.icon} />
          <h3>Personal Guide</h3>
          <p>Think of us as your personal entertainment guide, ready to suggest the perfect film or show for any mood.</p>
        </div>
        <div className={styles.featureCard}>
          <FaMagic className={styles.icon} />
          <h3>Hidden Gems</h3>
          <p>Whether you’re in the mood for a timeless classic, a hidden gem, or the latest blockbuster.</p>
        </div>
        <div className={styles.featureCard}>
          <FaFilm className={styles.icon} />
          <h3>Easy Discovery</h3>
          <p>M&S Finder makes it easy to explore, choose, and enjoy. No more wasting time, just pure cinema magic.</p>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* SEKCIJA: OUR TEAM (Prijateljski ton) */}
      <section className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>Who are we?</h2>
        <p className={styles.teamIntro}>
          We are simply a group of people who <strong>love watching movies and series</strong>. 
          For us, there is nothing better than relaxing with a great story after a long day. 
          Because it helps us unwind, we wanted to help others easily find exactly what they’re in the mood for.
        </p>
        
        
      </section>

      <div className={styles.ctaSection}>
        <h2>Ready to find your next favorite?</h2>
        <Link href="/explore" className={styles.exploreBtn}>Explore</Link>
      </div>
    </main>
  );
}