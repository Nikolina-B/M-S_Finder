"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import styles from "./createCommunity.module.css";
import { FaCheckCircle } from "react-icons/fa";

export default function CreateCommunity(
  {
  session,
  onAuthRequired,
  onClose,
}: {
  session: any;
  onAuthRequired: () => void;
  onClose: () => void;
}) {
  
  
  const [name, setName] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();

    if (!session?.user) {
      onAuthRequired();
      return;
    }

    setIsSubmiting(true);

    try {
       const response = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        const data = await response.json();
        setIsSuccess(true);
        setName("");
        
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          router.push(`/community/${data.slug}`);
        }, 3000);
      } else {
        alert("Greška pri kreiranju huba. Možda ime već postoji?");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.iconContainer} onClick={onClose}>
          <IoClose className={styles.iconX} />
        </button>

        {!isSuccess ? (
          <>
            <h2 className={styles.title}>Create New Community Hub</h2>
            <p className={styles.text}>
              Enter the name of the movie or series to launch a hub.
            </p>

            <form onSubmit={handleSubmit} className={styles.createForm}>
              <input
                type="text"
                placeholder="e.g. Gladiator II"
                className={styles.chatInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmiting}
                required
              />

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmiting}
              >
                {isSubmiting ? "Launching..." : "Launch Community"}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.success}>
            <FaCheckCircle size={52} color="#4bb543" style={{ marginBottom: "1rem" }} />
            <h2 className={styles.title}>Success!</h2>
            <p className={styles.text}>
              Community has been created successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}