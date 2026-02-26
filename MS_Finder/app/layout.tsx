
import "./globals.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

export const metadata = {
  title: "M&S Finder",
  description: "Globalni fiksirani navbar",
  icons: {
    icon: [
      {
        url: "/favicon.ico", 
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon2.ico.png", 
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
