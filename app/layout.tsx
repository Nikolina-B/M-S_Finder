
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
       
        <Hero />
      
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}

