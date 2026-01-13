import React from 'react';
import styles from './AboutUs.module.css';
import Link from 'next/link';

const AboutUs = () => {
  return (
    <section className={styles.aboutContainer}>
      <div className={styles.content}>
        <h2 className={styles.title}>About Us</h2>
        <p className={styles.description}>
          M&S Finder is an application created to stop endless scrolling 
          and make finding the perfect movie or series an immediate 
          and precise experience. M&S Finder gives you complete 
          control over your entertainment, becoming your reliable 
          cinematic friend.
        </p>
        {/* <button className={styles.learnMoreBtn}>Learn more</button> */}
        <Link href="/support" className={styles.learnMoreBtn}>
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