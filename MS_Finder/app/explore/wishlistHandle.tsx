"use client";

import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import styles from "./explore.module.css";
import { toggleFavoritesAction } from '../actions/favorites';

interface MovieResult {
  imdbID: string;
  Title: string;
  imdbRating: string;
  Year: string;
  Genre: string;
  Poster: string;
}

interface FavoritesButtonProps {
  movie: MovieResult;
  initialFavoritesIds: string[];
  session: any; 
  onAuthRequired: () => void;
}

export default function FavoritesButton({ movie, initialFavoritesIds, session, onAuthRequired }: FavoritesButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavoritesIds.includes(movie.imdbID));
  

  useEffect(() => {
    setIsFavorited(initialFavoritesIds.includes(movie.imdbID));
  }, [initialFavoritesIds, movie.imdbID]);

  

  const handleFavoritesToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Better-Auth provjera: session.data.user
    if (!session?.user) {
      onAuthRequired();
      //alert("Please login to add to favorites!");
      return;
    }

    const prevState = isFavorited;
    setIsFavorited(!prevState);

    try {
      await toggleFavoritesAction({
        imdbID: movie.imdbID,
        Title: movie.Title,
        imdbRating: movie.imdbRating || "N/A",
        Year: movie.Year,
        Genre: movie.Genre,
        Poster: movie.Poster,
      });
    } catch (err) {
      console.error("database error:", err);
      setIsFavorited(prevState); // Vrati srce na staro ako baza odbije
    }
  };

  return (
    <button
      className={`${styles.addBtn} ${isFavorited ? styles.favorited : ""}`}
      onClick={handleFavoritesToggle}
    >
      {isFavorited ? (
        <FaHeart className={styles.heartIconActive} />
      ) : (
        <FaRegHeart className={styles.heartIcon} />
      )}
    </button>
  );
}
