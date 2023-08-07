import { useRealtime, useSelect, useUpdate } from "react-supabase";
import { useAuth } from "../hooks/Auth";
import clsx from "clsx";
import { useProfiles } from "../hooks/Profiles";
import { useState } from "react";
import Loader from "../components/Loader";

export default function Challenges() {
  const { user } = useAuth();
  const { profiles } = useProfiles();
  const [{ count, data, error, fetching: fetchingChallenges }] = useSelect("challenges");

  const points = profiles?.find((data) => data.id == user?.id)?.points ?? 0;

  return (
    <div className="max-w-[1250px] mx-auto  w-full">
      <h1 className="mb-8 font-bold text-5xl md:text-7xl  drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]">
        Udfordringer
      </h1>
      {fetchingChallenges && <p>Indlæser...</p>}
      {error ? (
        <p>{error.message}</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]">
          {data
            ?.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
            .map((challenge) => (
              <Challenge challenge={challenge} key={challenge.id} />
            ))}
        </div>
      )}
    </div>
  );

  function Challenge({ challenge }) {
    const [{ fetching: fetchingSend }, execute] = useUpdate("profiles");
    const [recipient, setRecipient] = useState("none");

    async function redeemChallenge() {
      if (recipient == "none") return;
      await execute({ points: points - challenge.price }, (query) => query.eq("id", user?.id));
      await execute(
        {
          challenges: [
            ...profiles.find((profile) => profile.id == recipient).challenges,
            { type: "challenge", ...challenge, from: user?.id },
          ],
        },
        (query) => query.eq("id", recipient)
      );
    }
    return (
      <div
        key={challenge.id}
        className={clsx(
          "bg-[#333] p-4 rounded-xl flex flex-col gap-4",
          challenge.price > points && "opacity-50"
        )}
      >
        <div className="flex gap-4 justify-between">
          <h3 className="text-xl">{challenge.name}</h3>
          <p></p>
        </div>
        <select
          className="bg-[#242424] p-2 rounded-lg cursor-pointer"
          disabled={challenge.price > points}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        >
          <option className="rounded-t-none" value="none" selected disabled hidden>
            Vælg en løve
          </option>
          {profiles
            ?.filter((profile) => profile.id != user?.id)
            // .sort((a, b) => a.first_name.localeCompare(b.first_name))
            .map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
        </select>
        <button
          onClick={redeemChallenge}
          disabled={challenge.price > points}
          className="bg-[#242424] px-4 py-2 rounded-lg flex font-bold justify-center w-full hover:bg-[#0ABE51] active:bg-[#08913f] hover:text-[#242424] transition duration-300 disabled:bg-[#242424] disabled:text-[rgba(255,255,255,0.87)] disabled:cursor-not-allowed"
        >
          {fetchingSend ? <Loader /> : `${challenge.price} point`}
        </button>
      </div>
    );
  }
}
