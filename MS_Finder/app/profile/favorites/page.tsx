"use client";

import { useEffect, useState } from "react";
import styles from "./Favorites.module.css";

type FavoriteItem = {
  id: string;
  title: string;
  type: "movie" | "tv";
  image: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>My Favorites</h1>

      {favorites.length === 0 ? (
        <p className={styles.empty}>
          You don't have any favorites yet.
        </p>
      ) : (
        <div className={styles.list}>
          {favorites.map((item) => (
            <div key={item.id} className={styles.card}>
              <img
                src={item.image}
                alt={item.title}
                className={styles.poster}
              />
              <div className={styles.cardTitle}>{item.title}</div>
              <button
                className={styles.removeButton}
                onClick={() => removeFavorite(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
