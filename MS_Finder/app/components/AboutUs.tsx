import React from 'react';
import styles from './AboutUs.module.css';
import Link from 'next/link';

const AboutUs = () => {
  return (
    <section className={styles.aboutContainer}>
      <div className={styles.content}>
        <h2 className={styles.title}>About Us</h2>
        <p className={styles.description}>
         "M&S Finder is designed to simplify your entertainment experience. We’ve replaced the frustration of choice overload with a curated journey tailored to your unique taste. From hidden gems to the latest global hits, we provide the tools to explore, decide, and dive into great stories effortlessly. Your time is valuable—let us help you spend it watching, not searching."
        </p>
        {/* <button className={styles.learnMoreBtn}>Learn more</button> */}
        {/* <Link href="/support" className={styles.learnMoreBtn}>
          Learn more
        </Link> */}
        <Link href="/abouts" className={styles.learnMoreBtn}>
  Learn more
</Link>
      </div>
      
      <div className={styles.imageWrapper}>
        <img 
          src="2cure.png" 
          alt="Our Team" 
          className={styles.aboutImage} 
        />
      </div>
    </section>
  );
};

export default AboutUs;