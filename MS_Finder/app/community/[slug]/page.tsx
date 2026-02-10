import { db } from "@/app/lib/db";
import { communities } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import styles from "./chat.module.css";
import ChatInterface from "./ChatInterface";

export default async function CommunityChatPage({ params }: { params: { slug: string } }) {

  const { slug } = await params;

 
  const results = await db
    .select()
    .from(communities)
    .where(eq(communities.slug, slug))
    .limit(1);

  const community = results[0];

  if (!community) {
    notFound();
  }

  return (
    <div className={styles.chatContainer}>
      <header className={styles.chatHeader}>
        <div className={styles.headerInfo}>
          <h1>{community.name}</h1>
          <span className={styles.memberStatus}>
            {community.memberCount || 0} members
          </span>
        </div>
      </header>

      <ChatInterface communityId={community.id} />
    </div>
  );
}