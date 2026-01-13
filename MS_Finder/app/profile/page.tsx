

// export default function ProfilePage() {
//   return (
//     <main>
      
//       <h1>My Profile</h1>
//       <ul>
//         <li>Watchlist</li>
//         <li>Favorites</li>
//         <li>Edit Profile</li>
//         <li>Logout</li>
//       </ul>
//     </main>
//   );
// }
import Link from "next/link";

export default function ProfilePage() {
  return (
    <main>
      <h1>My Profile</h1>

      <ul>
        <li>
          <Link href="/profile/watchlist"> Watchlist</Link>
        </li>
        <li>
          <Link href="/profile/favorites"> Favorites</Link>
        </li>
        <li>
          <Link href="/profile/edit">Edit Profile</Link>
        </li>
      </ul>
    </main>
  );
}
