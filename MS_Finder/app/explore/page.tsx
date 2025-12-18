
"use client";

import { useState, useEffect } from 'react'; 
import QuickSearch from "../components/QuickSearch"; 
import Link from 'next/link'; 

const API_URL = 'https://www.omdbapi.com/?apikey=925fda56';
const DEFAULT_SEARCH_TERM = "Popular"; 

interface MovieResult {
  Title: string;
  Year: string;
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
  
  const [results, setResults] = useState<MovieResult[] | null>(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentQuery, setCurrentQuery] = useState(''); 
  const [isInitialLoad, setIsInitialLoad] = useState(true); 


  
  useEffect(() => {
    if (isInitialLoad) {
      setIsLoading(true);
      fetchMovies(DEFAULT_SEARCH_TERM, 1, false); 
    }
  }, [isInitialLoad]); 



  const fetchMovies = async (query: string, page: number, append: boolean = false) => {
    
    if (page === 1 && !append) {
        setResults(null);
        setError(null);
        setTotalPages(0);
        setCurrentQuery(query);
    }
    
    if (!isInitialLoad) {
       setIsLoading(true);
    }

    try {
        const searchUrl = `${API_URL}&s=${encodeURIComponent(query)}&page=${page}`;
        
        const response = await fetch(searchUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.Response === "True") {
            
            const rawNewResults = data.Search;
                
          
            const validNewResults = rawNewResults.filter(
                (item: MovieResult) => item.imdbID && item.imdbID.startsWith('tt') && item.Title
            );
            
            const combinedResults = append ? [...(results || []), ...validNewResults] : validNewResults;
            
           
            const uniqueResultsMap = new Map();
            combinedResults.forEach((item: MovieResult) => {
                uniqueResultsMap.set(item.imdbID, item);
            });
            
            const uniqueResultsArray = Array.from(uniqueResultsMap.values());
            
            setResults(uniqueResultsArray as MovieResult[]);
            setCurrentPage(page);
            
            if (page === 1) {
              const totalResultsCount = parseInt(data.totalResults);
              setTotalPages(Math.ceil(totalResultsCount / 10));
            }

        } else {
            if (page === 1) {
                setError(data.Error || `No results for "${query}".`);
                setResults([]); 
            }
        }

    } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data.");
    } finally {
        setIsLoading(false);
        if (isInitialLoad) setIsInitialLoad(false); 
    }
  };


  const handleInternalSearch = (query: string) => {
    if (isInitialLoad) setIsInitialLoad(false); 
    fetchMovies(query, 1, false); 
  };
  
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages && currentQuery) {
        fetchMovies(currentQuery, nextPage, true); 
    }
  };


  // --- STILIZACIJA ---
  const pageContainerStyle = { paddingTop: '60px', padding: '20px' };
  const searchContainerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', marginBottom: '40px' };
  
  const resultsGridStyle: React.CSSProperties = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
    gap: '20px', 
    maxWidth: '1200px', 
    margin: '30px auto', 
    alignItems: 'stretch',
  };
  
  const itemStyle: React.CSSProperties = { 
    display: 'flex', 
    flexDirection: 'column',
    minHeight: '480px', 

    textAlign: 'center', 
    borderRadius: '8px', 
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
    overflow: 'hidden', 
    backgroundColor: '#fff', 
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
  };
  
  const imageStyle: React.CSSProperties = { width: '100%', height: '350px', objectFit: 'cover', flexShrink: 0 };
  
  const textContainerStyle: React.CSSProperties = { 
    padding: '10px', 
    flexGrow: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center' 
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#5e81ac',
    color: 'white',
    padding: '10px 30px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1em',
    marginTop: '30px',
    marginBottom: '30px',
    transition: 'background-color 0.3s',
  };
  

 
  return (
    <div style={pageContainerStyle}>
      
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Explore Movies and Series</h1>
      
      <div style={searchContainerStyle}>
         <QuickSearch onSearch={handleInternalSearch}/> 
      </div>
      
      <div style={{ textAlign: 'center', minHeight: '300px' }}>
          
          {isLoading && <p style={{ fontSize: '1.2em', color: '#5e81ac' }}>Učitavanje rezultata...</p>}
          {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Greška: {error}</p>}

          {!results && !isLoading && !error && !isInitialLoad && (
            <>
              <p style={{marginTop: '20px', color: '#4c566a'}}>Unesite naziv filma ili serije za početak pretraživanja.</p>
              <p style={{marginTop: '10px', color: '#4c566a'}}>Ovdje će se prikazivati rezultati pretraživanja nakon API poziva.</p>
            </>
          )}

          {/* PRIKAZ REZULTATA S DINAMIČKIM LINKOVIMA */}
          {results && results.length > 0 && (
              <div style={resultsGridStyle}>
                  {results.map((item) => {
                        const movieSlug = createSlug(item.Title);
                       
                        const dynamicHref = `/explore/${item.imdbID}-${movieSlug}`; 

                        return (
                            <Link 
                                key={item.imdbID} 
                                href={dynamicHref} 
                                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                            > 
                                <div style={itemStyle}>
                                    <img 
                                        src={item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/250x350?text=Poster+Unavailable'} 
                                        alt={item.Title} 
                                        style={imageStyle}
                                    />
                                    <div style={textContainerStyle}>
                                        <h3 style={{ fontSize: '1.1em', margin: '5px 0' }}>{item.Title}</h3>
                                        <p style={{ fontSize: '0.9em', color: '#4c566a' }}>{item.Year} ({item.Type})</p>
                                    </div>
                                </div>
                            </Link> 
                        );
                    })}
              </div>
          )}
          
          {/* GUMB ZA UČITAVANJE SLJEDEĆE STRANICE */}
          {results && currentPage < totalPages && !isLoading && (
              <button 
                  onClick={handleLoadMore} 
                  style={buttonStyle}
              >
                  Učitaj više ({currentPage} / {totalPages})
              </button>
          )}

          {/* PORUKA NEMA REZULTATA */}
          {results && results.length === 0 && !isLoading && !error && (
              <p style={{ color: '#bf616a', fontWeight: 'bold' }}>No results found for your query.</p>
          )}

      </div>
    </div>
  );
}