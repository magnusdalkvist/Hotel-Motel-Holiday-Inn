import { createContext, useContext, useEffect, useState } from "react";
import { useSelect, useSubscription } from "react-supabase";

const initialState = { profiles: null, error: null, fetching: null };
const ProfilesContext = createContext(initialState);

export function ProfilesProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [{ data: profiles, error, fetching }, reexecute] = useSelect("profiles");
  useEffect(() => {
    setState({
      profiles: profiles?.sort((a, b) =>
        a.first_name?.toLowerCase() < b.first_name?.toLowerCase() ? -1 : 1
      ),
      error,
      fetching,
    });
  }, [profiles]);

  useSubscription(
    (payload) => {
      // console.log("Change received!", payload);
      reexecute();
    },
    {
      event: "UPDATE",
      table: "profiles",
    }
  );

  return <ProfilesContext.Provider value={state}>{children}</ProfilesContext.Provider>;
}

export function useProfiles() {
  const context = useContext(ProfilesContext);
  if (context === undefined) throw Error("useAuth must be used within AuthProvider");
  return context;
}
