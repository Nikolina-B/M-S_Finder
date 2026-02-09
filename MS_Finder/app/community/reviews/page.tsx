

// "use client";

// import styles from "./reviews.module.css";
// import { reviews as staticReviews } from "../../data/data";
// import { useReviews } from "../ReviewsContext";

// export default function ReviewsPage() {
//   const { userReviews } = useReviews();

//   const allReviews = [...staticReviews, ...userReviews];

//   return (
//     <main className={styles.mainContainer}>
//       <h1 className={styles.title}>All Reviews</h1>

//       {allReviews.map((r) => (
//         <div key={r.id} className={styles.reviewCard}>
//           <div className={styles.reviewMovie}>{r.movie}</div>
//           <div className={styles.reviewAuthor}>
//             by {r.author} - {r.rating}⭐
//           </div>
//           <div className={styles.reviewComment}>{r.comment}</div>
//         </div>
//       ))}
//     </main>
//   );
// }
// "use client";
// import styles from "./reviews.module.css";
// import { reviews as staticReviews } from "../../data/data";
// import { useReviews } from "../ReviewsContext";

// export default function ReviewsPage() {
//   const { userReviews } = useReviews();
//   const allReviews = [...staticReviews, ...userReviews];

//   return (
//     <main className={styles.mainContainer}>
//       <h1 className={styles.title}>All Reviews</h1>
//       {allReviews.map(r => (
//         <div key={r.id} className={styles.reviewCard}>
//           <div className={styles.reviewMovie}>{r.movie}</div>
//           <div className={styles.reviewAuthor}>
//             by {r.author} - {r.rating}⭐
//           </div>
//           <div className={styles.reviewComment}>{r.comment}</div>
//         </div>
//       ))}
//     </main>
//   );
// }
"use client";
import styles from "./reviews.module.css";
import { reviews as staticReviews } from "../../data/data";
import { useReviews } from "../ReviewsContext";

export default function ReviewsPage() {
  const { userReviews, deleteReview } = useReviews(); // dodali deleteReview iz context-a
  const allReviews = [...staticReviews, ...userReviews];

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.title}>All Reviews</h1>

      {allReviews.map(r => (
        <div key={r.id} className={styles.reviewCard}>
          <div className={styles.reviewMovie}>{r.movie}</div>
          <div className={styles.reviewAuthor}>
            by {r.author} - {r.rating}⭐
          </div>
          <div className={styles.reviewComment}>{r.comment}</div>

          {/* Dugme za brisanje samo za user review */}
          {userReviews.find(ur => ur.id === r.id) && (
            <button
              onClick={() => deleteReview(r.id)}
              className={styles.deleteBtn} // stilizuj po želji
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </main>
  );
}
