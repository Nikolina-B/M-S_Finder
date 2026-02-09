
// "use client";
// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { Review } from "../data/types";

// type ReviewsContextType = {
//   userReviews: Review[];
//   addReview: (review: Review) => void;
// };

// const ReviewsContext = createContext<ReviewsContextType | null>(null);

// export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
//   const [userReviews, setUserReviews] = useState<Review[]>([]);

//   const user = { id: "123" }; // kasnije poveži sa auth

//   // Učitaj komentare korisnika sa API-ja
//   useEffect(() => {
//     fetch("/api/reviews?userId=" + user.id)
//       .then(res => res.json())
//       .then(data => setUserReviews(data))
//       .catch(err => console.error(err));
//   }, [user.id]);

//   const addReview = async (review: Review) => {
//     const res = await fetch("/api/reviews", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ...review, userId: user.id }),
//     });
//     const saved = await res.json();
//     setUserReviews(prev => [...prev, saved]);
//   };

//   return (
//     <ReviewsContext.Provider value={{ userReviews, addReview }}>
//       {children}
//     </ReviewsContext.Provider>
//   );
// };

// export const useReviews = () => {
//   const ctx = useContext(ReviewsContext);
//   if (!ctx) throw new Error("useReviews must be used inside ReviewsProvider");
//   return ctx;
// };
"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Review } from "../data/types";

type ReviewsContextType = {
  userReviews: Review[];
  addReview: (review: Review) => void;
  deleteReview: (id: number) => void; // nova funkcija
};

const ReviewsContext = createContext<ReviewsContextType | null>(null);

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  const user = { id: "123" }; // kasnije poveži sa auth

  // Učitaj komentare korisnika sa API-ja
  useEffect(() => {
    fetch("/api/reviews?userId=" + user.id)
      .then(res => res.json())
      .then(data => setUserReviews(data))
      .catch(err => console.error(err));
  }, [user.id]);

  // Dodavanje novog komentara
  const addReview = async (review: Review) => {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...review, userId: user.id }),
    });
    const saved = await res.json();
    setUserReviews(prev => [...prev, saved]);
  };

  // 🔹 Brisanje korisničkog komentara
  const deleteReview = async (id: number) => {
    const res = await fetch(`/api/reviews?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      setUserReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <ReviewsContext.Provider value={{ userReviews, addReview, deleteReview }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used inside ReviewsProvider");
  return ctx;
};

