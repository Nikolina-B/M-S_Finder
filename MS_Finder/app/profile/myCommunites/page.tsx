"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./myCommunities.module.css";
import { FaTrash } from "react-icons/fa";


interface Community {
  id: string;
  name: string;
  slug: string;
  memberCount: number;
}

export default function MyCommunities() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const loadCommunities = async () => {
    try {
      const res = await fetch("/api/myCommunities");
      if (res.ok) {
        const data = await res.json();
        setCommunities(data);
      }
    } catch (error) {
      console.error("Greška pri učitavanju  communityja:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunities();

    const handleRefresh = () => loadCommunities();
    window.addEventListener("communityJoined", handleRefresh);

    return () => {
      window.removeEventListener("communityJoined", handleRefresh);
    };
  }, []);

  const handleLeave = async (communityId: string) => {
  try {
    const res = await fetch("/api/community/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ communityId }),
    });

    if (res.ok) {
      loadCommunities(); 
      setShowConfirm(null);
    }
  } catch (error) {
    console.error("Leave error:", error);
  }
};

  if (loading) return <p className={styles.text}>Loading...</p>;

  return (
    <div className={styles.Container}>
      <section className={styles.card}>
        <h2 className={styles.title}>My Communities</h2>

        {communities.length === 0 ? (
          <p className={styles.text}>
            You haven’t joined any communities yet.
          </p>
          
        ) : (
          <div className={styles.list}>
            {communities.map((hub) => (
              <div key={hub.id} className={styles.communityItem}>
                <div className={styles.hubDetails}>
                  <p className={styles.name}>{hub.name}</p>
                  <p className={styles.members}>{hub.memberCount} members</p>
                </div>

                <div className={styles.actions}>
                  <Link href={`/community/${hub.slug}`} className={styles.openBtn}>
                    Open
                  </Link>
                  <button className={styles.deleteBtn} onClick={() => setShowConfirm(hub.id)}>
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
              
            ))}
            {showConfirm && (
                <div className={styles.overlay}>
                  <div className={styles.confirmBox}>
                    <p>Are you sure you want to exit and delete this community hub?</p>
                    <div className={styles.confirmBtns}>
                      <button className={styles.yesBtn} onClick={() => handleLeave(showConfirm)}>Yes</button>
                      <button className={styles.noBtn} onClick={() => setShowConfirm(null)}>No</button>
                    </div>
                  </div>
                </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
