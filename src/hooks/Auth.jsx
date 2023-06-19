import { createContext, useContext, useEffect, useState } from "react";
import { useAuthStateChange, useClient } from "react-supabase";

const initialState = { session: null, user: null };
const AuthContext = createContext(initialState);

export function AuthProvider({ children }) {
  const client = useClient();
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const session = client.auth.session();
    setState({ session, user: session?.user ?? null });
  }, []);

  useAuthStateChange((event, session) => {
    // console.log(`Supabase auth event: ${event}`, session);
    setState({ session, user: session?.user ?? null });
  });

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw Error("useAuth must be used within AuthProvider");
  return context;
}
