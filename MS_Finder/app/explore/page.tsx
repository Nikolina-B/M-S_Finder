
"use client";

import { useState, useEffect } from 'react';
import {authClient} from "@/app/lib/auth/auth-client"
import { HiOutlineArrowRight } from "react-icons/hi";
import QuickSearch from "../components/QuickSearch";
import Link from 'next/link';
import styles from "./explore.module.css"
import { FaStar } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { toggleWatchlistAction } from '../actions/watchlist';

const API_KEY = process.env.NEXT_PUBLIC_MOVIE_DB_API_KEY; 
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;
const DEFAULT_SEARCH_TERM = "2025";

interface MovieResult {
  Title: string;
  Year: string;
  imdbRating: string;
  Genre: string;
  imdbID: string;
  Type: string;
  Poster: string;
}


const createSlug = (title: string): string => {
    if (!title) return '';
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
};


export default function ExplorePage() {

    const { data: session } = authClient.useSession();
    const [results, setResults] = useState<MovieResult[]> ([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentQuery, setCurrentQuery] = useState(DEFAULT_SEARCH_TERM);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    //za implementacij uwatchliste
    const [watchlistIds, setWatchlistIds] = useState<string[]>([]);

    //filter
    const [filter, setFilter] = useState<'all' | 'movie' | 'series'>('all');

    // useEffect(() => {
    //     if (isInitialLoad) {
    //       setIsLoading(true);
    //       fetchMovies(DEFAULT_SEARCH_TERM, 1, false);
    //     }
    //   }, [isInitialLoad]);

// 1. Dohvaćanje inicijalnih ID-ova iz tvoje baze kod učitavanja
  useEffect(() => {
    const fetchWatchlistIds = async () => {
      if (session?.user) {
        try {
          // Napomena: Trebat ćeš napraviti ovaj API route koji vraća samo niz ID-ova
          const res = await fetch('/api/watchlist/ids');
          if (res.ok) {
            const ids = await res.json();
            setWatchlistIds(ids);
          }
        } catch (err) {
          console.error("Error fetching watchlist IDs:", err);
        }
      }
    };
    fetchWatchlistIds();
  }, [session]);

   //  Glavna funkcija za API poziv prema OMDB
  const fetchMovies = async (query: string, page: number, append: boolean = false) => {
      setIsLoading(true);
      setError(null);
    try {
      const typeParam = filter !== 'all' ? `&type=${filter}` : '';
      const isYear = /^\d{4}$/.test(query);
    const searchUrl = isYear
      ? `${API_URL}&s=movie&y=${query}&page=${page}${typeParam}`
      : `${API_URL}&s=${encodeURIComponent(query)}&page=${page}${typeParam}`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.Response === "True") {
        
        const detailedResults = await Promise.all(
          data.Search.map(async (movie: any) => {
            // Pozivamo API za svaki ID pojedinačno da izvučemo Genre
            const detailRes = await fetch(`${API_URL}&i=${movie.imdbID}`);
            const detailData = await detailRes.json();
            return detailData; 
          })
        );

        setResults(prev => {
          const currentItems = append ? prev : [];
          const allItems = [...currentItems, ...detailedResults];

          const uniqueMap = new Map();
          allItems.forEach(item => uniqueMap.set(item.imdbID, item));
          
          return Array.from(uniqueMap.values()) as MovieResult[];
        });
        
        if (page === 1) {
          setTotalPages(Math.ceil(parseInt(data.totalResults) / 10));
        }
        setCurrentPage(page);
        setCurrentQuery(query);
      } else {
        if (page === 1) {
          setResults([]);
          setError(data.Error || "No results found.");
        }
      }
    } catch (err) {
      setError("Failed to fetch movies.");
    } finally {
      setIsLoading(false);
    }
};

  useEffect(()=>{
    fetchMovies(currentQuery,1,false);
  },[filter]);

/* ------------------ ADD TO WATCHLIST ------------------ */

  const handleWatchlistToggle = async (e: React.MouseEvent, movie: MovieResult) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      alert("Please login to manage your watchlist!");
      return;
    }

    const isAlreadyIn = watchlistIds.includes(movie.imdbID);

    // OPTIMISTIC UI - Odmah promijeni stanje na gumbu
    if (isAlreadyIn) {
      setWatchlistIds(prev => prev.filter(id => id !== movie.imdbID));
    } else {
      setWatchlistIds(prev => [...prev, movie.imdbID]);
    }

    try {
      await toggleWatchlistAction({
        imdbID: movie.imdbID,
        Title: movie.Title,
        imdbRating:movie.imdbRating,
        Year: movie.Year,
        Genre: movie.Genre,
        Poster: movie.Poster,
      });
    } catch (err) {
      console.error("Action failed:", err);
      // Ako akcija ne uspije, vrati stanje na staro
      if (isAlreadyIn) {
        setWatchlistIds(prev => [...prev, movie.imdbID]);
      } else {
        setWatchlistIds(prev => prev.filter(id => id !== movie.imdbID));
      }
    }
  };

/* ------------------ RATING ------------------ */

function IMDBRating(
  {rating}:{rating:string}
) {
  if (!rating || rating === "N/A") return null;

  return (
    <div className={styles.ratingBadge}>
      <span className={styles.starIcon}><FaStar/></span>
      <span className={styles.ratingValue}>{rating}</span>
    </div>
  );
}



 return (
   <main className={styles.exploreContainer}>
      <h1 className={styles.mainTitle}>Explore Movies & Series</h1>

      {/* Filteri */}
      <div className={styles.filterBar}>
        {['all', 'movie', 'series'].map((f) => (
          <button 
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ""}`}
            onClick={() => setFilter(f as any)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Pretraga */}
      <div className={styles.searchWrapper}>
        <QuickSearch onSearch={(q) => fetchMovies(q, 1, false)} />
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Grid s filmovima */}
      <div className={styles.movieGrid}>
        {results.map((movie) => (
          <div key={movie.imdbID} className={styles.card}>
            {/* Poster/Trailer link */}
            <div className={styles.imageContainer}>
            <Link href={`/explore/${movie.imdbID}-${createSlug(movie.Title)}`}>
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
                alt={movie.Title}
                className={styles.trailerImage}
              />
            </Link>
            <button
                className={`${styles.addBtn} ${watchlistIds.includes(movie.imdbID) ? styles.added : ""}`}
                onClick={(e) => handleWatchlistToggle(e, movie)}
                aria-label="Toggle Watchlist"
              >
                {watchlistIds.includes(movie.imdbID) ? "✓" : "+"}
              </button>
            <div className={styles.gradientOverlay}></div>
            <IMDBRating  rating = {movie.imdbRating}/>
            </div>
            
            {/* Footer s informacijama */}
            <div className={styles.cardFooter}>
              <span className={styles.movieTitle}>{movie.Title}</span>
              <span className={styles.year}>{movie.Year}</span>
              <div className={styles.genreContainer}>
                {movie.Genre.split(',').map((g) => (
                <span key={g} className={styles.genreTag}>{g.trim()}</span>
                ))}
              </div>
              
            </div>


            {/* Strelica za detalje */}
           <div 
            className={styles.arrowIcon} 
            onClick={() => router.push(`/explore/${movie.imdbID}-${createSlug(movie.Title)}`)}
            style={{ cursor: 'pointer' }} // Osigurava da korisnik vidi da je klikabilno
             >
            <HiOutlineArrowRight />
          </div>
          </div>
        ))}
      </div>

      {/* Load More sekcija */}
      {isLoading && <p className={styles.loader}>Loading more content...</p>}
      
      {!isLoading && currentPage < totalPages && (
        <div className={styles.paginationWrapper}>
          <button 
            className={styles.loadMoreBtn} 
            onClick={() => fetchMovies(currentQuery, currentPage + 1, true)}
          >
            Show More Results
          </button>
        </div>
      )}
    </main>
      
 );
}
  