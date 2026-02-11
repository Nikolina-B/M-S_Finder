
"use client";

import { useState, useEffect, useMemo } from 'react';
import {authClient} from "@/app/lib/auth/auth-client"
import { HiOutlineArrowRight } from "react-icons/hi";
import QuickSearch from "../components/QuickSearch";
import Link from 'next/link';
import styles from "./explore.module.css"
import { FaStar } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { toggleWatchlistAction } from '../actions/watchlist';
import DropdownGenre   from './dropdowns/dropdownGenre';
import DropdownType from './dropdowns/dropdownType';
import DropdownYear from './dropdowns/dropdownYear';
import  IMDBRating  from './imbdRating';
import FavoritesButton from './wishlistHandle';

const API_KEY = process.env.NEXT_PUBLIC_MOVIE_DB_API_KEY; 
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;
const YEAR = ["2026","2025","2024","2023","2022","2021","2020","2019","2018","2017","2016","2015","2014","2013","2012","2011","2010",
"2009","2008","2007","2006","2005","2004","2003","2002","2001","2000",
"1999","1998","1997","1996","1995","1994","1993","1992","1991","1990"];

const DEFAULT_SEARCH_TERM = "2025";
const TYPE = ["All","Movie","Series"];
const GENRES = ["All","Action","Adventure","Animation","Fantasy", "Comedy", "Drama", "Horor", "Romance", "Sci-Fi", "Thriller"]

interface MovieResult {
  Title: string;
  Year: string;
  Released: string;
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
    const router = useRouter();

    const [results, setResults] = useState<MovieResult[]> ([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
   
    const [showMobileSearch, setShowMobileSearch]=useState(false);

   

    //za implementaciju watchliste i wishliste 
    const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
    const [favoritesIds, setFavoritesIds] = useState<string[]>([]);

    //filter
    const [filter, setFilter] = useState<'All' | 'Movie' | 'Series'>('All');
    const [genreFilter, setGenreFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentQuery, setCurrentQuery] = useState(DEFAULT_SEARCH_TERM);
  

// dohvacanje id-a kod ucitavanja za watchlistu
  useEffect(() => {
    const fetchWatchlistIds = async () => {
      if (session?.user) {
        try {
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

  useEffect(() => {
    const fetchFavoritesIds = async () => {
      if (session?.user) {
        try {
          const res = await fetch('/api/favorites/ids');
          if (res.ok) setFavoritesIds(await res.json());
        } catch (err) { console.error("Favorites fetch error:", err); }
      }
    };
    fetchFavoritesIds();
  }, [session]);

   //  Glavna funkcija za API poziv prema OMDB bazi
  const fetchMovies = async (query: string, page: number, append: boolean = false) => {
      setIsLoading(true);
      setError(null);
    try {
      const typeParam = filter !== 'All' ? `&type=${filter}` : '';
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
  },[filter,currentQuery]);


const filteredResults = useMemo(() => {
        if (genreFilter === "All") return results;
        return results.filter((movie) => {
            if (!movie.Genre || movie.Genre === "N/A") return false;
            return movie.Genre.toLowerCase().includes(genreFilter.toLowerCase());
        });
    }, [results, genreFilter]);

/* ------------------ ADD TO WATCHLIST ------------------ */

  const handleWatchlistToggle = async (e: React.MouseEvent, movie: MovieResult) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      alert("Please login to manage your watchlist!");
      return;
    }

    const isAlreadyIn = watchlistIds.includes(movie.imdbID);

    if (isAlreadyIn) {
      setWatchlistIds(prev => {
      const updated = prev.filter(id => id !== movie.imdbID);
      return updated;
    });
  } else {
    setWatchlistIds(prev => {
      const updated = [...prev, movie.imdbID];
      return updated;
    });
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
    }
      catch (err) {
      console.error("Action failed:", err);
    // Vrati stanje ako akcija ne uspije
    if (isAlreadyIn) {
      setWatchlistIds(prev => [...prev, movie.imdbID]);
    } else {
      setWatchlistIds(prev => prev.filter(id => id !== movie.imdbID));
    }
  }
  };




 return (
   <main className={styles.exploreContainer}>
      <h1 className={styles.mainTitle}>Explore Movies & Series</h1>

    <div className={styles.controlsSection}>
        {/* Filteri */}
          <div className={styles.filterBars}>
            <DropdownType
              TYPE={TYPE}
              typeFilter={filter}
              setTypeFilter={(value)=> setFilter(value as 'All' | 'Movie' | 'Series')}
              />
          {/* Žanrovi */}
            <DropdownGenre
                GENRES={GENRES}
                genreFilter={genreFilter}
                setGenreFilter={setGenreFilter}
            />
            <DropdownYear
            YEAR={YEAR}
            yearFilter={isNaN(Number(currentQuery)) ? "" : currentQuery}
            setYearFilter={(value) => {
              setCurrentQuery(value);
              fetchMovies(value, 1, false);
            }}
            />
          </div>
        {/* Pretraga */}
        <div className={styles.searchWrapper}>
          <QuickSearch onSearch={(q) => fetchMovies(q, 1, false)} />
        </div>
        
            
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Grid s filmovima */}
      <div className={styles.movieGrid}>
        {filteredResults.map((movie) => (
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
            <div className={styles.WishWatchbuttons}>
              <button
                  className={`${styles.addBtn} ${watchlistIds.includes(movie.imdbID) ? styles.added : ""}`}
                  onClick={(e) => handleWatchlistToggle(e, movie)}
                  aria-label="Toggle Watchlist"
                >
                  {watchlistIds.includes(movie.imdbID) ? "✓" : "+"}
                </button>
                <FavoritesButton 
                  movie={movie} 
                  initialFavoritesIds={favoritesIds}
                  session={session} 
                />
              </div>
            <div className={styles.gradientOverlay}></div>
            <IMDBRating  rating = {movie.imdbRating}/>
            </div>
            
            {/* Footer s informacijama */}
            <div className={styles.cardFooter}>
              <span className={styles.movieTitle}>{movie.Title}</span>
              <span className={styles.year}>{movie.Year}</span>
              <div className={styles.genreContainer}>
                {movie.Genre && movie.Genre !== "N/A" ? (
                  movie.Genre.split(',').map((g) => (
                    <span key={g} className={styles.genreTag}>{g.trim()}</span>
                  ))
                ) : (
                  <span className={styles.genreTag}>N/A</span>
                )}
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
  

