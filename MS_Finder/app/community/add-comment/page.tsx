
"use client";
import { useState } from "react";
import { useReviews } from "../ReviewsContext";
import styles from "./add-comment.module.css";

export default function AddCommentPage() {
  const { addReview } = useReviews();
  const [author, setAuthor] = useState("");
  const [movie, setMovie] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview({ id: Date.now(), author, movie, comment, rating });
    setSubmitted(true);
    setAuthor(""); setMovie(""); setComment(""); setRating(5);
  };

  return (
    <main className={styles.mainContainer}>
      <section className={styles.sectionCard}>
        <h1 className={styles.title}>Add Your Comment</h1>
        <p className={styles.text}>Fill out the form below to share your cinematic experience.</p>

        <form onSubmit={handleSubmit} className={styles.sectionCard}>
          <input className={styles.inputField} placeholder="Your Name" value={author} onChange={e => setAuthor(e.target.value)} required />
          <input className={styles.inputField} placeholder="Movie Title" value={movie} onChange={e => setMovie(e.target.value)} required />
          <textarea className={styles.inputField} placeholder="Your Comment" value={comment} onChange={e => setComment(e.target.value)} required />
          <input type="number" className={styles.inputField} min={1} max={5} value={rating} onChange={e => setRating(Number(e.target.value))} />
          <button type="submit" className={styles.submitBtn}>Submit Comment</button>
        </form>

        {submitted && <p className={styles.statusSuccess}>Your comment has been submitted!</p>}
      </section>
    </main>
  );
}


