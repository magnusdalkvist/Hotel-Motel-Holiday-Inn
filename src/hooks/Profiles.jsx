import { createContext, useContext, useEffect, useState } from "react";
import { useRealtime, useSubscription } from "react-supabase";
import { useAuth } from "./Auth";

const initialState = { profiles: null, error: null, fetching: null };
const ProfilesContext = createContext(initialState);

export function ProfilesProvider({ children }) {
  const { session, user } = useAuth();
  const [state, setState] = useState(initialState);
  const [{ data: profiles, error, fetching }, reexecute] = useRealtime("profiles");
  useEffect(() => {
    if (
      state.profiles != null &&
      state?.profiles?.find((profile) => profile.id == user?.id)?.challenges.length <
        profiles?.find((profile) => profile.id == user?.id)?.challenges.length
    ) {
      alert("You have a new challenge!");
    }
    setState({
      profiles: profiles?.sort((a, b) =>
        a.first_name?.toLowerCase() < b.first_name?.toLowerCase() ? -1 : 1
      ),
      error,
      fetching,
    });
  }, [profiles]);

  return <ProfilesContext.Provider value={state}>{children}</ProfilesContext.Provider>;
}

export function useProfiles() {
  const context = useContext(ProfilesContext);
  if (context === undefined) throw Error("useAuth must be used within AuthProvider");
  return context;
}
