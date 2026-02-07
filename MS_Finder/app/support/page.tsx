
"use client";

import { useState } from "react";
import styles from "./support.module.css"; 
import { FiChevronDown,  FiChevronUp, FiLock } from "react-icons/fi";
import { TfiVideoClapper } from "react-icons/tfi";
import { FaRocket, FaQuestionCircle  } from "react-icons/fa";
import Image from 'next/image';
import Footer from "../components/Footer";
import { authClient } from "@/app/lib/auth/auth-client";

export default function SupportPage() {
  const [status, setStatus] = useState("");
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { data: session } = authClient.useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending message...");

    if(!session || !session.user) {
      setStatus("You must be logged in to send a message.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const data ={
      name: formData.get("name"),
      email:formData.get("email") ,
      message:formData.get("message"),
    }
    
    try{
      const res = await fetch("/api/contact", {
        method: "POST",
        body:JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();
      if(res.ok){
        setStatus("Message sent successfully!");
        (e.target as HTMLFormElement).reset(); //cisti formu
        setTimeout(()=>setShowForm(false), 2000);//zatvara formu nakon 2s
      } else {
        setStatus(result.error || "Something went wrong.");
      }
    }catch (error) {
      console.error("Error sending message:", error);
      setStatus("Failed to send message. Please try again later.");
    }
    
  };
  
  const FAQ_DATA = [
  {
    category: "Account & Security",
    icon: <FiLock className={styles.categoryIcon} />,
    items: [
      { q: "Is my data secure?", a: "Yes, we use industry-standard encryption and Better-Auth to ensure your profile and wishlist stay private and secure." },
      { q: "Can I use MS Finder without an account?", a: "No, you have to create an account to access all features, but we promise it's quick and easy!" },
      { q: "How do I change my profile picture?", a: "Currently, we use the avatar provided by your login provider (like Google or GitHub), but custom uploads are coming soon!" }
    ]
  },
  {
    category: "Movies & Search",
    icon: <TfiVideoClapper className={styles.categoryIcon} />,
    items: [
      { q: "Why are some movies missing posters?", a: "We fetch data from a global database. If a movie is very new or very old, a poster might not be available yet." },
      { q: "Can I watch movies directly on MS Finder?", a: "No, MS Finder is a discovery and tracking tool. We help you find what to watch and where it’s rated, but we do not host any video content." },
      { q: "Does the search support multiple languages?", a: "Search works best with English titles. For local movies, try searching for its international English title." }
    ]
  },
  {
    category: "Quick Start Guide",
    icon: <FaRocket className={styles.categoryIcon} />,
    items:[
      { q: "How do I create a wishlist?", a: "Simply click the heart icon on any movie to add it to your wishlist. You can view and manage your wishlist from your profile." },
      { q:"How to Search with Filters?" ,a:"Use the search bar at the top of the page. After typing your query, you can apply filters like genre, release year, and type to narrow down your results." },
      {q:"How to Use the Watchlist Feature?", a:"Click the plus icon on any movie to add it to your watchlist. You can view and manage your watchlist from your profile." }
    
    ]
  }
];
  

const toggleCategory = (category:string)=>{
  setActiveCategory(activeCategory === category ? null : category);

}
const toggleFaq = (question:string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveFaq(activeFaq === question ? null :question);
}
const toggleForm =()=>{
    setShowForm(!showForm);
  }

  return (
    <main className={styles.mainContainer}>
      <div className={styles.headerContainer}>
        <Image 
        src="/support.jpg" 
        alt="Background" 
        fill 
        className={styles.backgroundImage}
        priority 
      />
      <div className={styles.gradientOverlay}></div>
        
        <div className={styles.headerTextWrapper}>
          <h2 className={styles.title}>Welcome to M&S Finder support page</h2>
          <h4>We are here to help you!</h4>
        </div>

      </div>
      <h4 className={styles.faqTitle}>Need help? Check out our FAQ's below!</h4>
      <section className={styles.faQuestions}>
        <h4 className={styles.sectionTitle}>FAQ's</h4>
        
        {FAQ_DATA.map((group) => (
          <div key={group.category} className={styles.categoryWrapper}>

            {/* Header Kategorije */}
           
            <div 
              className={`${styles.categoryHeader} ${activeCategory === group.category ? styles.activeCategory : ""}`}
              onClick={() => toggleCategory(group.category)}
            >
               <span className={styles.categoryIconMain}>{group.icon}</span>
              <h3 className={styles.categoryTitle}>{group.category}</h3>
              
              <span >
                {activeCategory === group.category ? <FiChevronUp className={styles.faqicon}/> : <FiChevronDown className={styles.faqicon} />}
              </span>
            </div>

            {/* Lista pitanja - prikazuje se samo ako je kategorija aktivna */}
            {activeCategory === group.category && (
              <ul className={styles.faqList}>
                {group.items.map((item) => (
                  <li 
                    key={item.q} 
                    className={`${styles.faqListItem} ${activeFaq === item.q ? styles.activeItem : ""}`}
                    onClick={(e) => toggleFaq(item.q, e)}
                  >
                    <div className={styles.questionHeader}>
                      <span className={styles.questionText}>{item.q}</span>
                      <span className={styles.qIcon}>
                        {activeFaq === item.q ? <FiChevronUp className={styles.faqicon} /> : <FiChevronDown className={styles.faqicon} />}
                      </span>
                    </div>
                    
                    {activeFaq === item.q && (
                      <div className={styles.answerWrapper}>
                        <p className={styles.faqAnswer}>{item.a}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
     
      <div className={styles.contactSection}>
        <h4 className={styles.contactTitle}>Still have questions? Contact us directly!</h4>
        <button className={styles.contactUsBtn} onClick={toggleForm}>
            {showForm ? "Close Form" : "Contact Us"}
        </button>
        
        {showForm && (<section className={styles.sectionCard}>
          <h2 className={styles.title} style={{ fontSize: "1.6rem" }}>Contact Us</h2>
          <form onSubmit={handleSubmit} className={styles.formList}>
            
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Your Name</label>
              <input name="name" type="text" className={styles.inputField} required placeholder="Enter your name" />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email Address</label>
              <input name="email"type="email" className={styles.inputField} required placeholder="Enter your email" />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Message</label>
              <textarea 
                name="message"
                className={styles.inputField} 
                rows={4} 
                required 
                placeholder="How can we help you?"
                style={{ resize: "none", fontFamily: "inherit" }}
              ></textarea>
            </div>

              <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={!session || status === "Sending..."}
            >
              {session ? "Send Message" : "Login to Send"}
            </button>
          </form>

          {status && (
            <p className={status.includes("successfully") 
              ? styles.statusSuccess 
              : styles.statusError}
            >
              {status}
            </p>
          )}
        </section>
      )}
      </div>

    <Footer/>
    </main>
    
  );
}