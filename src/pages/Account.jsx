import { useClient, useRealtime, useSelect, useSignOut, useUpdate } from "react-supabase";
import { useAuth } from "../hooks/Auth";
import { useEffect, useState } from "react";
import { useProfiles } from "../hooks/Profiles";

export default function Account() {
  const client = useClient();
  const [nickname, setNickname] = useState("");
  const { session, user } = useAuth();
  const [{ error, fetching }, signOut] = useSignOut();
  const [{}, execute] = useUpdate("profiles");
  const { profiles } = useProfiles();
  const [{ data: perks }] = useSelect("perks");

  const firstName = profiles?.find((profile) => profile.id == user?.id)?.first_name;
  const lastName = profiles?.find((profile) => profile.id == user?.id)?.last_name;
  const currentNickname = profiles?.find((profile) => profile.id == user?.id)?.nickname;

  async function onClickSignOut() {
    const { error } = await signOut();
  }

  async function updateUser(e) {
    e.preventDefault();
    const { count, data, error } = await execute({ nickname }, (query) => query.eq("id", user.id));
  }

  useEffect(() => {
    if (profiles) {
      setNickname(profiles?.find((profile) => profile.id == user?.id)?.nickname);
      console.log(profiles.find((profile) => profile.id == user?.id));
    }
  }, [profiles]);

  if (session)
    return (
      <div className="flex flex-col gap-4 items-start">
        <h1>Hej {currentNickname || firstName},</h1>
        <div>
          <h2 className="text-2xl">Edit info</h2>
          <form className="flex flex-col items-start gap-2" onSubmit={updateUser}>
            <div className="flex gap-4">
              <label htmlFor="firstName" className="flex flex-col">
                First name
                <input type="text" name="firstName" value={firstName} disabled />
              </label>
              <label htmlFor="lastName" className="flex flex-col">
                Last name
                <input type="text" name="lastName" value={lastName} disabled />
              </label>
              <label htmlFor="lastName" className="flex flex-col">
                Nickname
                <input
                  type="text"
                  name="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </label>
            </div>
            <input type="submit" value="Update info" />
          </form>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {profiles
            ?.find((profile) => profile.id == user?.id)
            .perks?.map((perk) => (
              <Perk perk={perk} />
            ))}
        </div>
        <button onClick={onClickSignOut}>Sign out</button>
      </div>
    );
  else return <h1>Not logged in</h1>;

  function Perk({ perk }) {
    async function redeemPerk() {
      const profile = profiles?.find((profile) => profile.id === user?.id);
      const index =
        perk.type == "perk"
          ? profile?.perks.findIndex((p) => p.id === perk.id && p.type == "perk")
          : profile?.perks.findIndex((p) => p.id === perk.id && p.type == "auction");

      if (index !== -1) {
        const updatedPerks = [...profile.perks.slice(0, index), ...profile.perks.slice(index + 1)];

        await execute(
          {
            perks: updatedPerks,
          },
          (query) => query.eq("id", user.id)
        );
      }
      await execute(
        {
          points:
            perk.type == "perk"
              ? profiles?.find((profile) => profile.id == user?.id)?.points + perk.price / 2
              : profiles?.find((profile) => profile.id == user?.id)?.points + perk.price,
        },
        (query) => query.eq("id", user.id)
      );
    }

    return (
      <div key={perk.id} className="bg-[#555] p-4 rounded-xl">
        <p className="text-xs capitalize">{perk.type}</p>
        <h3 className="text-xl">{perk.name}</h3>
        {perk.type == "perk" ? <p>{perk.price / 2} point</p> : <p>{perk.price} point</p>}
        <button onClick={redeemPerk}>Redeem</button>
      </div>
    );
  }
}
