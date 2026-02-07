import { FaStar } from "react-icons/fa";
import styles from "./explore.module.css"; 

interface IMDBRatingProps {
  rating: string;
}

export default function IMDBRating({ rating }: IMDBRatingProps) {
  if (!rating || rating === "N/A") return null;

  return (
    <div className={styles.ratingBadge}>
      <span className={styles.starIcon}>
        <FaStar />
      </span>
      <span className={styles.ratingValue}>{rating}</span>
    </div>
  );
}