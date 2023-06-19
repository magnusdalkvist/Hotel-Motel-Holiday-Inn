import { Link } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import { useProfiles } from "../hooks/Profiles";

export default function Nav() {
  const { session, user } = useAuth();
  const { profiles } = useProfiles();
  const points = profiles?.find((data) => data.id == user?.id)?.points;

  return (
    <nav className="flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/perks">Perks</Link>
      <Link to="/auction">Auction</Link>
      {!user ? (
        <Link to="/login">Log in</Link>
      ) : (
        <Link to="/account">Account ({points} points)</Link>
      )}
    </nav>
  );
}
