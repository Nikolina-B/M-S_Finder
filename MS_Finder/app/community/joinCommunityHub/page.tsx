"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import styles from "./joinCommunityHub.module.css";
import { useRouter } from "next/navigation";


interface Community {
  id: string;
  name: string;
  slug: string;
  memberCount: number;
}

export default function JoinButton({
  session,
  onAuthRequired,
  onClose,
}: {
  session: any;
  onAuthRequired: () => void;
  onClose: () => void;
})  {

  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (!session?.user) return;

    const fetchCommunities = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/community");
        if (res.ok) {
          const data = await res.json();
          setCommunities(data);
        }
      } catch (error) {
        console.error("Fetch communities error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, [session]);

 
const handleJoin = async (communityId: string, slug: string) => {
    setJoiningId(communityId);
    try {
      const res = await fetch("/api/community/join", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ communityId }),
      });

      if (res.ok) {
        
        window.dispatchEvent(new Event("communityJoined"));
        onClose();
        router.push(`/community/${slug}`);
      } else {
        alert("Already a member or error occurred.");
      }
    } catch (error) {
      console.error("Join error:", error);
    } finally {
      setJoiningId(null);
    }
  };
  return (
     <div className={styles.overlay}>
      <div className={`${styles.popupCard} ${styles.widePopup}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.iconContainer} onClick={onClose}>
          <IoClose size={24} color="white" />
        </button>

        <h2 className={styles.title}>Available Communities</h2>

        <div className={styles.communityListScroll}>
          {isLoading ? (
            <p className={styles.text}>Loading communities...</p>
          ) : communities.length > 0 ? (
            communities.map((hub) => (
              <div key={hub.id} className={styles.hubRow}>
                <div className={styles.hubInfo}>
                  <span className={styles.hubName}>{hub.name}</span>
                  <span className={styles.hubMembers}>
                    {hub.memberCount || 0} members
                  </span>
                </div>

                <button
                  className={styles.joinBtnSmall}
                  onClick={() => handleJoin(hub.id, hub.slug)}
                  disabled={joiningId === hub.id}
                >
                  {joiningId === hub.id ? "Joining..." : "Join Hub"}
                </button>
              </div>
            ))
          ) : (
            <p className={styles.text}>No communities found.</p>
          )}
        </div>
      </div>
    </div>
  );
}