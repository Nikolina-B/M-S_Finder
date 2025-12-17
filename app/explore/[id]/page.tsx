

"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API_URL = 'https://www.omdbapi.com/?apikey=925fda56';

interface MovieDetails {
    Title: string;
    Year: string;
    Plot: string;
    Poster: string;
    Genre: string;
    Director: string;
    
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
    
    
    
    const containerStyle: React.CSSProperties = { paddingTop: '80px', padding: '20px', maxWidth: '800px', margin: 'auto' };
    const detailCardStyle: React.CSSProperties = { display: 'flex', gap: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' };
    const posterStyle: React.CSSProperties = { width: '250px', height: 'auto', objectFit: 'cover', borderRadius: '4px' };
    const infoStyle: React.CSSProperties = { flexGrow: 1, textAlign: 'left' };
    


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

    

    if (isLoading) {
        return <div style={containerStyle}>Loading movie/series details...</div>;
    }

    if (!details) {
        
        return <div style={containerStyle}>Details for ID "{rawIdSegment}" not found.Please check the format (e.g., tt0120338 is expected).</div>;
    }


    return (
        <div style={containerStyle}>
            <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Title: {details.Title}</h1>
            
            <div style={detailCardStyle}>
                <img 
                    src={details.Poster !== 'N/A' ? details.Poster : 'https://via.placeholder.com/250x350?text=Poster+Unavailable'} 
                    alt={details.Title} 
                    style={posterStyle}
                />
                <div style={infoStyle}>
                    <h2>{details.Title} ({details.Year})</h2>
                    <p><strong>Genre:</strong> {details.Genre}</p>
                    <p><strong>Director:</strong> {details.Director}</p>
                    <hr style={{ margin: '15px 0' }}/>
                    <p>{details.Plot}</p>
                </div>
            </div>
            
        </div>
    );
}