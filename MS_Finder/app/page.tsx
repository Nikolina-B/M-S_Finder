
import Hero from "./components/Hero";
import Testimonials from "./components/Testimonials";
import TrendingMovies from "./components/TrendingMovies";
import AboutUs from "./components/AboutUs";
import Footer from "./components/Footer";
export default function Home() {
  return (
    <main>
      <Hero />
 <TrendingMovies />
 <Testimonials />
 <AboutUs />
 <Footer />
    </main>
  );
}