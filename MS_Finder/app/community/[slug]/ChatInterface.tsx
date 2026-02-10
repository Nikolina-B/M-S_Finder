"use client";

import { useState } from "react";
import { IoSend } from "react-icons/io5";
import styles from "./chat.module.css";

export default function ChatInterface({ communityId }: { communityId: string }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to the hub!", user: "System", time: "12:00" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    
    const newMessage = {
      id: Date.now(),
      text: input,
      user: "You",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className={styles.interfaceWrapper}>
      <div className={styles.messagesList}>
        {messages.map((msg) => (
          <div key={msg.id} className={styles.messageRow}>
            <span className={styles.userName}>{msg.user}</span>
            <p className={styles.messageText}>{msg.text}</p>
            <span className={styles.time}>{msg.time}</span>
          </div>
        ))}
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