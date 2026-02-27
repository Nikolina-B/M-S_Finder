
"use client"; 

import { useState, useEffect } from "react"; 
import styles from "./TrendingMovies.module.css"; 
import { HiOutlineArrowRight } from "react-icons/hi"; 
import  IMBDRating  from "../explore/imbdRating"; 
import FavoritesButton from '../explore/wishlistHandle'; 
import {authClient} from "@/app/lib/auth/auth-client" 
import Link from 'next/link'; 
import { toggleWatchlistAction } from '../actions/watchlist'; 
import { useRouter } from 'next/navigation'; 
import { client } from "@/sanity/lib/client";
 

 

const API_KEY = process.env.NEXT_PUBLIC_MOVIE_DB_API_KEY; 
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`; 


//const TRENDING_IDS = ["tt33046197","tt8740790","tt8036976","tt32642706","tt12637874", "tt31193180", "tt1399664", "tt4574334","tt30144839", "tt27543632", "tt32916440", "tt14186672"]; 

 

const createSlug = (title: string): string => { 

    if (!title) return ''; 

    return title 
        .toLowerCase() 
        .replace(/[^a-z0-9\s-]/g, '') 
        .trim() 
        .replace(/\s+/g, '-'); 

}; 

 

/* ------------------ MAIN COMPONENT ------------------ */ 

 

export default function TrendingMovies() { 

  const { data: session } = authClient.useSession(); 
  const router = useRouter(); 

 

  const [movies, setMovies] = useState<any[]>([]); 
  const [itemsPerPage, setItemsPerPage] = useState(4); 
  const [page, setPage] = useState(0); 
  const [loading, setLoading] = useState(true); 
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]); 
  const [favoritesIds, setFavoritesIds] = useState<string[]>([]); 
  const [showAuthModal,setShowAuthModal] = useState(false);

  const checkAuth = (isInitial: boolean = false) => {
      if (!session) {
        if (!isInitial) {
          setShowAuthModal(true); // Otvara tvoj custom prozor
        }
        return false;
      }
      return true;
    };


 

 

    useEffect(() => {
        const fetchTrending = async () => {
            setLoading(true);
            try {
             
                const query = `*[_type == "movie"] | order(_createdAt desc) {
                    "imdbID": externalId,
                    "Title": title,
                    "Poster": poster.asset->url,
                    "imdbRating": rating,
                    "Year": year,
                    "Genre": genres
                }`;
                
                const data = await client.fetch(query);
                
                
                const formattedData = data.map((m: any) => ({
                    ...m,
                    Genre: m.Genre ? m.Genre.join(', ') : "N/A"
                }));

                setMovies(formattedData);
            } catch (err) {
                console.error("Error fetching from Sanity:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);
 

 /* --- 2. Sinkronizacija Watchlist i Favorites ID-ova --- */ 

    useEffect(() => { 

        const fetchUserLists = async () => { 

            if (session?.user) { 
                try { 
                    const [resW, resF] = await Promise.all([ 

                        fetch('/api/watchlist/ids'), 
                        fetch('/api/favorites/ids') 

                    ]); 

                    if (resW.ok) setWatchlistIds(await resW.json()); 
                    if (resF.ok) setFavoritesIds(await resF.json()); 

                } catch (err) { 

                    console.error("Error fetching user lists:", err); 

                } 

            } 

        }; 

        fetchUserLists(); 

    }, [session]); 

 

    /* --- 3. Responsive logic --- */ 

    useEffect(() => { 

        const handleResize = () => { 

            if (window.innerWidth <= 1024 && window.innerWidth > 650) setItemsPerPage(2); 

            else if (window.innerWidth <= 650) setItemsPerPage(1); 

            else setItemsPerPage(4); 

        }; 

        handleResize(); 

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize); 

    }, []); 

 

    /* --- 4. Watchlist Toggle (Identično kao na Explore) --- */ 

    const handleWatchlistToggle = async (e: React.MouseEvent, movie: any) => { 

        e.preventDefault(); e.stopPropagation(); 

        // if (!session) return alert("Please login!"); 

        const isAlreadyIn = watchlistIds.includes(movie.imdbID); 

        setWatchlistIds(prev => isAlreadyIn ? prev.filter(id => id !== movie.imdbID) : [...prev, movie.imdbID]); 

 

        try { 
            await toggleWatchlistAction({ 
                imdbID: movie.imdbID, 
                Title: movie.Title, 
                imdbRating: movie.imdbRating, 
                Year: movie.Year, 
                Genre: movie.Genre, 
                Poster: movie.Poster, 
            }); 
        } catch (err) { 
            setWatchlistIds(prev => isAlreadyIn ? [...prev, movie.imdbID] : prev.filter(id => id !== movie.imdbID)); 
        } 
    }; 

 

    /* --- Pagination --- */ 

    const startIndex = page * itemsPerPage; 
    const visibleMovies = movies.slice(startIndex, startIndex + itemsPerPage); 

    const handleNext = () => { if (startIndex + itemsPerPage < movies.length) setPage(page + 1); }; 
    const handlePrev = () => { if (page > 0) setPage(page - 1); }; 

    if (loading) return <div className={styles.loader}>Loading trending...</div>; 

    return ( 

        <section className={styles.section}> 
            <h2 className={styles.mainTitle}>Trending</h2> 
            <div className={styles.sliderWrapper}> 
                <button onClick={handlePrev} className={`${styles.scrollBtn} ${styles.left}`} disabled={page === 0}> 
                    &#10094; 
                </button> 
                <div className={styles.slider}> 
                    {visibleMovies.map((movie) => ( 
                        <div key={movie.imdbID} className={styles.card}> 
                            {/* Gornji dio: Poster i Gumbi */} 
                            <div className={styles.imageContainer}> 
                                <Link href={`/explore/${movie.imdbID}-${createSlug(movie.Title)}`}> 
                                    <img 
                                        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'} 
                                        alt={movie.Title} 
                                        className={styles.trailerImage} 
                                    /> 
                                </Link>
                                

                                <div className={styles.WishWatchbuttons}> 
                                    <button 
                                        className={`${styles.addBtn} ${watchlistIds.includes(movie.imdbID) ? styles.added : ""}`} 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (checkAuth()) {
                                                handleWatchlistToggle(e, movie);
                                            }
                                            }}
                                    > 
                                        {watchlistIds.includes(movie.imdbID) ? "✓" : "+"} 
                                    </button> 
                                    <FavoritesButton 
                                        movie={movie} 
                                        initialFavoritesIds={favoritesIds}
                                        session={session} 
                                        onAuthRequired={() => setShowAuthModal(true)} 
                                      />
                                </div>
                                <div className={styles.gradientOverlay}></div> 
                                <div className={styles.ratingPositioner}>
                                    <IMBDRating rating={movie.imdbRating}  />
                                </div>
                                
                            </div> 

 

                            {/* Donji dio: Info */} 
                            <div className={styles.cardFooter}> 
                                <span className={styles.movieTitle}>{movie.Title}</span> 
                                <span className={styles.year}>{movie.Year}</span> 
                                <div className={styles.genreandArrowConatainer}>
                                    <div className={styles.genreContainer}> 
                                        {movie.Genre !== "N/A" ? ( 
                                            movie.Genre.split(',').slice(0, 2).map((g: string) => ( 
                                                <span key={g} className={styles.genreTag}>{g.trim()}</span> 

                                            )) 
                                        ) : <span className={styles.genreTag}>N/A</span>} 
                                    </div> 
                                    {/* Strelica */} 
                                    <div
                                    className={styles.arrowIcon} 
                                    onClick={() => router.push(`/explore/${movie.imdbID}-${createSlug(movie.Title)}`)} 
                                    > 
                                    <HiOutlineArrowRight /> 
                                    </div> 
                                </div>
                        </div> 

                            
                            
                        </div> 
                    ))} 
                </div> 

 

                <button onClick={handleNext} className={`${styles.scrollBtn} ${styles.right}`} disabled={startIndex + itemsPerPage >= movies.length}> 
                    &#10095; 
                </button> 
            </div> 
            {showAuthModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Sign In Required</h2>
            <p>Please sign in to unlock search, filters, and watchlists.</p>
            <div className={styles.modalButtons}>
              <button onClick={() => router.push("/signin")} className={styles.modalSignInBtn}>
                Sign In
              </button>
              <button onClick={() => setShowAuthModal(false)} className={styles.modalCancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        </section> 
        

    ); 

} 