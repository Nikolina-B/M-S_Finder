"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth/auth-client";
import styles from "./EditProfile.module.css"; 
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

type UserProfile = {
  name: string;
  email: string;
  password: string;
  currentPassword: string;
  avatar?: string;
};

export default function EditProfilePage() {

  const {data:session, isPending} = authClient.useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    password: "",
    currentPassword:"",
    avatar: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  

  
  useEffect(() => {
   if(session?.user){
    setProfile((prev)=>({
      ...prev,
      name:session.user.name || "",
      email:session.user.email || "",
      avatar:session.user.image || "",
    }));
   }
  }, [session]);

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

 
  const handleSave = async() => {
    
    setLoading(true);
    setMessage("");
    let updateSuccess = true;
    
    try{
      const{error:userError} = await authClient.updateUser({
        name:profile.name,
        image:profile.avatar,
      });
      
      if (userError) {
        updateSuccess = false;
        setMessage("Greška pri ažuriranju profila: " + userError.message);
        setLoading(false);
        return;
      }

     
      if (profile.password && profile.password.trim() !== "") {

        if(!profile.currentPassword){
          setMessage("You need to enter current password to change it!");
          setLoading(false);
          return;
        }
        const { error: passwordError } = await authClient.changePassword({
          newPassword: profile.password,
          currentPassword:profile.currentPassword,
          revokeOtherSessions: true, 
        });

        if (passwordError) {
          updateSuccess = false;
          setMessage("Profile is updated, but password is not. " + passwordError.message);
        }
      }

      if (updateSuccess) {
          window.dispatchEvent(new Event("profileUpdated"));
          setIsSuccess(true);
          // setMessage("Changes have submitted!");
          setProfile(prev => ({ ...prev, password: "", currentPassword: "" }));

         setTimeout(() => {
          router.push("/profile");
        }, 3000);
      }

    } catch (err) {
      setMessage("There was a mistake. Try again!");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) return <div className={styles.container}>Učitavanje...</div>;

  return (
    <main className={styles.container}>
      
      {!isSuccess ? (
        <>
        <h1 className={styles.title}>Edit Profile</h1>

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
            disabled
            className={styles.input}
            style={{ opacity: 0.5 }}
          />
        </div>

        <div className={styles.card}>
          <label className={styles.cardTitle}>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={profile.currentPassword}
            onChange={handleChange}
            className={styles.input}
            placeholder="Unesite trenutnu lozinku"
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
            placeholder="New password"
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

      <button className={styles.saveButton} onClick={handleSave} disabled={loading}>
        Save changes
      </button>
      </>
      ):(
          <div className={styles.success}>
          <FaCheckCircle size={52} color="#4bb543" style={{ marginBottom: "1rem",alignSelf:'center' }} />
          <h2 className={styles.title}>Success!</h2>
          <p className={styles.text}>
            Your profile has been updated successfully.
            Redirecting to profile in 3 seconds...
          </p>
          <Link href="/profile" className={styles.saveButton} style={{ textDecoration: 'none', display: 'inline-block', marginTop: '1rem', textAlign:'center' }}>
            Back to Profile
          </Link>
        </div>
      )}
      {/* {message && <p className={styles.message}>{message}</p>} */}
    </main>
  );
}

