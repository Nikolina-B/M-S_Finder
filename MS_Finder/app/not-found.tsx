import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#0C0D32', // Your color from globals.css
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      zIndex: 100000,
      color: 'white', // White text as requested
      padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      {/* Background 404 Number */}
      <h1 style={{
        position: 'absolute',
        fontSize: '25vw',
        fontWeight: '900',
        opacity: 0.05,
        margin: 0,
        zIndex: -1,
        WebkitTextStroke: '2px white',
        color: 'transparent',
        userSelect: 'none'
      }}>404</h1>

      {/* IMAGE - Centered with 25px border radius */}
      <div style={{ marginBottom: '20px' }}>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/7465/7465679.png" 
          alt="Sad Popcorn" 
          style={{ 
            width: '160px', 
            height: 'auto',
            borderRadius: '25px', // 25px border radius as requested
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }} 
        />
      </div>

      <h2 style={{ fontSize: '3rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>
        Oops! Wrong route.
      </h2>
      
      {/* Decorative Line with 25px radius */}
      <div style={{ 
        width: '80px', 
        height: '6px', 
        backgroundColor: 'white', 
        borderRadius: '25px', 
        marginBottom: '30px' 
      }}></div>
      
      <p style={{ 
        fontSize: '1.2rem', 
        maxWidth: '500px', 
        lineHeight: '1.6', 
        marginBottom: '40px',
        color: 'white'
      }}>
        Don't worry, nothing terrible happened. <br />
        Just go back to the homepage and continue your search.
      </p>

      {/* Button with 25px border radius */}
      <Link href="/" style={{
        backgroundColor: 'white',
        color: '#0C0D32',
        padding: '16px 45px',
        borderRadius: '25px', // 25px border radius as requested
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
        transition: '0.3s'
      }}>
        Back to Home
      </Link>

      <div style={{ 
        position: 'absolute', 
        bottom: '30px', 
        opacity: 0.4, 
        fontSize: '0.8rem', 
        letterSpacing: '2px' 
      }}>
        M&S FINDER • 2026
      </div>
    </div>
  )
}