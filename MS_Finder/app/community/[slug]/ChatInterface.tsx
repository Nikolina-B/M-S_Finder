"use client";

import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import styles from "./chat.module.css";

export default function ChatInterface({ communityId }: { communityId: string }) {
  // const [messages, setMessages] = useState([
  //   { id: 1, text: "Welcome to the hub!", user: "System", time: "12:00" }
  // ]);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);


  //fetching messages
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/community/messages?communityId=${communityId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju poruka:", error);
    }
  };

  //polling, tj dohvacamo nove poruke svako 3 sekunde
  useEffect(()=>{
    fetchMessages();
    const interval = setInterval(fetchMessages,3000);
    return ()=>{
      clearInterval(interval);
    }
  },[communityId]);

  
  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages]);


  //slanje poruka
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setInput("");

    try{
      const res = await fetch("/api/community/messages",{
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({content:currentInput,communityId}),
      });

      if(!res.ok){
        throw new Error("Sending failed!");
      }
      fetchMessages();
    } catch (error){
      console.error(error);
      setInput(currentInput);
    }
   
  };

  return (
    <div className={styles.interfaceWrapper}>
      <div className={styles.messagesList}>
        {messages.map((msg) => (
          <div key={msg.id} className={styles.messageRow}>
            <div className={styles.msgHeader}>
              <span className={styles.userName}>{msg.userName}</span>
              <span className={styles.time}>
                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
              </span>
            </div>
            <p className={styles.messageText}>{msg.content}</p>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} className={styles.inputArea}>
        <input 
          type="text" 
          placeholder="Write a message..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <IoSend size={20} />
        </button>
      </form>
    </div>
  );
}