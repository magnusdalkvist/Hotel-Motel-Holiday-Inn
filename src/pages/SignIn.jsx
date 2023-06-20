import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-supabase";
import { useAuth } from "../hooks/Auth";
import Loader from "../components/Loader";

export default function SignIn() {
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
    <div className="sign-in py-16">
      <form
        onSubmit={onSubmitSignIn}
        className="flex flex-col items-start gap-16 w-full items-center"
      >
        <div className="min-w-[100px] w-1/3 md:w-1/5">
          <svg
            className="w-full h-full drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]"
            xmlns="http://www.w3.org/2000/svg"
            width="143.333"
            height="143.315"
            viewBox="0 0 143.333 143.315"
          >
            <path
              id="Subtraction_2"
              d="M23.079,124.333h0A71.85,71.85,0,0,1,6.218,100.9,71.251,71.251,0,0,1,1.611,86.833,72.106,72.106,0,0,1,0,71.657,71.323,71.323,0,0,1,12.24,31.593,71.87,71.87,0,0,1,43.771,5.631a71.582,71.582,0,0,1,67.965,6.607A71.863,71.863,0,0,1,137.7,43.765a71.2,71.2,0,0,1,5.632,27.892,72.106,72.106,0,0,1-1.611,15.176,71.327,71.327,0,0,1-11.876,26.674,72.212,72.212,0,0,1-9.592,10.824,57.355,57.355,0,0,0-97.175,0ZM71.667,28.663a28.663,28.663,0,1,0,28.667,28.663A28.7,28.7,0,0,0,71.667,28.663Z"
              fill="#0abe51"
            />
            <ellipse id="Ellipse_9" cx="71.667" cy="71.657" rx="71.667" ry="71.657" fill="none" />
          </svg>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <label
            htmlFor="email"
            className="flex gap-3 items-center bg-white p-3 opacity-75 w-full max-w-[300px] rounded-full drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]"
          >
            <svg
              className="w-5 h-5 opacity-50 "
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="19.997"
              viewBox="0 0 20 19.997"
            >
              <g id="Group_4" transform="translate(-143.333)">
                <ellipse
                  id="Ellipse_8"
                  cx="10"
                  cy="9.999"
                  rx="10"
                  ry="9.999"
                  transform="translate(143.333)"
                  fill="none"
                />
                <path
                  id="Subtraction_4"
                  d="M16.779,17.349h0a8,8,0,0,0-13.557,0A9.982,9.982,0,0,1,1.708,4.408a10.042,10.042,0,0,1,2.7-2.7A10,10,0,0,1,17.071,2.929a10.117,10.117,0,0,1,1.221,1.48A9.954,9.954,0,0,1,20,10a10.113,10.113,0,0,1-.224,2.118,10.005,10.005,0,0,1-3,5.232ZM10,4a4,4,0,1,0,4,4A4,4,0,0,0,10,4Z"
                  transform="translate(143.333)"
                />
              </g>
            </svg>
            <input
              className="opacity-75   placeholder:text-black"
              type="email"
              name="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label
            htmlFor="password"
            className="flex gap-3 items-center bg-white p-3 opacity-75 w-full max-w-[300px] rounded-full drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              className="w-5 h-5 opacity-50"
            >
              <g id="Group_6" transform="translate(-155.333 -1)">
                <rect
                  id="Rectangle_2"
                  width="20"
                  height="20"
                  transform="translate(155.333 1)"
                  fill="none"
                />
                <path
                  id="Path_1"
                  d="M13.148,7.6V4.853A4.8,4.8,0,0,0,8.4,0H6.326A4.8,4.8,0,0,0,1.582,4.853V7.606A1.913,1.913,0,0,0,0,9.467v8.64A1.921,1.921,0,0,0,1.937,20H12.848a1.921,1.921,0,0,0,1.937-1.893V9.467A1.914,1.914,0,0,0,13.148,7.6ZM8.293,14.055v2.158a.65.65,0,0,1-.655.64H7.474a.649.649,0,0,1-.655-.64V14.088a1.909,1.909,0,0,1-1.255-1.781,1.951,1.951,0,0,1,3.9,0,1.906,1.906,0,0,1-1.173,1.749Zm3.27-6.482h-8.4V4.853A3.21,3.21,0,0,1,6.325,1.6H8.4a3.21,3.21,0,0,1,3.158,3.253v2.72Z"
                  transform="translate(158.333 1)"
                  fill="#231f20"
                />
              </g>
            </svg>

            <input
              className="opacity-75   placeholder:text-black"
              type="password"
              name="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <p>Forgot password? Ask Dalle</p>
        </div>
        <div className="flex flex-col gap-4 items-center w-full">
          <button className="flex justify-center bg-[#0ABE51] hover:bg-[#08913f] p-3 rounded-full max-w-[200px] w-full font-bold text-[#242424] drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]">
            {fetching ? <Loader /> : "Sign in"}
          </button>
          {error && <p className="text-center">{error.message}</p>}
        </div>
      </form>
    </div>
  );
}
