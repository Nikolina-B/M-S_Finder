import { ReactNode } from "react";
import { ReviewsProvider } from "./ReviewsContext";

export default function CommunityLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ReviewsProvider>{children}</ReviewsProvider>;
}
