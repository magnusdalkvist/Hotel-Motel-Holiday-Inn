import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import { useProfiles } from "../hooks/Profiles";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useUpdate } from "react-supabase";

export default function Nav() {
  const { session, user } = useAuth();
  const { profiles } = useProfiles();
  const { pathname } = useLocation();
  const points = profiles?.find((data) => data.id == user?.id)?.points;
  const challenges = profiles?.find((profile) => profile.id == user?.id)?.challenges.length;
  const [openMenu, setOpenMenu] = useState(false);
  const [value, setValue] = useState(0);
  const [{ fetching }, execute] = useUpdate("profiles");
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  useEffect(() => {
    if (openMenu && width < 640) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setOpenMenu(false);
    }
  }, [openMenu, width]);

  useEffect(() => {
    if (value == 10000) {
      addPoints(1000);
    }
  }, [value]);

  async function addPoints(pointsAmount) {
    await execute({ points: points + pointsAmount }, (query) => query.eq("id", user?.id));
  }
  return (
    <>
      <nav className="flex px-4 sticky top-0 z-20 bg-[#242424] py-4 h-16 drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]">
        <div className="flex gap-4 justify-between items-center w-full max-w-[1250px] mx-auto">
          <div className="h-8 w-8 sm:hidden cursor-pointer" onClick={() => setOpenMenu(!openMenu)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className={clsx("w-full h-full", openMenu && "hidden")}
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className={clsx("w-full h-full transform", !openMenu && "hidden")}
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
          <div className="gap-4 hidden sm:flex">
            <Link className={clsx(pathname == "/" && "font-bold")} to="/">
              Hjem
            </Link>
            <Link className={clsx(pathname == "/challenges" && "font-bold")} to="/challenges">
              Udfordringer
            </Link>
            <Link className={clsx(pathname == "/auctions" && "font-bold")} to="/auctions">
              Auktioner
            </Link>
          </div>
          {!user ? (
            <Link className={clsx(pathname == "/signin" && "font-bold")} to="/signin">
              Log ind
            </Link>
          ) : (
            <Link className={clsx(pathname == "/account" && "font-bold")} to="/account">
              Konto ({points} point
              {challenges > 0 && ` | ${challenges} challenge${challenges > 1 ? "s" : ""}`})
            </Link>
          )}
        </div>
      </nav>
      <div
        className={clsx(
          "bg-[#333] sm:hidden gap-8 fixed inset-0 z-10 transition-all duration-500 mt-16 flex flex-col items-center justify-between pt-16",
          !openMenu && "-translate-y-full"
        )}
      >
        <div className="gap-8 flex flex-col items-center">
          <Link
            onClick={() => setOpenMenu(false)}
            className={clsx(
              pathname == "/" && "font-bold",
              "text-4xl text-[rgba(255,255,255,0.87)] hover:text-[rgba(255,255,255,0.87)] drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]"
            )}
            to="/"
          >
            Hjem
          </Link>
          <Link
            onClick={() => setOpenMenu(false)}
            className={clsx(
              pathname == "/challenges" && "font-bold",
              "text-4xl text-[rgba(255,255,255,0.87)] hover:text-[rgba(255,255,255,0.87)] drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]"
            )}
            to="/challenges"
          >
            Udfordringer
          </Link>
          <Link
            onClick={() => setOpenMenu(false)}
            className={clsx(
              pathname == "/auctions" && "font-bold",
              "text-4xl text-[rgba(255,255,255,0.87)] hover:text-[rgba(255,255,255,0.87)] drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]"
            )}
            to="/auctions"
          >
            Auktioner
          </Link>
        </div>
        <div className="text-xs p-4 flex flex-col gap-2 items-center select-none cursor-pointer">
          <span>
            {value >= 10 && value < 50 && "Jeg ved du elsker clicker games hønse :D"}
            {value >= 50 && value < 69 && "Keep going!"}
            {value == 69 && "Nice ;)"}
            {value >= 70 && value < 100 && "Keep going!"}
            {value >= 100 && value < 200 && "Det er det hele værd"}
            {value >= 200 && value < 300 && "Er du stadigvæk igang?"}
            {value >= 300 && value < 400 && "Hvad mon der sker hvis du fortsætter"}
            {value >= 400 && value < 500 && "Du er en trooper!"}
            {value >= 500 && value < 600 && "Halvejs?"}
            {value >= 600 && value < 700 && "Lets goooooo"}
            {value >= 700 && value < 800 && "Du er en legende!"}
            {value >= 800 && value < 900 && "Næsten der!"}
            {value >= 900 && value < 1000 && "Snart 1000!"}
            {value >= 10000 && "Nyd dine 1000 gratis point ;)"}
          </span>
          <span onClick={() => setValue(value + 1)}>{value}</span>
        </div>
      </div>
    </>
  );
}
