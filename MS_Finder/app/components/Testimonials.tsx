
"use client";
import React, { useRef } from 'react';
import styles from './Testimonials.module.css';

const testimonialsData = [
  {
    id: 1,
    name: "Marija Bilić",
    image: "djevojka1.png", 
    text: "No more endless arguments over what to watch. This platform always suggests the best movie or series for the occasion!"
  },
  {
    id: 2,
    name: "Marija Ivić",
    image: "djevojka2.png",
    text: "Really helped me finding best movie for date night!"
  },
  {
    id: 3,
    name: "Marko Petrović",
    image: "covjek1.png",
    text: "I always spend hours scrolling, but this site actually helped me find a hidden gem for a rainy Sunday afternoon. Lifesaver!"
  },
  {
    id: 4,
    name: "Ivan Radić",
    image: "covjek2.png",
    text: "Was looking for a classic movie to watch with my grandma, and this guide gave me the perfect suggestion. Great resource!"
  },
  {
    id: 5,
    name: "Ana Lukić",
    image: "djevojka3.png",
    text: "I love how user-friendly the interface is. The recommendations are spot on every single time I use it!"
  },
  {
    id: 6,
    name: "Luka Biuk",
    image: "covjek3.png",
    text: "Finally an app that doesn't waste my time with endless trailers. I get exactly what I want in just a few clicks."
  }
];

const Testimonials = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.clientWidth; 

      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className={styles.testimonialsSection}>
      <h2 className={styles.sectionTitle}>Testimonials</h2>
      <div className={styles.testimonialsContainer}>
        
        <button 
          className={`${styles.sliderArrow} ${styles.left}`} 
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          &lt;
        </button>
        
        <div className={styles.testimonialsGrid} ref={scrollRef}>
          {testimonialsData.map((t) => (
            <div key={t.id} className={styles.testimonialCard}>
              <div className={styles.imageContainer}>
                <img src={t.image} alt={t.name} className={styles.testimonialImg} />
              </div>
              <h3 className={styles.testimonialName}>{t.name}</h3>
              <p className={styles.testimonialText}>"{t.text}"</p>
            </div>
          ))}
        </div>

        <button 
          className={`${styles.sliderArrow} ${styles.right}`} 
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          &gt;
        </button>
      </div>
    </section>
  );
};

export default Testimonials;