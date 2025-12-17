

import "./globals.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
export const metadata = {
  title: "M&S Finder",
  description: "Globalni fiksirani navbar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
 
  return (
<html lang="en">
  <body>
    
    <Navbar />
    
    {/* HERO JE MORAO BITI UKLONJEN ODAVDE DA BI EXPLORE STRANICA RADILA ISPRAVNO */}
    {/* Ako se Hero i dalje nalazi ovdje, onda ga uklonite: */}
    {/* <Hero /> */}
  
    <main className="main-content">
      {children}
    </main>
  </body>
</html>
  ); 
}

