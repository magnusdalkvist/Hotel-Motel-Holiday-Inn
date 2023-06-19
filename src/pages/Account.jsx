import { useClient, useSelect, useSignOut, useUpdate } from "react-supabase";
import { useAuth } from "../hooks/Auth";
import { useEffect, useState } from "react";
import { useProfiles } from "../hooks/Profiles";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const client = useClient();
  const navigate = useNavigate();
  const { session, user } = useAuth();
  const { profiles } = useProfiles();
  const [nickname, setNickname] = useState("");
  const [{ error }, signOut] = useSignOut();
  const [{ fetching }, execute] = useUpdate("profiles");
  const [{ data: perks }] = useSelect("perks");
  const [avatar, setAvatar] = useState(null);
  const [fileName, setFileName] = useState(null);

  const firstName = profiles?.find((profile) => profile.id == user?.id)?.first_name;
  const lastName = profiles?.find((profile) => profile.id == user?.id)?.last_name;
  const currentNickname = profiles?.find((profile) => profile.id == user?.id)?.nickname;

  async function onClickSignOut() {
    const { error } = await signOut();
  }

  async function removeAvatar() {
    await client.storage.from("avatars").remove([user.id + "/avatar"]);
    setAvatar("avatar.webp");
  }

  async function updateUser(e) {
    e.preventDefault();
    let file = e.target.myFile.files[0];
    const { count, data, error } = await execute({ nickname }, (query) => query.eq("id", user.id));
    const { error: fileError } = await client.storage
      .from("avatars")
      .upload(user.id + "/avatar", file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (fileError) {
      await client.storage.from("avatars").update(user.id + "/avatar", file, {
        cacheControl: "3600",
        upsert: false,
      });
    }

    setAvatar(
      `https://fxrkypplzrbtfuemvgzn.supabase.co/storage/v1/object/public/avatars/${
        user?.id
      }/avatar?cache=${Date.now()}`
    );
  }

  useEffect(() => {
    if (profiles) {
      setNickname(profiles?.find((profile) => profile.id == user?.id)?.nickname);
      setAvatar(
        `https://fxrkypplzrbtfuemvgzn.supabase.co/storage/v1/object/public/avatars/${
          user?.id
        }/avatar?cache=${Date.now()}`
      );
    }
  }, [profiles]);

  if (session)
    return (
      <div className="flex flex-col gap-4 py-[100px] items-center">
        <div className="account-avatar w-1/3" onClick={removeAvatar}>
          <img
            src={avatar}
            className="w-full h-full object-cover aspect-square rounded-full bg-[#333] drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]"
            onError={({ currentTarget }) => (currentTarget.src = "avatar.webp")}
          />
        </div>
        <h1>Hej {currentNickname || firstName},</h1>
        <div>
          <h2 className="text-2xl">Edit info</h2>
          <form className="flex flex-col items-center gap-4" onSubmit={updateUser}>
            <div className="grid grid-cols-2 gap-4">
              <label htmlFor="firstName" className="flex flex-col">
                First name
                <input type="text" name="firstName" id="firstName" value={firstName} disabled />
              </label>
              <label htmlFor="lastName" className="flex flex-col">
                Last name
                <input type="text" name="lastName" id="lastName" value={lastName} disabled />
              </label>
              <label htmlFor="nickname" className="flex flex-col">
                Nickname
                <input
                  type="text"
                  name="nickname"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </label>
              <div className="flex flex-col">
                Profile picture
                <label htmlFor="myFile" className="flex flex-col">
                  {fileName ? fileName : "Upload image"}
                  <input
                    type="file"
                    id="myFile"
                    name="myFile"
                    className="hidden"
                    accept="image/jpg, image/png, image/gif, image/jpeg"
                    onChange={(e) => setFileName(e.target.files[0].name)}
                  />
                </label>
              </div>
            </div>
            <button className="bg-[#0ABE51] p-3 rounded-full max-w-[200px] w-full font-bold text-[#242424] drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]">
              {fetching ? <Loader /> : "Update info"}
            </button>
          </form>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {profiles
            ?.find((profile) => profile.id == user?.id)
            .perks?.map((perk) => (
              <Perk perk={perk} />
            ))}
        </div>
        <button
          onClick={onClickSignOut}
          className="bg-[#333] p-3 rounded-full max-w-[200px] w-full font-bold drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]"
        >
          Sign out
        </button>
      </div>
    );
  else navigate("/login");

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
          (query) => query.eq("id", user?.id)
        );
      }
      await execute(
        {
          points:
            perk.type == "perk"
              ? profiles?.find((profile) => profile.id == user?.id)?.points + perk.price / 2
              : profiles?.find((profile) => profile.id == user?.id)?.points + perk.price,
        },
        (query) => query.eq("id", user?.id)
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
