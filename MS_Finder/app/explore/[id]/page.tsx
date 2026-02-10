"use client"; 
import { useEffect, useState } from 'react'; 
import { useParams } from 'next/navigation'; 
import IMDBRating from '../imbdRating'; 
import styles from './detailPage.module.css' 
import { FaPlay } from "react-icons/fa"; 
import FavoritesButton from '../wishlistHandle'; 
import {authClient} from "@/app/lib/auth/auth-client" 
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; 

 

const API_KEY = process.env.NEXT_PUBLIC_MOVIE_DB_API_KEY;  
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`; 

 

interface MovieDetails { 
    Title: string; 
    Type:string; 
    Year: string; 
    Plot: string; 
    totalSeasons?:string; 
    Poster: string; 
    Genre: string; 
    Director: string; 
    Writer:string; 
    Released:string; 
    Language:string; 
    imdbRating: string; 
    imdbID: string; 
    Actors:string; 
    Awards:string; 
    Runtime:string; 

} 

 

interface Episode { 
  Title: string; 
  Released: string; 
  Episode: string; 
  imdbRating: string; 
  imdbID: string; 
  Runtime:string; 

} 

 

export default function DetailPage() { 

    const params = useParams(); 
    const rawIdSegment = String(params.id);  

    let actualMovieId: string | null = null; 

    const match = rawIdSegment.match(/^(tt\d+)/);  

    if (match && match[0]) { 
        actualMovieId = match[0];  
    } 


    const [details, setDetails] = useState<MovieDetails | null>(null); 
    const [isLoading, setIsLoading] = useState(true); 

    // const [showTrailer, setShowTrailer] = useState(false); 

    const { data: session } = authClient.useSession(); 
    const [initialFavoritesIds, setInitialFavoritesIds] = useState<string[]>([]); 

     
    const [selectedSeason, setSelectedSeason] = useState<string>("1"); 
    const [episodes, setEpisodes] = useState<Episode[]>([]); 
    const [isSeasonOpen, setIsSeasonOpen] = useState(false); 
    const [expandedEpisode, setExpandedEpisode] = useState<string | null>(null); 
    const [loadingEpisodes, setLoadingEpisodes] = useState(false); 
    const [episodePlots, setEpisodePlots] = useState<Record<string, string>>({}); 
    const [episodeRuntime, setEpisodeRuntime] = useState<Record<string, string>>({}); 

    // const [episodeData, setEpisodeData] = useState<Record<string, any>>({}); 

   

  //useffect za dohvat detalja filma/serija 

    useEffect(() => { 

        if (!actualMovieId) { 
            setIsLoading(false); 
            return; 
    } 

         const fetchDetails = async () => { 

            setIsLoading(true); 

            try { 

                const detailUrl = `${API_URL}&i=${encodeURIComponent(actualMovieId!)}&plot=full`; 
                const response = await fetch(detailUrl); 

                if (!response.ok) { 
                    throw new Error(`HTTP error! status: ${response.status}`); 
                } 

                const data = await response.json(); 

                if (data.Response === "True") { 
                    setDetails(data); 

                } else { 

                    console.error("No details:", data.Error); 
                    setDetails(null);  
                }

            } catch (err) { 
                console.error("Error:", err); 
                setDetails(null); 
            } finally { 
                setIsLoading(false); 
            } 
        }; 

        fetchDetails(); 
    }, [actualMovieId]);  

 

// 2. useEffect za dohvaćanje epizoda kada se promijeni sezona 

  useEffect(() => { 

    if (details?.Type === "series" && actualMovieId) { 

      const fetchEpisodes = async () => { 

        setLoadingEpisodes(true); 

        try { 
          const res = await fetch(`${API_URL}&i=${actualMovieId}&Season=${selectedSeason}`); 
          const data = await res.json(); 
          if (data.Response === "True") { 
            setEpisodes(data.Episodes || []); 
          } 
        } catch (err) { 
          console.error("Error fetching episodes:", err); 
        }  
      }; 
      fetchEpisodes(); 
    } 

  }, [selectedSeason, details?.Type, actualMovieId]); 

 

 

  /* dohavća favorites*/ 

  useEffect(() => { 
  const fetchFavoritesIds = async () => { 
    if (!session?.user) return; 
    try { 

      const res = await fetch('/api/favorites/ids'); 

      if (!res.ok) { 
        console.error(`Greška na serveru: ${res.status}`); 
        return; 
      } 

      const contentType = res.headers.get("content-type"); 
      if (!contentType || !contentType.includes("application/json")) { 
        const text = await res.text(); 
        console.error("Server nije vratio JSON nego:", text.substring(0, 100)); 
        return; 

      } 
      const data = await res.json(); 
      setInitialFavoritesIds(data); 
    } catch (err) { 
      console.error("Favorites fetch error:", err); 
    } 
  }; 

  fetchFavoritesIds(); 
}, [session]); 

 
  /* Togglers */ 

    const toggleSeasonDropdown = () => setIsSeasonOpen(!isSeasonOpen); 

    const toggleEpisodePlot = async (epImdbID: string) => { 
        if (expandedEpisode === epImdbID) { 
            setExpandedEpisode(null); 
            return; 
        } 
        setExpandedEpisode(epImdbID); 

        if (!episodePlots[epImdbID]) { 
            try { 
                const res = await fetch(`${API_URL}&i=${epImdbID}`); 
                const data = await res.json(); 
                if (data.Response === "True") { 
                    setEpisodePlots(prev => ({ ...prev, [epImdbID]: data.Plot })); 
                    setEpisodeRuntime(prev => ({...prev, [epImdbID]: data.Runtime})); 
                } 

            } catch (err) { 
                console.error("Error fetching ep plot and runtime:", err); 
            } 
        } 
    }; 


    // const handleSeasonSelect = (num: string) => { 
    // setSelectedSeason(num); 
    // setIsSeasonOpen(false); 

    // };

    if (isLoading) { 

        return( 
            <div className ={styles.pageContainer}> 
                <div className={styles.loadingContainer}> 
                    <p>Loading movie details...</p> 
                </div> 
            </div> 
        ); 
    } 

 

    if (!details) {

        return ( 
            <div className ={styles.pageContainer}> 
                <div className={styles.notFoundContainer}> 
                    <p>Details for ID "{rawIdSegment}" not found. Check format (tt1234567.)</p> 
                </div> 
            </div> 
        ); 
    } 

    const movieDataForFavorite = { 
            imdbID: details.imdbID, 
            Title: details.Title, 
            imdbRating: details.imdbRating, 
            Year: details.Year, 
            Genre: details.Genre, 
            Poster: details.Poster 
        }; 

    return ( 
        <div className={styles.pageContainer}> 
            <div className={styles.cardsContainer}> 
                <div className={styles.detailCard}> 
                        {/*Poster*/} 
                       <div className={styles.posterWrapper}> 
                            <img 
                                src={ 
                                    details.Poster !== "N/A" 
                                        ? details.Poster 
                                        : "https://via.placeholder.com/300x450?text=No+Poster" 
                                } 
                                alt={details.Title}
                                className={styles.poster} 
                            /> 
                            <div className={styles.ratingUnderPoster}> 
                                <IMDBRating rating={details.imdbRating} /> 
                            </div> 
                        </div> 
                    {/*Info*/}
                    <div className={styles.infoContainer}> 
                        <div className={styles.titleContainer}> 
                            <h2>{details.Title}</h2> 
                            <div className={styles.wishButtonOverlay}> 
                                <FavoritesButton  
                                    movie={movieDataForFavorite} 
                                    initialFavoritesIds={initialFavoritesIds} 
                                    session={session} 
                                    /> 
                            </div> 
                        </div> 

                         

                        <div className={styles.metaInfo}> 
                           <div> 
                                    <span className={styles.label}>Released:</span> 
                                    <span className={styles.value}>{details.Released}</span> 
                            </div> 
                            <div> 
                                    <span className={styles.label}>Runtime:</span> 
                                    <span className={styles.value}>{details.Runtime}</span> 
                            </div> 
                            <div className={styles.typeContainer}> 
                            <span className={styles.Tag}>{details.Type}</span> 
                            </div>  
                        </div> 

                          

                            

                        <div className={styles.genreContainer}> 
                            {details.Genre && details.Genre !== "N/A" ? ( 
                                details.Genre.split(',').map((g) => ( 
                                <span key={g} className={styles.Tag}> 
                                    {g.trim()} 
                                </span> 
                                )) 

                            ) : ( 
                                <span className={styles.Tag}>N/A</span> 
                            )} 

                        </div> 
                        <div className={styles.actionRow}> 
                        <button  
                        className={styles.playButton}  
                       onClick={() => { 
                            const query = encodeURIComponent(`${details.Title} ${details.Year} official trailer`); 
                            window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank'); 

                        }} 
                        > 
                        <FaPlay /> Watch Trailer 
                        </button> 
                    </div> 

                        {/*Plot*/} 
                        <div className= {styles.sectionTitle}>Story</div> 
                        <p className={styles.plot}>{details.Plot}</p> 

                        {/* EPIZODE SEKCIJA (Samo za serije) */} 
                {details.Type === "series" && details.totalSeasons && ( 
                    <div className={styles.episodesWrapper}> 
                        <div className={styles.seasonSelector}> 
                            <button className={styles.seasonButton} onClick={() => setIsSeasonOpen(!isSeasonOpen)}> 
                                Season {selectedSeason} <FaChevronDown className={isSeasonOpen ? styles.rotate : ""} /> 
                            </button> 
                            {isSeasonOpen && ( 
                                <ul className={styles.seasonDropdown}> 
                                    {Array.from({ length: parseInt(details.totalSeasons) }, (_, i) => ( 
                                        <li key={i + 1} onClick={() => { setSelectedSeason((i + 1).toString()); setIsSeasonOpen(false); }}> 
                                            Season {i + 1} 
                                        </li> 
                                    ))} 
                                </ul> 
                            )} 
                        </div> 
                        <div className={styles.episodeList}> 
                            {episodes.map((ep) => ( 
                                <div key={ep.imdbID} className={styles.accordionItem}> 
                                    <button className={styles.accordionHeader} onClick={() => toggleEpisodePlot(ep.imdbID)}> 
                                        <div className={styles.epTitleGroup}> 
                                            <span className={styles.epNumber}>{ep.Episode}</span> 
                                            <span className={styles.epTitle}>{ep.Title}</span> 
                                           <div className={styles.runtimeContainer}> 
                                                {episodeRuntime[ep.imdbID] && ( 
                                                    <span className={styles.epRuntimeBadge}> 
                                                        {episodeRuntime[ep.imdbID]} 
                                                    </span> 
                                                )}
                                            </div> 
                                        </div> 
                                    <FaChevronDown className={`${styles.chevron} ${expandedEpisode === ep.imdbID ? styles.rotate : ""}`} /> 
                                    </button> 
                                    <div className={`${styles.accordionContent} ${expandedEpisode === ep.imdbID ? styles.show : ""}`}> 
                                        <div className={styles.innerContent}> 
                                            <p className={styles.plotText}> 
                                                {episodePlots[ep.imdbID]} 
                                            </p> 
                                        </div> 
                                    </div> 
                                </div> 
                            ))} 
                        </div> 
                    </div> 
                )} 

                        

 

                        {/*Credits*/} 

                        <div className ={styles.sectionTitle}>Credits</div> 
                            <div className={styles.gridInfo}> 
                                <div> 
                                    <span className={styles.label}>Director:</span> 
                                    <span className={styles.value}>{details.Director}</span> 
                                </div> 
                                <div> 

                                    <span className={styles.label}>Writer:</span> 
                                    <span className={styles.value}>{details.Writer}</span>   
                                </div> 
                                <div>
                                    <span className={styles.label}>Actors:</span> 
                                    <span className={styles.value}>{details.Actors}</span> 
                                </div> 

                                <div> 
                                    <span className={styles.label}>Language:</span> 
                                    <span className={styles.value}>{details.Language}</span> 
                                </div> 
                                <div> 
                                    <span className={styles.label}>Awards:</span> 
                                    <span className={styles.value}>{details.Awards}</span> 
                                </div> 
                            </div> 
                    </div> 
                </div>
            </div> 
        </div> 
    ); 

} 
//popravi imbd rating badge ikonicu pobjegne 