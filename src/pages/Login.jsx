import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "react-supabase";
import { useAuth } from "../hooks/Auth";

export default function Login() {
  const { session, user } = useAuth();
  const [{ error, fetching }, signIn] = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function onSubmitSignIn(e) {
    e.preventDefault();
    const { error, session, user } = await signIn({
      email,
      password,
    });
    if (!error) navigate("/account");
  }

  if (session) {
    navigate("/account");
  }

  return (
    <div>
      <form onSubmit={onSubmitSignIn} className="flex flex-col items-start gap-4">
        <label htmlFor="email" className="flex flex-col">
          Email
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="password" className="flex flex-col">
          Password
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="flex gap-2">
          <input type="submit" value="Log in" />
        </div>
        {error && <p>{error.message}</p>}
      </form>
    </div>
  );
}
