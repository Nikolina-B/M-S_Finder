"use client";

import { useEffect, useState } from "react";

import styles from "./EditProfile.module.css"; 

type UserProfile = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
};

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });

  const [message, setMessage] = useState("");

  // Učitavanje profila iz localStorage
  useEffect(() => {
    // const stored = localStorage.getItem("userProfile");
    // if (stored) {
    //   try {
    //     setProfile(JSON.parse(stored));
    //   } catch (error) {
    //     console.error("Greška pri čitanju profila:", error);
    //   }
    // }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setProfile((prev) => ({ ...prev, avatar: "" }));
  };

  // const handleSave = () => {
  //   localStorage.setItem("userProfile", JSON.stringify(profile));
  //   setMessage("Profil je uspješno spremljen!");
    
  //   setTimeout(() => setMessage(""), 3000);
  // };
  const handleSave = () => {
    // 1. Spremanje trenutnih podataka
    localStorage.setItem("userProfile", JSON.stringify(profile));
    
    // 2. Slanje signala Navbaru da osvježi sliku
    window.dispatchEvent(new Event("profileUpdated"));

    // 3. PRAŽNJENJE POLJA (Labela/Inputa)
    setProfile({
      name: "",
      email: "",
      password: "",
      avatar: "",
    });

    // 4. Poruka uspjeha
    setMessage("Profil je uspješno spremljen i polja su očišćena!");
    
    setTimeout(() => setMessage(""), 3000);
  };
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Edit Profil</h1>

      <div className={styles.list}>
        <div className={styles.card}>
          <label className={styles.cardTitle}>Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.card}>
          <label className={styles.cardTitle}>Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.card}>
          <label className={styles.cardTitle}>Password</label>
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.card}>
          <label className={styles.cardTitle}>Profile Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarChange} 
            className={styles.input}
          />
          
          {profile.avatar && (
            <div style={{ marginTop: "15px", textAlign: "center" }}>
              <img 
                src={profile.avatar} 
                alt="avatar" 
                style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
              />
              <br />
              <button className={styles.removeButton} onClick={removeAvatar}>
                Delete image
              </button>
            </div>
          )}
        </div>
      </div>

      <button className={styles.saveButton} onClick={handleSave}>
        Spremi promjene
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </main>
  );
}