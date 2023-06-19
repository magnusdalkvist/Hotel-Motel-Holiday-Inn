import { useRealtime, useSelect, useUpdate } from "react-supabase";
import { useAuth } from "../hooks/Auth";
import clsx from "clsx";
import { useProfiles } from "../hooks/Profiles";
import { useState } from "react";
import Loader from "../components/Loader";

export default function Perks() {
  const { user } = useAuth();
  const { profiles } = useProfiles();
  const [{ count, data, error, fetching: fetchingPerks }] = useSelect("perks");

  const points = profiles?.find((data) => data.id == user?.id)?.points ?? 0;

  return (
    <div>
      <h2 className="text-2xl">Perks</h2>
      {fetchingPerks && <p>Loading...</p>}
      {error ? (
        <p>{error.message}</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {data
            ?.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
            .map((perk) => (
              <Perk perk={perk} key={perk.id} />
            ))}
        </div>
      )}
    </div>
  );

  function Perk({ perk }) {
    const [{ fetching: fetchingSend }, execute] = useUpdate("profiles");
    const [recipient, setRecipient] = useState("none");

    async function redeemPerk() {
      if (recipient == "none") return;
      await execute({ points: points - perk.price }, (query) => query.eq("id", user?.id));
      await execute(
        {
          perks: [
            ...profiles.find((profile) => profile.id == recipient).perks,
            { type: "perk", ...perk },
          ],
        },
        (query) => query.eq("id", recipient)
      );
    }
    return (
      <div
        key={perk.id}
        className={clsx("bg-[#555] p-4 rounded-xl", perk.price > points && "opacity-50")}
      >
        <h3 className="text-xl">{perk.name}</h3>
        <p>{perk.price} point</p>
        <button onClick={redeemPerk} disabled={perk.price > points}>
          {fetchingSend ? <Loader /> : "Send"}
        </button>
        <select
          className="bg-[#333] p-3 rounded-lg"
          disabled={perk.price > points}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        >
          <option className="rounded-t-none" value="none" selected disabled hidden>
            Select recipient
          </option>
          {profiles
            ?.filter((profile) => profile.id != user?.id)
            // .sort((a, b) => a.first_name.localeCompare(b.first_name))
            .map((user) => (
              <option key={user.id} value={user.id}>
                {user.nickname ? (
                  <>
                    {user.nickname} ({user.first_name} {user.last_name})
                  </>
                ) : (
                  <>
                    {user.first_name} {user.last_name}
                  </>
                )}
              </option>
            ))}
        </select>
      </div>
    );
  }
}
