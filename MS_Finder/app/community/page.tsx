"use client";

import Link from "next/link";
import styles from "./community.module.css";
import { useEffect, useState } from "react";
import { authClient } from "../lib/auth/auth-client";
import { IoClose } from "react-icons/io5";
import JoinButton from "./joinCommunityHub/page";
import CreateCommunity from "./createCommunity/page";
import Footer from "../components/Footer";

export default function CommunityPage() {

  const { data: session, isPending } = authClient.useSession(); 
  const [showPopup, setShowPopup] = useState(false);
  const [activeModal, setActiveModal] = useState<"join" | "create" | null>(null);

  if(isPending){
    return <p className={styles.text}>Loading...</p>
  }
  

  const handleProtectedAction = (e:React.MouseEvent)=>{
    if(!session?.user){
      e.preventDefault();
      setShowPopup(true);
    }
  };

  
  const requireAuth = () => {
    setShowPopup(true);
    setActiveModal(null);
  };
 

 
  return (
    <main className={styles.mainContainer}>

    {showPopup && (
      <div className={styles.overlay} onClick={() => setShowPopup(false)}>
        <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
          <div className={styles.iconContainer}>
            <IoClose className={styles.iconX} onClick={() => setShowPopup(false)} />
          </div>
          <h2 className={styles.title}>Sign in required!</h2>
          <p className={styles.text}>You need to sign in or register to join the community.</p>
          
          <div className={styles.popupActions}>
            <Link href="/register" className={styles.actionBtn}>
              Register
            </Link>
             <Link href="/signin" className={styles.actionBtn}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )}


    
      {/* JOIN MODAL */}
      {activeModal === "join" && (
        <JoinButton
          session={session}
          onAuthRequired={requireAuth}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* CREATE MODAL */}
      {activeModal === "create" && (
        <CreateCommunity
          session={session}
          onAuthRequired={requireAuth}
          onClose={() => setActiveModal(null)}
        />
      )}
      <section className={styles.sectionCard}>
        
        <h1 className={styles.title}>Join the Community</h1>
        <p className={styles.text}>
          Share your cinematic experiences with others. M&S Finder is more than just a tool,
          it's a place for movie lovers to connect.
        </p>

        {/* <Link href="/community/add-comment" className={styles.submitBtn} >
          Join
        </Link> */}
        {/* <JoinButton session={session} onAuthRequired={() => setShowPopup(true)} /> */}
         <button 
          className={styles.submitBtn}
          onClick={() => setActiveModal("join")}
        >
          Join Community
        </button>
      </section>

    
      <section className={styles.sectionCard}>
        <h2 className={`${styles.title} ${styles.sectionSubtitle}`}>Create new community</h2>
        <p className={styles.text}>
         Create new community hub and chat with other users about movies and series! Check what other users recommend.
        </p>
        {/* <Link href="/community/reviews" className={styles.submitBtn} >
          Create 
        </Link> */}
        {/* <CreateCommunity session={session} onAuthRequired={() => setShowPopup(true)} /> */}
          
        <button 
          className={styles.submitBtn}
          onClick={() => setActiveModal("create")}
        >
          Create Community
        </button>
      </section>

      {/* <section className={styles.sectionCard} style={{ textAlign: 'center' }}>
        <div className={styles.statsContainer}>
          <div>
            <h3 className={styles.statsNumber}>1.2k</h3>
            <p className={styles.text}>Reviews</p>
          </div>
          <div>
            <h3 className={styles.statsNumber}>500+</h3>
            <p className={styles.text}>Members</p>
          </div>
        </div>
      </section> */}

   
    </main>
   
  );
}


//u profile dodaj my communities i na community pageu dodaj da se vidu 