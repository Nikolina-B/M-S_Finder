import React from 'react';
import styles from './Footer.module.css';
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa'; // Instaliraj react-icons ako nemaš

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.topSection}>
        <div className={styles.logoInfo}>
          <div className={styles.logoCircle}>
             {/* Ovdje možeš staviti svoj logo image */}
             <img src="/logo-small.png" alt="M&S Finder" />
          </div>
          <p className={styles.tagline}>
            Discover your next favorite show instantly. Your personalized movie and series companion.
          </p>
        </div>

        <div className={styles.linksColumn}>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/community">Community</a></li>
          </ul>
        </div>

        <div className={styles.linksColumn}>
          <h3>Account</h3>
          <ul>
            <li><a href="/signin">Sign In</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <p>Copyright © 2025 M&S Finder. All rights reserved.</p>
        <div className={styles.socialIcons}>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaYoutube /></a>
          <a href="#"><FaLinkedin /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;