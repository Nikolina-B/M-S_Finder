

// import "./globals.css";
// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// export const metadata = {
//   title: "M&S Finder",
//   description: "Globalni fiksirani navbar",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
 
//   return (
// <html lang="en">
//   <body>
    
//     <Navbar />
    
  
  
//     <main className="main-content">
//       {children}
//     </main>
//   </body>
// </html>
//   ); 
// }
import "./globals.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

export const metadata = {
  title: "M&S Finder",
  description: "Globalni fiksirani navbar",
  // DODAJ OVAJ DIO ISPOD:
  icons: {
    icon: "/favicon2.ico",
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